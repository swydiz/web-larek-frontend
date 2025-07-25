
import { EventEmitter } from '../components/base/events';
import { ContactFormData, DeliveryAddressFormData } from '../types/order';

export class OrderModel {
    private deliveryAddress: DeliveryAddressFormData = { shippingAddress: '', paymentMethod: 'card' };
    private contactInfo: ContactFormData = { email: '', phone: '' };
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    updateDeliveryAddress(data: Partial<DeliveryAddressFormData>): void {
        this.deliveryAddress = { ...this.deliveryAddress, ...data };
        this.eventEmitter.emit('deliveryAddressUpdated', this.deliveryAddress);
        this.validateDeliveryAddress();
    }

    updateContactInfo(data: Partial<ContactFormData>): void {
        this.contactInfo = { ...this.contactInfo, ...data };
        this.eventEmitter.emit('contactInfoUpdated', this.contactInfo);
        this.validateContactInfo();
    }

    validateDeliveryAddress(): void {
        const { shippingAddress, paymentMethod } = this.deliveryAddress;
        const errors: string[] = [];
        
        if (!shippingAddress) {
            errors.push('Заполните адрес доставки');
        }
        if (!paymentMethod || !['card', 'cash'].includes(paymentMethod)) {
            errors.push('Выберите способ оплаты');
        }

        const isValid = errors.length === 0;
        this.eventEmitter.emit('deliveryAddressValidated', { isValid, errors });
    }

    validateContactInfo(): void {
        const { email, phone } = this.contactInfo;
        const errors: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Введите корректный email');
        }
        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phone || !phoneRegex.test(phone)) {
            errors.push('Введите корректный номер телефона');
        }
        const isValid = errors.length === 0;
        this.eventEmitter.emit('contactInfoValidated', { isValid, errors });
    }

    getOrderData(): { deliveryAddress: DeliveryAddressFormData; contactInfo: ContactFormData } {
        return {
            deliveryAddress: { ...this.deliveryAddress },
            contactInfo: { ...this.contactInfo },
        };
    }

    clearOrderData(): void {
        this.deliveryAddress = { shippingAddress: '', paymentMethod: 'card' };
        this.contactInfo = { email: '', phone: '' };
        this.eventEmitter.emit('orderCleared');
    }
}