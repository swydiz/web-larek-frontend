import { Product } from '../../types/product';
import { CDN_URL } from '../../utils/constants';
import { normalizeCategory } from '../../utils/category';

export class Card {
    private template: HTMLTemplateElement;
    private element: HTMLElement;
    private currentProduct: Product | null = null;
    private onClick: ((event: Event, product: Product) => void) | null = null;

    constructor(template: HTMLTemplateElement, onClick?: (event: Event, product: Product) => void) {
        this.template = template;
        this.onClick = onClick;

        const cardElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) {
            throw new Error('Card: Template content not found.');
        }
        this.element = cardElement;

        if (this.onClick) {
            this.element.addEventListener('click', (event) => {
                if (this.currentProduct) {
                    this.onClick(event, this.currentProduct);
                }
            });
        }
    }

    private updateCardElements(data: Product): void {
        const titleElement = this.element.querySelector('.card__title') as HTMLElement;
        const imageElement = this.element.querySelector('.card__image') as HTMLImageElement;
        const priceElement = this.element.querySelector('.card__price') as HTMLElement;
        const categoryElement = this.element.querySelector('.card__category') as HTMLElement;

        if (titleElement) titleElement.textContent = data.title || 'Без названия';
        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title || 'Без названия';
        }
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
        if (categoryElement) {
            categoryElement.textContent = data.category || 'Без категории';
            categoryElement.className = 'card__category';
            const normalizedCategory = normalizeCategory(data.category || '');
            categoryElement.classList.add(`card__category_${normalizedCategory}`);
        }
    }

    render(data: Product): HTMLElement {
        this.currentProduct = data;
        this.updateCardElements(data);
        return this.element;
    }
}