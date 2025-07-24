
import { EventEmitter } from '../components/base/events';

export class SuccessView {
    private successContainer: HTMLElement;
    private totalPriceElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        this.successContainer = container;
        this.totalPriceElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.eventEmitter = eventEmitter;

        if (!this.totalPriceElement || !this.closeButton) {
            throw new Error('SuccessView: Required elements not found.');
        }

        this.closeButton.addEventListener('click', () => {
            this.eventEmitter.emit('closeSuccess');
        });
    }

    render(): HTMLElement {
        return this.successContainer;
    }

    setTotalPrice(totalPrice: number): void {
        this.totalPriceElement.textContent = `Списано ${totalPrice} синапсов`;
    }

    hide(): void {
        this.eventEmitter.emit('closeSuccess');
    }
}