import { Product } from '../../types/product';
import { EventEmitter } from '../base/events';

export class BasketCard {
    private template: HTMLTemplateElement;
    private element: HTMLElement;
    private eventEmitter: EventEmitter;
    private deleteButton: HTMLButtonElement | null = null;
    private currentProductId: string | null = null;

    constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
        this.template = template;
        this.eventEmitter = eventEmitter;

        const cardElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) {
            throw new Error('BasketCard: Template content not found.');
        }
        this.element = cardElement;

        this.deleteButton = this.element.querySelector('.basket__item-delete') as HTMLButtonElement;
        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                if (this.currentProductId) {
                    this.eventEmitter.emit('removeFromCart', { productId: this.currentProductId });
                }
            });
        } else {
            console.error('BasketCard: deleteButton not found in template.');
        }
    }

    private updateElement(data: Product, index: number): void {
        const indexElement = this.element.querySelector('.basket__item-index') as HTMLElement;
        const titleElement = this.element.querySelector('.card__title') as HTMLElement;
        const priceElement = this.element.querySelector('.card__price') as HTMLElement;

        if (indexElement) indexElement.textContent = (index + 1).toString();
        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
    }

    render(data: Product, index: number): HTMLElement {
        this.currentProductId = data.id;
        this.updateElement(data, index);
        return this.element;
    }
}