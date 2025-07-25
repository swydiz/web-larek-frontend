import { EventEmitter } from '../components/base/events';
import { Product } from '../types/product';

export class ProductModel {
    private eventEmitter: EventEmitter;
    private products: Product[] = [];

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    setProducts(products: Product[]): void {
        this.products = products;
        this.eventEmitter.emit<Product[]>('productsLoaded', this.products);
    }

    getProducts(): Product[] {
        return this.products;
    }

    getProductById(id: string): Product | undefined {
        return this.products.find(product => product.id === id);
    }
}