import { EventEmitter } from '../../components/base/events';
import { Product } from '../../types/product';
import { CDN_URL } from '../../utils/constants';
import { normalizeCategory } from '../../utils/category';

export class ProductDetail {
    private template: HTMLTemplateElement;
    private eventEmitter: EventEmitter;
    private element: HTMLElement;
    private addToCartButton: HTMLButtonElement | null = null;
    private currentProductId: string | null = null;

    constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
        this.template = template;
        this.eventEmitter = eventEmitter;

        const cardDetailElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardDetailElement) {
            throw new Error('ProductDetail: Template content not found.');
        }
        this.element = cardDetailElement;

        this.addToCartButton = this.element.querySelector('.card__button') as HTMLButtonElement;
        if (this.addToCartButton) {
            this.addToCartButton.addEventListener('click', (event) => {
                event.preventDefault();
                if (this.currentProductId) {
                    this.eventEmitter.emit('toggleCartItem', { productId: this.currentProductId });
                } else {
                    console.error('ProductDetail: currentProductId is not set.');
                }
            });
        } else {
            console.error('ProductDetail: addToCartButton not found in template.');
        }
    }

    private updateElement(data: Product): void {
        const titleElement = this.element.querySelector('.card__title') as HTMLElement;
        const imageElement = this.element.querySelector('.card__image') as HTMLImageElement;
        const descriptionElement = this.element.querySelector('.card__text') as HTMLElement;
        const priceElement = this.element.querySelector('.card__price') as HTMLElement;
        const categoryElement = this.element.querySelector('.card__category') as HTMLElement;

        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title || 'Без названия';
        }
        if (descriptionElement) descriptionElement.textContent = data.description || '';
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        if (categoryElement) {
            categoryElement.textContent = data.category || 'Без категории';
            categoryElement.className = 'card__category';
            const normalizedCategory = normalizeCategory(data.category);
            categoryElement.classList.add(`card__category_${normalizedCategory}`);
        }

        if (this.addToCartButton) {
            this.addToCartButton.disabled = data.price === null;
        }
    }

    render(data: Product): HTMLElement {
        this.currentProductId = data.id;
        this.updateElement(data);
        if (this.currentProductId) {
            this.eventEmitter.emit('checkCartItem', { productId: this.currentProductId });
        }
        return this.element;
    }

    updateButtonState(isInCart: boolean): void {
        if (this.addToCartButton) {
            this.addToCartButton.textContent = isInCart ? 'Удалить из корзины' : 'В корзину';
        }
    }
}