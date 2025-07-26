import { EventEmitter } from '../components/base/events';

export class MainPageView {
    private productListContainer: HTMLElement;
    private basketCounterElement: HTMLElement;
    private basketIconElement: HTMLElement;
    private eventEmitter: EventEmitter;
    private cardPreviewTemplate: HTMLTemplateElement;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;

        this.productListContainer = document.querySelector<HTMLElement>('.gallery')!;
        this.basketCounterElement = document.querySelector<HTMLElement>('.header__basket-counter')!;
        this.basketIconElement = document.querySelector<HTMLElement>('.header__basket')!;
        this.cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;

        if (!this.productListContainer || !this.basketCounterElement || !this.basketIconElement || !this.cardPreviewTemplate) {
            throw new Error('One or more required DOM elements not found.');
        }

        this.basketIconElement.addEventListener('click', () => {
            this.eventEmitter.emit('openBasket');
        });
    }

    render(productCardElements: HTMLElement[]): void {
        this.productListContainer.innerHTML = '';
        productCardElements.forEach(element => {
            this.productListContainer.appendChild(element);
        });
    }

    setBasketCount(count: number): void {
        this.basketCounterElement.textContent = count.toString();
    }
}