import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './model/ProductModel';
import { MainPageView } from './view/MainPageView';
import { Card } from './components/base/Card';
import { BasketCard } from './components/base/BasketCard';
import { Product } from './types/product';
import { API_URL } from './utils/constants';
import { ProductDetail } from './components/base/ProductDetail';
import { ModalView } from './view/ModalView';
import { CartModel } from './model/CartModel';
import { CartView } from './view/CartView';
import { DeliveryAddressView } from './view/DeliveryAddressView';
import { ContactInfoView } from './view/ContactInfoView';
import { SuccessView } from './view/SuccessView';
import { ApiListResponse } from './components/base/api';
import { OrderModel } from './model/OrderModel';
import { ContactFormData, DeliveryAddressFormData } from './types/order';

// Инициализация
const eventEmitter = new EventEmitter();
const api = new Api(API_URL);
const productModel = new ProductModel(eventEmitter);
const cartModel = new CartModel(eventEmitter);
const orderModel = new OrderModel(eventEmitter);
const mainPageView = new MainPageView(eventEmitter);
const modalView = new ModalView('.modal');
const cartView = new CartView(eventEmitter);
const basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
let currentProductDetail: ProductDetail | null = null;

// Обработчики событий
eventEmitter.on<Product[]>('productsLoaded', (products: Product[]) => {
    const cardElements = products.map(product => {
        const card = new Card(document.getElementById('card-catalog') as HTMLTemplateElement, () => {
            eventEmitter.emit('showProductDetail', { product });
        });
        return card.render(product);
    });
    mainPageView.render(cardElements);
});

eventEmitter.on<{ productId: string }>('toggleCartItem', (data: { productId: string }) => {
    const product = productModel.getProductById(data.productId);
    if (product) {
        const isInCart = cartModel.getItems().some(item => item.id === data.productId);
        if (isInCart) {
            cartModel.removeItem(data.productId);
        } else {
            cartModel.addItem(product);
        }
        eventEmitter.emit('checkCartItem', { productId: data.productId });
    }
});

eventEmitter.on<{ productId: string }>('checkCartItem', (data) => {
    if (modalView.getCurrentContentType() === 'productDetail' && currentProductDetail) {
        const isInCart = cartModel.getItems().some(item => item.id === data.productId);
        currentProductDetail.updateButtonState(isInCart);
    }
});

eventEmitter.on<{ items: Product[], totalPrice: number }>('cartUpdated', (data) => {
    eventEmitter.emit('basketCountUpdated', { count: data.items.length });
    if (modalView.getCurrentContentType() === 'cart') {
        const cartItemElements = data.items.map((item, index) => {
            const basketCard = new BasketCard(basketCardTemplate, eventEmitter);
            return basketCard.render(item, index);
        });
        const cartContent = cartView.render(cartItemElements, data.totalPrice);
        modalView.setContent(cartContent, 'cart');
    }
});

eventEmitter.on('openBasket', () => {
    const cartItems = cartModel.getItems();
    const totalPrice = cartModel.getTotalPrice();
    const cartItemElements = cartItems.map((item, index) => {
        const basketCard = new BasketCard(basketCardTemplate, eventEmitter);
        return basketCard.render(item, index);
    });
    const cartContent = cartView.render(cartItemElements, totalPrice);
    modalView.setContent(cartContent, 'cart');
    modalView.open();
});

eventEmitter.on('removeFromCart', (data: { productId: string }) => {
    cartModel.removeItem(data.productId);
});

eventEmitter.on<Partial<DeliveryAddressFormData>>('deliveryAddressInput', (data) => {
    orderModel.updateDeliveryAddress(data);
});

eventEmitter.on<Partial<ContactFormData>>('contactInfoInput', (data) => {
    orderModel.updateContactInfo(data);
});

eventEmitter.on('checkout', () => {
    const cartItems = cartModel.getItems();
    const totalPrice = cartModel.getTotalPrice();
    if (totalPrice === 0) {
        eventEmitter.emit('checkoutError', { message: 'В корзине нет товаров с указанной ценой.' });
        return;
    }
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    if (!orderTemplate) {
        eventEmitter.emit('checkoutError', { message: 'Шаблон заказа не найден.' });
        return;
    }
    const orderContent = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!orderContent) {
        eventEmitter.emit('checkoutError', { message: 'Контент заказа не найден.' });
        return;
    }
    new DeliveryAddressView(orderContent, eventEmitter);
    modalView.setContent(orderContent, 'order');
    modalView.open();
});

eventEmitter.on('orderSubmitted', () => {
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    if (!contactsTemplate) {
        eventEmitter.emit('checkoutError', { message: 'Шаблон контактов не найден.' });
        return;
    }
    const contactsContent = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!contactsContent) {
        eventEmitter.emit('checkoutError', { message: 'Контент контактов не найден.' });
        return;
    }
    new ContactInfoView(contactsContent, eventEmitter);
    modalView.setContent(contactsContent, 'contacts');
    modalView.open();
});

eventEmitter.on('contactsSubmitted', async () => {
    const cartItems = cartModel.getItems();
    const totalPrice = cartModel.getTotalPrice();
    const { deliveryAddress, contactInfo } = orderModel.getOrderData();
    const itemsToSend = cartItems
        .filter(item => item.price !== null)
        .map(item => item.id);
    if (itemsToSend.length === 0) {
        eventEmitter.emit('checkoutError', { message: 'В корзине нет товаров с указанной ценой.' });
        return;
    }
    const requestData = {
        items: itemsToSend,
        total: totalPrice,
        payment: deliveryAddress.paymentMethod,
        address: deliveryAddress.shippingAddress,
        email: contactInfo.email,
        phone: contactInfo.phone,
    };
    try {
        await api.post('/order', requestData);
        cartModel.getItems().forEach(item => cartModel.removeItem(item.id));
        orderModel.clearOrderData();
        eventEmitter.emit('basketCountUpdated', { count: 0 });

        const successTemplate = document.getElementById('success') as HTMLTemplateElement;
        if (!successTemplate) {
            eventEmitter.emit('checkoutError', { message: 'Шаблон успеха не найден.' });
            return;
        }
        const successContent = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!successContent) {
            eventEmitter.emit('checkoutError', { message: 'Контент успеха не найден.' });
            return;
        }
        const successView = new SuccessView(successContent, eventEmitter);
        successView.setTotalPrice(totalPrice);
        modalView.setContent(successView.render(), 'success');
        modalView.open();
    } catch (error) {
        eventEmitter.emit('checkoutError', { message: 'Ошибка при отправке заказа. Попробуйте снова.' });
    }
});

eventEmitter.on('closeSuccess', () => {
    modalView.close();
});

eventEmitter.on('showProductDetail', (data: { product: Product }) => {
    currentProductDetail = new ProductDetail(document.getElementById('card-preview') as HTMLTemplateElement, eventEmitter);
    modalView.setContent(currentProductDetail.render(data.product), 'productDetail');
    modalView.open();
});

eventEmitter.on<{ count: number }>('basketCountUpdated', (data: { count: number }) => {
    mainPageView.setBasketCount(data.count);
});

eventEmitter.on<{ message: string }>('checkoutError', (data) => {
    const errorElement = document.createElement('div');
    errorElement.textContent = data.message;
    modalView.setContent(errorElement, 'cart'); // Используем 'cart' вместо 'error'
    modalView.open();
});

// Загрузка товаров
async function loadProducts() {
    try {
        const response = await api.get('/product') as ApiListResponse<Product>;
        productModel.setProducts(response.items);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

loadProducts();