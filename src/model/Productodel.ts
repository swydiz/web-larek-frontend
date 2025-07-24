import { Api } from '../components/base/api';
import { EventEmitter } from '../components/base/events';
import { Product } from '../types/product';

export class ProductModel {
    private api: Api;
    private eventEmitter: EventEmitter;
    private products: Product[] = [];

    constructor(api: Api, eventEmitter: EventEmitter) {
        this.api = api;
        this.eventEmitter = eventEmitter;
    }

    async getProducts(): Promise<void> {
        try {
            const response = await this.api.get('/product') as { total: number, items: Product[] };
            this.products = response.items;
            this.eventEmitter.emit<Product[]>('productsLoaded', this.products);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    getProductById(id: string): Product | undefined {
        return this.products.find(product => product.id === id);
    }
}