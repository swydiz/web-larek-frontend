import { Product } from '../../types/product';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/events';
import { CartModel } from '../../model/CartModel';

export class ProductDetail {
    private template: HTMLTemplateElement;
    private eventEmitter: EventEmitter;
    private cartModel: CartModel;

    constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter, cartModel: CartModel) {
        this.template = template;
        this.eventEmitter = eventEmitter;
        this.cartModel = cartModel;
    }

    render(data: Product): HTMLElement {
        const cardDetailElement = this.template.content.firstElementChild?.cloneNode(true) as HTMLElement;

        if (!cardDetailElement) {
            return document.createElement('div');
        }

        const titleElement = cardDetailElement.querySelector('.card__title');
        const imageElement = cardDetailElement.querySelector('.card__image') as HTMLImageElement;
        const descriptionElement = cardDetailElement.querySelector('.card__text');
        const priceElement = cardDetailElement.querySelector('.card__price');
        const addToCartButton = cardDetailElement.querySelector('.card__button') as HTMLButtonElement;

        if (titleElement) titleElement.textContent = data.title;
        if (imageElement) {
            imageElement.src = `${CDN_URL}${data.image}`;
            imageElement.alt = data.title;
        }
        if (descriptionElement) descriptionElement.textContent = data.description;
        if (priceElement) priceElement.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';

        if (addToCartButton) {
            if (data.price === null) {
                addToCartButton.disabled = true;
                addToCartButton.textContent = 'В корзину';
            } else {
                this.updateButtonState(addToCartButton, data.id);
                addToCartButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const isInCart = this.cartModel.getItems().some(item => item.id === data.id);
                    if (isInCart) {
                        this.cartModel.removeItem(data.id);
                    } else {
                        this.cartModel.addItem(data);
                    }
                    this.updateButtonState(addToCartButton, data.id);
                });
            }
        }

        return cardDetailElement;
    }

    private updateButtonState(button: HTMLButtonElement, productId: string): void {
        const isInCart = this.cartModel.getItems().some(item => item.id === productId);
        button.textContent = isInCart ? 'Удалить из корзины' : 'В корзину';
    }
}