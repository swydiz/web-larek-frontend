import { Product } from '../../types/product';
import { CDN_URL } from '../../utils/constants';

export class Card {
    private template: HTMLTemplateElement;
    private element: HTMLElement | null = null;

    constructor(template: HTMLTemplateElement) {
        this.template = template;
    }

    render(data: Product): HTMLElement {
        if (this.element) {
            this.updateCard(data);
            return this.element;
        }

        const cardElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) {
            return document.createElement('div');
        }

        const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
        const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
        const priceElement = cardElement.querySelector('.card__price') as HTMLElement;

        if (titleElement) {
            titleElement.textContent = data.title || 'Без названия';
        }

        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title || 'Без названия';
        }

        if (priceElement) {
            priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        }

        this.element = cardElement;
        return cardElement;
    }

    private updateCard(data: Product): void {
        if (!this.element) return;

        const titleElement = this.element.querySelector('.card__title') as HTMLElement;
        const imageElement = this.element.querySelector('.card__image') as HTMLImageElement;
        const priceElement = this.element.querySelector('.card__price') as HTMLElement;

        if (titleElement) {
            titleElement.textContent = data.title || 'Без названия';
        }

        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title || 'Без названия';
        }

        if (priceElement) {
            priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        }
    }
}