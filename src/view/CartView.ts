import { EventEmitter } from '../components/base/events';

export class CartView {
    private basketTemplate: HTMLTemplateElement;
    private basketListElement: HTMLElement;
    private basketPriceElement: HTMLElement;
    private checkoutButton: HTMLButtonElement;
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        this.eventEmitter = eventEmitter;

        if (!this.basketTemplate) {
            throw new Error('CartView: Basket template not found.');
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

    render(cartItemElements: HTMLElement[], totalPrice: number): HTMLElement {
        this.basketListElement.replaceChildren(...cartItemElements);
        this.setTotalPrice(totalPrice);
        return this.basketListElement.parentElement as HTMLElement;
    }

    setTotalPrice(totalPrice: number): void {
        this.basketPriceElement.textContent = `${totalPrice} синапсов`;
    }
}