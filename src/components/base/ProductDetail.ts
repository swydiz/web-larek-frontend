import { Product } from '../../types/product';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/events';

export class ProductDetail {
    private template: HTMLTemplateElement;
    private eventEmitter: EventEmitter;
    private element: HTMLElement | null = null;
    private addToCartButton: HTMLButtonElement | null = null;

    constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
        this.template = template;
        this.eventEmitter = eventEmitter;
    }

    render(data: Product): HTMLElement {
        if (this.element) {
            this.updateCard(data);
            return this.element;
        }

        const cardDetailElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardDetailElement) {
            return document.createElement('div');
        }

        const titleElement = cardDetailElement.querySelector('.card__title') as HTMLElement;
        const imageElement = cardDetailElement.querySelector('.card__image') as HTMLImageElement;
        const descriptionElement = cardDetailElement.querySelector('.card__text') as HTMLElement;
        const priceElement = cardDetailElement.querySelector('.card__price') as HTMLElement;
        this.addToCartButton = cardDetailElement.querySelector('.card__button') as HTMLButtonElement;

        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title || 'Без названия';
        }
        if (descriptionElement) descriptionElement.textContent = data.description || '';
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';

        if (this.addToCartButton) {
            if (data.price === null) {
                this.addToCartButton.disabled = true;
                this.addToCartButton.textContent = 'В корзину';
            } else {
                this.addToCartButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.eventEmitter.emit('toggleCartItem', { productId: data.id });
                });
                // Инициализация состояния кнопки через событие
                this.eventEmitter.emit('checkCartItem', { productId: data.id });
            }
        }

        this.element = cardDetailElement;
        return cardDetailElement;
    }

    private updateCard(data: Product): void {
        if (!this.element) return;

        const titleElement = this.element.querySelector('.card__title') as HTMLElement;
        const imageElement = this.element.querySelector('.card__image') as HTMLImageElement;
        const descriptionElement = this.element.querySelector('.card__text') as HTMLElement;
        const priceElement = this.element.querySelector('.card__price') as HTMLElement;

        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title || 'Без названия';
        }
        if (descriptionElement) descriptionElement.textContent = data.description || '';
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
    }

    updateButtonState(isInCart: boolean): void {
        if (this.addToCartButton) {
            this.addToCartButton.textContent = isInCart ? 'Удалить из корзины' : 'В корзину';
        }
    }
}