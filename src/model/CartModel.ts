import { EventEmitter } from '../components/base/events';
import { Product } from '../types/product';

export class CartModel {
    private items: Product[] = [];
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    addItem(product: Product): void {
        const isDuplicate = this.items.some(item => String(item.id) === String(product.id));
        if (isDuplicate) {
            return;
        }
        this.items.push(product);
        this.eventEmitter.emit('cartUpdated', { items: [...this.items], totalPrice: this.getTotalPrice() });
        this.eventEmitter.emit('basketCountUpdated', { count: this.items.length });
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.eventEmitter.emit('cartUpdated', { items: [...this.items], totalPrice: this.getTotalPrice() });
        this.eventEmitter.emit('basketCountUpdated', { count: this.items.length });
    }

    getItems(): Product[] {
        return [...this.items];
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }
}