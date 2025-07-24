export class ModalView {
    private modalContainer: HTMLElement;
    private modalContentContainer: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(modalSelector: string) {
        this.modalContainer = document.querySelector(modalSelector) as HTMLElement;

        if (!this.modalContainer) {
            console.error(`Modal with selector "${modalSelector}" not found`);
            return;
        }

        this.modalContentContainer = this.modalContainer.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.modalContainer.querySelector('.modal__close') as HTMLButtonElement;

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.modalContainer.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as Node;
            if (target === this.modalContainer || target === this.modalContainer.querySelector('.modal__container')) {
                this.close();
            }
        });
    }

    setContent(content: HTMLElement): void {
        if (this.modalContentContainer) {
            this.modalContentContainer.innerHTML = '';
            this.modalContentContainer.appendChild(content);
        } else {
            console.error('modalContentContainer is null');
        }
    }

    open(): void {
        if (this.modalContainer) {
            this.modalContainer.classList.add('modal_active');
            document.body.classList.add('no-scroll');
        }
    }

    close(): void {
        if (this.modalContainer) {
            this.modalContainer.classList.remove('modal_active');
            document.body.classList.remove('no-scroll');
        }
    }

    isOpen(): boolean {
        return this.modalContainer ? this.modalContainer.classList.contains('modal_active') : false;
    }
}