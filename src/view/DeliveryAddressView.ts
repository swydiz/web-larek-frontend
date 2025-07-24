
import { EventEmitter } from '../components/base/events';
import { Form } from '../components/Form';

export class DeliveryAddressView extends Form {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;
    private errorElement: HTMLElement;
    private selectedPaymentMethod: 'card' | 'cash' | null = null;

    constructor(formElement: HTMLElement, eventEmitter: EventEmitter) {
        super(formElement, eventEmitter);
        this.paymentButtons = formElement.querySelectorAll('.order__buttons .button') as NodeListOf<HTMLButtonElement>;
        this.addressInput = formElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.errorElement = formElement.querySelector('.form__errors') as HTMLElement;

        if (!this.addressInput || !this.errorElement) {
            throw new Error('DeliveryAddressView: Required form elements not found.');
        }

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt_active'));
                button.classList.add('button_alt_active');
                this.selectedPaymentMethod = button.name as 'card' | 'cash';
                this.validateForm();
            });
        });

        this.validateForm();
    }

    protected handleSubmit(event: Event): void {
        const address = this.addressInput.value.trim();
        if (this.isValid(address)) {
            this.eventEmitter.emit('orderSubmitted', {
                paymentMethod: this.selectedPaymentMethod!,
                shippingAddress: address
            });
        }
    }

    protected handleInputChange(event: Event): void {
        this.validateForm();
    }

    private validateForm(): void {
        const address = this.addressInput.value.trim();
        const isValid = this.isValid(address);
        this.setSubmitButtonState(isValid);
        if (!this.selectedPaymentMethod) {
            this.errorElement.textContent = 'Выберите способ оплаты';
        } else if (!address) {
            this.errorElement.textContent = 'Введите адрес доставки';
        } else {
            this.errorElement.textContent = '';
        }
    }

    private isValid(address: string): boolean {
        return !!this.selectedPaymentMethod && !!address;
    }
}