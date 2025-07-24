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
        } else {
            console.error(`Продукт с ID ${productId} не найден в ProductModel`);
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
        this.basketModal = new ModalView('.modal:not([data-modal-type])');
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
            console.error('Order template not found.');
            return;
        }

        const orderContent = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!orderContent) {
            console.error('Order content could not be cloned.');
            return;
        }

        this.orderModal = new ModalView('.modal:not([data-modal-type])');
        this.orderModal.setContent(orderContent);
        this.orderModal.open();

        this.setupOrderForm(orderContent);
    }

    private setupOrderForm(formElement: HTMLElement): void {
        const paymentButtons = formElement.querySelectorAll('.order__buttons .button') as NodeListOf<HTMLButtonElement>;
        const addressInput = formElement.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = formElement.querySelector('.order__button') as HTMLButtonElement;
        const errorElement = formElement.querySelector('.form__errors') as HTMLElement;

        let selectedPaymentMethod: 'card' | 'cash' | null = null;
        let address = '';

        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('button_alt_active'));
                button.classList.add('button_alt_active');
                selectedPaymentMethod = button.name as 'card' | 'cash';
                this.validateOrderForm(nextButton, errorElement, selectedPaymentMethod, address);
            });
        });

        if (addressInput) {
            addressInput.addEventListener('input', () => {
                address = addressInput.value.trim();
                this.validateOrderForm(nextButton, errorElement, selectedPaymentMethod, address);
            });
        }

        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            if (selectedPaymentMethod && address) {
                this.eventEmitter.emit('orderSubmitted', { paymentMethod: selectedPaymentMethod, shippingAddress: address });
            }
        });
    }

    private validateOrderForm(button: HTMLButtonElement, errorElement: HTMLElement, paymentMethod: string | null, address: string): void {
        if (!paymentMethod || !address) {
            button.disabled = true;
            errorElement.textContent = !paymentMethod ? 'Выберите способ оплаты' : 'Введите адрес доставки';
        } else {
            button.disabled = false;
            errorElement.textContent = '';
        }
    }

    private handleOrderSubmitted(data: { paymentMethod: 'card' | 'cash', shippingAddress: string }): void {

        if (this.orderModal) {
            this.orderModal.close();
        }

        const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
        if (!contactsTemplate) {
            console.error('Contacts template not found.');
            return;
        }

        const contactsContent = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!contactsContent) {
            console.error('Contacts content could not be cloned.');
            return;
        }

        this.contactsModal = new ModalView('.modal:not([data-modal-type])');
        this.contactsModal.setContent(contactsContent);
        this.contactsModal.open();

        this.setupContactsForm(contactsContent, data.paymentMethod, data.shippingAddress);
    }

    private setupContactsForm(formElement: HTMLElement, paymentMethod: 'card' | 'cash', shippingAddress: string): void {
        const emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement;
        const submitButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorElement = formElement.querySelector('.form__errors') as HTMLElement;

        let email = '';
        let phone = '';

        if (emailInput) {
            emailInput.addEventListener('input', () => {
                email = emailInput.value.trim();
                this.validateContactsForm(submitButton, errorElement, email, phone);
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                phone = phoneInput.value.trim();
                this.validateContactsForm(submitButton, errorElement, email, phone);
            });
        }

        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            if (email && phone) {
                this.eventEmitter.emit('contactsSubmitted', { paymentMethod, shippingAddress, email, phone });
            }
        });
    }

    private validateContactsForm(button: HTMLButtonElement, errorElement: HTMLElement, email: string, phone: string): void {
        const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
        if (!email || !emailRegex.test(email)) {
            button.disabled = true;
            errorElement.textContent = 'Введите корректный email';
        } else if (!phone || phone.length < 10) {
            button.disabled = true;
            errorElement.textContent = 'Введите корректный телефон (минимум 10 символов)';
        } else {
            button.disabled = false;
            errorElement.textContent = '';
        }
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

            const successTemplate = document.getElementById('success') as HTMLTemplateElement;
            if (!successTemplate) {
                console.error('Success template not found.');
                return;
            }

            const successContent = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            if (!successContent) {
                console.error('Success content could not be cloned.');
                return;
            }

            const priceElement = successContent.querySelector('.order-success__description') as HTMLElement;
            if (priceElement) {
                priceElement.textContent = `Списано ${totalPrice} синапсов`;
            }

            const closeButton = successContent.querySelector('.order-success__close') as HTMLButtonElement;
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    if (this.successModal) {
                        this.successModal.close();
                    }
                });
            }
            this.successModal = new ModalView('.modal[data-modal-type="success"]');
            this.successModal.setContent(successContent);
            this.successModal.open();

            if (this.contactsModal) {
                this.contactsModal.close();
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            const errorElement = document.querySelector('.form__errors') as HTMLElement;
            if (errorElement) {
                errorElement.textContent = 'Ошибка при отправке заказа. Попробуйте снова.';
            }
        }
    }
}