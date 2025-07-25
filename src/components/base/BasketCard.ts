import { Product } from '../../types/product';
import { EventEmitter } from '../base/events';

export class BasketCard {
    private template: HTMLTemplateElement;
    private element: HTMLElement | null = null;
    private eventEmitter: EventEmitter;

    constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
        this.template = template;
        this.eventEmitter = eventEmitter;
    }

    render(data: Product, index: number): HTMLElement {
        if (this.element) {
            this.updateCard(data, index);
            return this.element;
        }

        const cardElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) {
            return document.createElement('div');
        }

        const indexElement = cardElement.querySelector('.basket__item-index') as HTMLElement;
        const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
        const priceElement = cardElement.querySelector('.card__price') as HTMLElement;
        const deleteButton = cardElement.querySelector('.basket__item-delete') as HTMLButtonElement;

        if (indexElement) indexElement.textContent = (index + 1).toString();
        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                this.eventEmitter.emit('removeFromCart', { productId: data.id });
            });
        }

        this.element = cardElement;
        return cardElement;
    }

    private updateCard(data: Product, index: number): void {
        if (!this.element) return;

        const indexElement = this.element.querySelector('.basket__item-index') as HTMLElement;
        const titleElement = this.element.querySelector('.card__title') as HTMLElement;
        const priceElement = this.element.querySelector('.card__price') as HTMLElement;

        if (indexElement) indexElement.textContent = (index + 1).toString();
        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
    }
}