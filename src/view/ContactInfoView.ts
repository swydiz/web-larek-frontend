
import { EventEmitter } from '../components/base/events';
import { Form } from '../components/Form';

export class ContactInfoView extends Form {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private errorElement: HTMLElement;
    private paymentMethod: 'card' | 'cash';
    private shippingAddress: string;

    constructor(formElement: HTMLElement, eventEmitter: EventEmitter, paymentMethod: 'card' | 'cash', shippingAddress: string) {
        super(formElement, eventEmitter);
        this.emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement;
        this.errorElement = formElement.querySelector('.form__errors') as HTMLElement;
        this.paymentMethod = paymentMethod;
        this.shippingAddress = shippingAddress;

        if (!this.emailInput || !this.phoneInput || !this.errorElement) {
            throw new Error('ContactInfoView: Required form elements not found.');
        }

        this.validateForm();
    }

    protected handleSubmit(event: Event): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        if (this.isValid(email, phone)) {
            this.eventEmitter.emit('contactsSubmitted', {
                paymentMethod: this.paymentMethod,
                shippingAddress: this.shippingAddress,
                email,
                phone
            });
        }
    }

    protected handleInputChange(event: Event): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        this.validateForm();
    }

    private validateForm(): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        const isValid = this.isValid(email, phone);
        this.setSubmitButtonState(isValid);
        if (!email) {
            this.errorElement.textContent = 'Введите email';
        } else if (!this.isValidEmail(email)) {
            this.errorElement.textContent = 'Введите корректный email';
        } else if (!phone || phone.length < 10) {
            this.errorElement.textContent = 'Введите корректный телефон (минимум 10 символов)';
        } else {
            this.errorElement.textContent = '';
        }
    }

    private isValid(email: string, phone: string): boolean {
        return this.isValidEmail(email) && phone.length >= 10;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
        return emailRegex.test(email);
    }
}