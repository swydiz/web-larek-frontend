
import { EventEmitter } from '../components/base/events';
import { Form } from '../components/Form';

export class ContactInfoView extends Form {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private errorElement: HTMLElement;

    constructor(formElement: HTMLElement, eventEmitter: EventEmitter) {
        super(formElement, eventEmitter);

        this.emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement;
        this.errorElement = formElement.querySelector('.form__errors') as HTMLElement;

        if (!this.emailInput || !this.phoneInput || !this.errorElement) {
            throw new Error('ContactInfoView: Required form elements not found.');
        }

        this.eventEmitter.on<{ isValid: boolean, errors: string[] }>('contactInfoValidated', (data) => {
            this.setError(data.errors.join(', '));
            this.setSubmitButtonState(data.isValid);
        });
    }

    protected handleSubmit(event: Event): void {
        this.eventEmitter.emit('contactsSubmitted', {
            email: this.emailInput.value,
            phone: this.phoneInput.value,
        });
    }

    protected handleInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.eventEmitter.emit('contactInfoInput', {
            email: this.emailInput.value,
            phone: this.phoneInput.value,
        });
    }

    private setError(error: string): void {
        this.errorElement.textContent = error;
    }
}