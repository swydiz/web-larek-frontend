
import { Api } from '../components/base/api';
import { EventEmitter } from '../components/base/events';
import { ProductModel } from '../model/Productodel';
import { MainPageView } from '../view/MainPageView';
import { Card } from '../components/base/Card';
import { Product } from '../types/product';
import { API_URL } from '../utils/constants';
import { ProductDetail } from '../components/base/ProductDetail';
import { ModalView } from '../view/ModalView';
import { CartModel } from '../model/CartModel';
import { CartView } from '../view/CartView';
import { DeliveryAddressView } from '../view/DeliveryAddressView';
import { ContactInfoView } from '../view/ContactInfoView';
import { SuccessView } from '../view/SuccessView';

export class MainPresenter {
    private api: Api;
    private eventEmitter: EventEmitter;
    private productModel: ProductModel;
    private cartModel: CartModel;
    private mainPageView: MainPageView;
    private cartView: CartView;
    private cardTemplate: HTMLTemplateElement;
    private cardPreviewTemplate: HTMLTemplateElement;
    private modalView: ModalView;
    private basketModal: ModalView | null = null;
    private orderModal: ModalView | null = null;
    private contactsModal: ModalView | null = null;
    private successModal: ModalView | null = null;

    constructor() {
        this.api = new Api(API_URL);
        this.eventEmitter = new EventEmitter();
        this.productModel = new ProductModel(this.api, this.eventEmitter);
        this.cartModel = new CartModel(this.eventEmitter);
        const productListContainer = document.querySelector<HTMLElement>('.gallery');
        const basketCounterElement = document.querySelector<HTMLElement>('.header__basket-counter');
        const basketIconElement = document.querySelector<HTMLElement>('.header__basket');
        if (!productListContainer || !basketCounterElement || !basketIconElement) {
            throw new Error('One or more required DOM elements not found.');
        }
        this.mainPageView = new MainPageView(productListContainer, basketCounterElement, basketIconElement, this.eventEmitter);
        this.modalView = new ModalView('.modal[data-modal-type="product-detail"]');
        this.cartView = new CartView(this.eventEmitter);
        this.cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
        this.cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        if (!this.cardTemplate || !this.cardPreviewTemplate) {
            throw new Error('Card template not found.');
        }
        this.eventEmitter.on<Product[]>('productsLoaded', (products: Product[]) => {
            this.handleProductsLoaded(products);
        });
        this.eventEmitter.on<{ productId: string }>('addToCart', (data: { productId: string }) => {
            this.handleAddToCart(data.productId);
        });
        this.eventEmitter.on<{ productId: string }>('removeFromCart', (data: { productId: string }) => {
            this.handleRemoveFromCart(data.productId);
        });
        this.eventEmitter.on('openBasket', () => {
            this.handleOpenBasket();
        });
        this.eventEmitter.on('checkout', () => {
            this.handleCheckout();
        });
        this.eventEmitter.on('orderSubmitted', (data: { paymentMethod: 'card' | 'cash', shippingAddress: string }) => {
            this.handleOrderSubmitted(data);
        });
        this.eventEmitter.on('contactsSubmitted', (data: { paymentMethod: 'card' | 'cash', shippingAddress: string, email: string, phone: string }) => {
            this.handleContactsSubmitted(data);
        });
        this.eventEmitter.on('closeSuccess', () => {
            if (this.successModal) {
                this.successModal.close();
            }
            // Явно закрываем все остальные модальные окна
            if (this.basketModal) {
                this.basketModal.close();
            }
            if (this.orderModal) {
                this.orderModal.close();
            }
            if (this.contactsModal) {
                this.contactsModal.close();
            }
            if (this.modalView) {
                this.modalView.close();
            }
        });
        this.eventEmitter.on<{ count: number }>('basketCountUpdated', (data: { count: number }) => {
            this.mainPageView.setBasketCount(data.count);
        });
        this.productModel.getProducts();
    }

    private handleProductsLoaded(products: Product[]): void {
        const productCardElements: HTMLElement[] = products.map((product: Product) => {
            const cardComponent = new Card(this.cardTemplate);
            const cardElement = cardComponent.render(product);
            cardElement.addEventListener('click', () => {
                this.openModal(product);
            });
            return cardElement;
        });
        this.mainPageView.render(productCardElements);
    }

    private openModal(product: Product): void {
        const productDetail = new ProductDetail(this.cardPreviewTemplate, this.eventEmitter, this.cartModel);
        const detailContent = productDetail.render(product);
        this.modalView.setContent(detailContent);
        this.modalView.open();
        const button = detailContent.querySelector('.card__button') as HTMLButtonElement;
        if (button) {
            button.setAttribute('data-product-id', product.id);
        }
    }

    private handleAddToCart(productId: string): void {
        const product = this.productModel.getProductById(productId);
        if (product) {
            this.cartModel.addItem(product);
        }
    }

    private handleRemoveFromCart(productId: string): void {
        this.cartModel.removeItem(productId);
        if (this.basketModal && this.basketModal.isOpen()) {
            const cartItems = this.cartModel.getItems();
            const cartContent = this.cartView.render(cartItems);
            this.basketModal.setContent(cartContent);
        }
    }

    private handleOpenBasket(): void {
        const cartItems = this.cartModel.getItems();
        const cartContent = this.cartView.render(cartItems);
        this.basketModal = new ModalView('.modal:nth-of-type(2)'); // Корзина - второй .modal
        this.basketModal.setContent(cartContent);
        this.basketModal.open();
    }

    private handleCheckout(): void {
        const cartItems = this.cartModel.getItems();
        const totalPrice = this.cartModel.getTotalPrice();
        if (totalPrice === 0) {
            return;
        }
        const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
        if (!orderTemplate) {
            return;
        }
        const orderContent = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!orderContent) {
            return;
        }
        this.orderModal = new ModalView('.modal:nth-of-type(3)'); // Заказ - третий .modal
        this.orderModal.setContent(orderContent);
        new DeliveryAddressView(orderContent, this.eventEmitter);
        this.orderModal.open();
    }

    private handleOrderSubmitted(data: { paymentMethod: 'card' | 'cash', shippingAddress: string }): void {
        if (this.orderModal) {
            this.orderModal.close();
        }
        const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
        if (!contactsTemplate) {
            return;
        }
        const contactsContent = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!contactsContent) {
            return;
        }
        this.contactsModal = new ModalView('.modal:nth-of-type(4)'); // Контакты - четвертый .modal
        this.contactsModal.setContent(contactsContent);
        new ContactInfoView(contactsContent, this.eventEmitter, data.paymentMethod, data.shippingAddress);
        this.contactsModal.open();
    }

    private async handleContactsSubmitted(data: { paymentMethod: 'card' | 'cash', shippingAddress: string, email: string, phone: string }): Promise<void> {
        const cartItems = this.cartModel.getItems();
        const totalPrice = this.cartModel.getTotalPrice();
        const itemsToSend = cartItems
            .filter(item => item.price !== null)
            .map(item => item.id);
        if (itemsToSend.length === 0) {
            const errorElement = document.querySelector('.form__errors') as HTMLElement;
            if (errorElement) {
                errorElement.textContent = 'В корзине нет товаров с указанной ценой.';
            }
            return;
        }
        const orderData = {
            items: itemsToSend,
            total: totalPrice,
            payment: data.paymentMethod,
            address: data.shippingAddress,
            email: data.email,
            phone: data.phone,
        };
        try {
            const response = await this.api.post('/order', orderData);
            this.cartModel.getItems().forEach(item => this.cartModel.removeItem(item.id));
            this.eventEmitter.emit('basketCountUpdated', { count: 0 });
            // Закрываем все модальные окна перед открытием окна успеха
            if (this.basketModal) {
                this.basketModal.close();
            }
            if (this.orderModal) {
                this.orderModal.close();
            }
            if (this.contactsModal) {
                this.contactsModal.close();
            }
            if (this.modalView) {
                this.modalView.close();
            }
            const successTemplate = document.getElementById('success') as HTMLTemplateElement;
            if (!successTemplate) {
                return;
            }
            const successContent = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            if (!successContent) {
                return;
            }
            this.successModal = new ModalView('.modal[data-modal-type="success"]');
            const successView = new SuccessView(successContent, this.eventEmitter);
            successView.setTotalPrice(totalPrice);
            this.successModal.setContent(successView.render());
            this.successModal.open();
        } catch (error) {
            const errorElement = document.querySelector('.form__errors') as HTMLElement;
            if (errorElement) {
                errorElement.textContent = 'Ошибка при отправке заказа. Попробуйте снова.';
            }
        }
    }
}