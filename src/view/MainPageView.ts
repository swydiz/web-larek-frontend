import { EventEmitter } from '../components/base/events';

export class MainPageView {
    private productListContainer: HTMLElement;
    private basketCounterElement: HTMLElement;
    private basketIconElement: HTMLElement;
    private eventEmitter: EventEmitter;

    constructor(
        productListContainer: HTMLElement,
        basketCounterElement: HTMLElement,
        basketIconElement: HTMLElement,
        eventEmitter: EventEmitter
    ) {
        this.productListContainer = productListContainer;
        this.basketCounterElement = basketCounterElement;
        this.basketIconElement = basketIconElement;
        this.eventEmitter = eventEmitter;

        this.basketIconElement.addEventListener('click', () => {
            this.eventEmitter.emit('openBasket');
        });
    }

    render(productCardElements: HTMLElement[]): void {
        this.productListContainer.innerHTML = '';
        productCardElements.forEach((element) => {
            this.productListContainer.appendChild(element);
        });
    }

    setBasketCount(count: number): void {
        this.basketCounterElement.textContent = count.toString();
    }
}