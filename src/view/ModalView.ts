import { EventEmitter } from '../components/base/events';

export class ModalView {
    private modalContainer: HTMLElement;
    private modalContentContainer: HTMLElement;
    private closeButton: HTMLButtonElement;
    private eventEmitter: EventEmitter;
    private currentContentType: 'cart' | 'productDetail' | 'order' | 'contacts' | 'success' | null = null;

    constructor(selector: string) {
        this.modalContainer = document.querySelector(selector) as HTMLElement;
        this.modalContentContainer = this.modalContainer.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.modalContainer.querySelector('.modal__close') as HTMLButtonElement;
        this.eventEmitter = new EventEmitter();

        if (!this.modalContainer || !this.modalContentContainer || !this.closeButton) {
            throw new Error('ModalView: Required elements not found.');
        }

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.modalContainer.addEventListener('click', (event) => {
            if (event.target === this.modalContainer) {
                this.close();
            }
        });
    }

    setContent(content: HTMLElement, contentType: 'cart' | 'productDetail' | 'order' | 'contacts' | 'success'): void {
        this.modalContentContainer.innerHTML = '';
        this.modalContentContainer.appendChild(content);
        this.currentContentType = contentType;
    }

    open(): void {
        this.modalContainer.classList.add('modal_active');
        document.body.classList.add('no-scroll'); 
    }

    close(): void {
        this.modalContainer.classList.remove('modal_active');
        document.body.classList.remove('no-scroll'); 
        this.modalContentContainer.innerHTML = '';
        this.currentContentType = null;
    }

    getCurrentContentType(): 'cart' | 'productDetail' | 'order' | 'contacts' | 'success' | null {
        return this.currentContentType;
    }
}