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

        this.eventEmitter.on<{ isValid: boolean, errors: string[] }>('deliveryAddressValidated', (data) => {
            this.setError(data.errors.join(', '));
            this.setSubmitButtonState(data.isValid);
        });
    }

    protected handleSubmit(event: Event): void {
        const paymentMethod = Array.from(this.paymentButtons).find(btn => btn.classList.contains('button_alt-active'))?.name as 'card' | 'cash';
        this.eventEmitter.emit('orderSubmitted', {
            shippingAddress: this.addressInput.value,
            paymentMethod: paymentMethod || 'card',
        });
    }

    protected handleInputChange(event: Event): void {
        const target = event.target as HTMLElement;
        if (target === this.addressInput) {
            this.eventEmitter.emit('deliveryAddressInput', { shippingAddress: this.addressInput.value });
        } else if (this.paymentButtons.length && Array.from(this.paymentButtons).includes(target as HTMLButtonElement)) {
            const paymentMethod = (target as HTMLButtonElement).name as 'card' | 'cash';
            this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
            target.classList.add('button_alt-active');
            this.eventEmitter.emit('deliveryAddressInput', { paymentMethod });
        }
    }

    private setError(error: string): void {
        this.errorElement.textContent = error;
    }
}