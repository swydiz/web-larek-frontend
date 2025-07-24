
import { EventEmitter } from '../components/base/events';

export abstract class Form {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected eventEmitter: EventEmitter;

    constructor(formElement: HTMLElement, eventEmitter: EventEmitter) {
        this.form = formElement as HTMLFormElement;
        this.submitButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.eventEmitter = eventEmitter;

        if (!this.form || !this.submitButton) {
            throw new Error('Form or submit button not found.');
        }

        this.initializeEventListeners();
    }

    protected initializeEventListeners(): void {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit(event);
        });

        this.form.addEventListener('input', (event) => {
            this.handleInputChange(event);
        });
    }

    protected abstract handleSubmit(event: Event): void;

    protected abstract handleInputChange(event: Event): void;

    protected setSubmitButtonState(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }
}