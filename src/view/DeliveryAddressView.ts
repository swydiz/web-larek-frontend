
import { EventEmitter } from '../components/base/events';
import { Form } from '../components/Form';

export class DeliveryAddressView extends Form {
    private addressInput: HTMLInputElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private errorElement: HTMLElement;

    constructor(formElement: HTMLElement, eventEmitter: EventEmitter) {
        super(formElement, eventEmitter);

        this.addressInput = formElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.paymentButtons = formElement.querySelectorAll('.button_alt');
        this.errorElement = formElement.querySelector('.form__errors') as HTMLElement;

        if (!this.addressInput || !this.paymentButtons.length || !this.errorElement) {
            throw new Error('DeliveryAddressView: Required form elements not found.');
        }

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => this.handlePaymentMethodClick(event));
        });

        this.eventEmitter.on<{ isValid: boolean, errors: string[] }>('deliveryAddressValidated', (data) => {
            this.setError(data.errors.join(', '));
            this.setSubmitButtonState(data.isValid);
        });

        this.eventEmitter.emit('deliveryAddressInput', {
            shippingAddress: this.addressInput.value,
            paymentMethod: this.getActivePaymentMethod() || 'card',
        });
    }

    protected handleSubmit(event: Event): void {
        const paymentMethod = this.getActivePaymentMethod();
        this.eventEmitter.emit('orderSubmitted', {
            shippingAddress: this.addressInput.value,
            paymentMethod: paymentMethod || 'card',
        });
    }

    protected handleInputChange(event: Event): void {
        const target = event.target as HTMLElement;
        if (target === this.addressInput) {
            this.eventEmitter.emit('deliveryAddressInput', {
                shippingAddress: this.addressInput.value,
                paymentMethod: this.getActivePaymentMethod() || 'card',
            });
        }
    }

    private handlePaymentMethodClick(event: Event): void {
        const target = event.target as HTMLButtonElement;
        const paymentMethod = target.name as 'card' | 'cash';

        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        target.classList.add('button_alt-active');

        this.eventEmitter.emit('deliveryAddressInput', {
            shippingAddress: this.addressInput.value,
            paymentMethod,
        });
    }

    private getActivePaymentMethod(): 'card' | 'cash' | undefined {
        return Array.from(this.paymentButtons).find(btn => btn.classList.contains('button_alt-active'))?.name as 'card' | 'cash';
    }

    private setError(error: string): void {
        this.errorElement.textContent = error;
    }
}