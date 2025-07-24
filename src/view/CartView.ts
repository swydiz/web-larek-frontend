import { EventEmitter } from '../components/base/events';
import { Product } from '../types/product';

export class CartView {
    private basketTemplate: HTMLTemplateElement;
    private basketItemTemplate: HTMLTemplateElement;
    private basketListElement: HTMLElement;
    private basketPriceElement: HTMLElement;
    private checkoutButton: HTMLButtonElement;
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        this.basketItemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
        this.eventEmitter = eventEmitter;

        if (!this.basketTemplate || !this.basketItemTemplate) {
            throw new Error('CartView: Basket or basket item template not found.');
        }

        const basketElement = this.basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        this.basketListElement = basketElement.querySelector('.basket__list') as HTMLElement;
        this.basketPriceElement = basketElement.querySelector('.basket__price') as HTMLElement;
        this.checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;

        if (!this.basketListElement || !this.basketPriceElement || !this.checkoutButton) {
            throw new Error('CartView: Required basket elements not found.');
        }

        this.checkoutButton.addEventListener('click', () => {
            this.eventEmitter.emit('checkout');
        });
    }

    render(cartItems: Product[]): HTMLElement {
        this.basketListElement.innerHTML = '';

        cartItems.forEach((item, index) => {
            const basketItemElement = this.basketItemTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            const indexElement = basketItemElement.querySelector('.basket__item-index') as HTMLElement;
            const titleElement = basketItemElement.querySelector('.card__title') as HTMLElement;
            const priceElement = basketItemElement.querySelector('.card__price') as HTMLElement;
            const deleteButton = basketItemElement.querySelector('.basket__item-delete') as HTMLButtonElement;

            if (indexElement) indexElement.textContent = (index + 1).toString();
            if (titleElement) titleElement.textContent = item.title;
            if (priceElement) priceElement.textContent = item.price !== null ? `${item.price} синапсов` : 'Бесценно';
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    this.eventEmitter.emit('removeFromCart', { productId: item.id });
                });
            }

            this.basketListElement.appendChild(basketItemElement);
        });

        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
        this.basketPriceElement.textContent = `${totalPrice} синапсов`;

        return this.basketListElement.parentElement as HTMLElement;
    }

    setTotalPrice(totalPrice: number): void {
        this.basketPriceElement.textContent = `${totalPrice} синапсов`;
    }
}