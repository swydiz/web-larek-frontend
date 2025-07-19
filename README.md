# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Компоненты

1. Слой Моделей. 

    Классы:
    - ProductModel: Управляет данными о товарах.
    Назначение: Предоставляет методы для получения и обработки информации о товарах.
    Зона ответственности:
    Получение данных о товарах из API.
    Преобразование данных для использования слоем отображения.
    Конструктор:
    apiService: Api - Внедрение существующего класса Api для получения данных.
    Поля:
    products: Product[] - Содержит список товаров.
    Методы:
    getProducts(): Promise<Product[]> - Получает товары из API.
    getProductById(id: number) - Product | undefined: Получает конкретный товар по ID.

    - CartModel: Управляет данными корзины.
    Назначение: Предоставляет методы для добавления, удаления и обновления товаров в корзине.
    Зона ответственности:
    Хранение товаров в корзине.
    Подсчет общей стоимости.
    Поля:
    items: CartItem[] - Содержит товары в корзине.
    Методы:
    addItem(product: Product, quantity: number): void - Добавляет товар в корзину.
    removeItem(productId: number): void - Удаляет товар из корзины.
    updateQuantity(productId: number, quantity: number): void - Обновляет количество товара в корзине.
    getTotalPrice(): number - Подсчитывает общую стоимость товаров в корзине.

    - CheckoutModel: Управляет данными оформления заказа и обрабатывает заказ.
    Назначение: Предоставляет методы для проверки информации о заказе и отправки заказа.
    Зона ответственности:
    Проверка адреса доставки, email и телефона покупателя.
    Отправка заказа в API.
    Поля:
    shippingAddress: string - Содержит адрес доставки.
    customerEmail: string - Содержит email покупателя.
    customerPhone: string - Содержит телефон покупателя.
    Методы:
    validateShippingAddress(address: string): boolean - Проверяет адрес доставки.
    validateCustomerInfo(email: string, phone: string): boolean - Проверяет email и телефон покупателя.
    submitOrder(order: Order): Promise<void> - Отправляет заказ в API.


2. Слой Отображения 
Слой отображения отвечает за отрисовку пользовательского интерфейса и обработку взаимодействий пользователя.

    Классы:
    - ProductListView: Отображает список товаров.
    Назначение: Отрисовка каталога товаров.
    Зона ответственности:
    Отображение списка товаров с использованием HTML элементов.
    Поля:
    productListContainer: HTMLElement - Контейнер для отображения списка товаров.
    productItemTemplate: HTMLTemplateElement - Шаблон для отображения отдельного товара.
    Методы:
    setName(name: string): void - Устанавливает название товара на экране.
    setImage(imageSrc: string): void - Устанавливает URL изображения товара.
    setPrice(price: number): void - Устанавливает цену товара.
    render(products: Product[]): void - Отрисовывает список товаров на экране. Метод принимает массив объектов Product и для каждого товара вызывает методы setName, setImage и setPrice.

    - ProductView: Отображает детальную информацию о товаре.
    Назначение: Отрисовка деталей конкретного товара.
    Зона ответственности:
    Отображение названия товара, описания, цены и изображения.
    Обработка кликов на кнопки “Купить” и “Удалить”.
    Поля:
    productNameElement: HTMLElement - Элемент для отображения названия товара.
    productImageElement: HTMLImageElement - Элемент для отображения изображения товара.
    productDescriptionElement: HTMLElement - Элемент для отображения описания товара
    productPriceElement: HTMLElement - Элемент для отображения цены товара.
    addToCartButton: HTMLButtonElement - Кнопка для добавления товара в корзину.
    Методы:
    setName(name: string): void - Устанавливает название товара на экране.
    setImage(imageSrc: string): void - Устанавливает URL изображения товара.
    setDescription(description: string): void - Устанавливает описание товара.
    setPrice(price: number): void - Устанавливает цену товара.
    render(product: Product): void - Отрисовывает детальную информацию о товаре на экране. Метод принимает объект Product и вызывает методы setName, setImage, setDescription и setPrice

    - CartView: Отображает корзину.
    Назначение: Отрисовка товаров в корзине.
    Зона ответственности:
    Отображение списка товаров в корзине.
    Отображение общей стоимости.
    Обработка изменений количества и удаления товаров.
    Поля:
    cartItemsContainer: HTMLElement - Контейнер для отображения списка товаров в корзине.
    totalPriceElement: HTMLElement - Элемент для отображения общей стоимости.
    Методы:
    setProductName(name: string): void - Устанавливает название товара в корзине.
    setProductQuantity(quantity: number): void - Устанавливает количество товара в корзине.
    setProductPrice(price: number): void - Устанавливает цену товара в корзине.
    setTotalPrice(totalPrice: number): void - Устанавливает общую цену в корзине.
    render(cartItems: CartItem[], totalPrice: number): void - Отрисовывает список товаров в корзине и общую стоимость. Метод принимает массив объектов CartItem и общую стоимость, вызывая методы setProductName, setProductQuantity, setProductPrice и setTotalPrice.

    - CheckoutView: Отображает форму оформления заказа.
    Назначение: Отрисовка формы оформления заказа и обработка отправки.
    Зона ответственности:
    Отображение полей формы для адреса доставки, email и телефона.
    Обработка отправки формы и отображение ошибок проверки.
    Поля:
    shippingAddressInput: HTMLInputElement - Поле ввода для адреса доставки.
    emailInput: HTMLInputElement - Поле ввода для email.
    phoneInput: HTMLInputElement - Поле ввода для телефона.
    paymentMethodSelect: HTMLSelectElement - Выбор способа оплаты
    submitButton: HTMLButtonElement - Кнопка для отправки заказа.
    Методы:
    setShippingAddress(address: string): void - Устанавливает значение адреса доставки.
    setEmail(email: string): void - Устанавливает значение email.
    setPhone(phone: string): void - Устанавливает значение телефона.
    setPaymentMethod(method:string):void - Устанавливает способ оплаты
    displayError(message: string): void - Отображает сообщение об ошибке.
    displaySuccess(): void - Отображает сообщение об успешном оформлении заказа.
    render(step: number, data: any): void - Отрисовывает форму для текущего шага оформления заказа. 

    - ModalView: Отображает модальное окно.
    Назначение: Отрисовка модальных окон с различным контентом.
    Зона ответственности:
    Отображение контента внутри модального окна.
    Поля:
    modalContainer: HTMLElement - Элемент, содержащий HTML модального окна.
    modalContentContainer: HTMLElement - Контейнер внутри модального окна
    closeButton: HTMLButtonElement - Кнопка закрытия модального окна.
    Методы:
    setContent(content: HTMLElement | string): void - Устанавливает контент модального окна. Метод принимает HTMLComponent (или строку) и вставляет его в modalContentContainer.
    open(): void - Открывает модальное окно.
    close(): void - Закрывает модальное окно.

3. Слой Презентеров 
    Слой презентеров выступает в роли посредника между слоями моделей и отображения. Он получает действия пользователя из слоя отображения, обновляет модель и, затем, отображает в представлении новые данные из модели.


4. Брокер Событий (Event Broker)
    Брокер событий отвечает за обеспечение взаимодействия между различными частями приложения.Используется существующий класс EventEmitter.

5. API Service
    Класс APIService управляет взаимодействием с внешним API. Используется существующий класс Api.

6. Поток Данных
    - Начальная загрузка:
        ProductListPresenter запрашивает данные у ProductModel.
        ProductModel использует APIService для получения данных о товарах.
        ProductModel преобразует данные и передает их ProductListPresenter.
        ProductListPresenter передает данные в ProductListView.
        ProductListView отрисовывает товары.

    - Добавление в корзину:
        ProductView генерирует событие addToCart.
        CartPresenter обрабатывает событие addToCart.
        CartPresenter вызывает CartModel.addItem().
        CartModel обновляет корзину и генерирует событие cartUpdated.
        CartPresenter получает событие cartUpdated и обновляет CartView.

    - Оформление заказа:
        CheckoutView генерирует событие submitOrder.
        CheckoutPresenter получает событие submitOrder.
        CheckoutPresenter вызывает методы проверки в CheckoutModel.
        CheckoutModel возвращает результаты проверки.
        Если проверка успешна, CheckoutPresenter отправляет данные в APIService.
        APIService отправляет данные заказа на сервер.
        CheckoutPresenter отображает сообщение об успехе.

7. Пример взаимодействия
    Пользователь добавляет товар в корзину:
        Класс ProductView реагирует на клик пользователя по кнопке “Добавить в корзину” и генерирует событие addToCart.
        CartPresenter обрабатывает событие addToCart и вызывает метод addItem класса CartModel.
        CartModel изменяет поле items (массив товаров в корзине) и генерирует событие cartUpdated.
        CartPresenter запрашивает обновленные данные из CartModel (общее количество товаров, общая стоимость, товары в корзине) и передает их в CartView для отрисовки.
        Класс CartView перерисовывается, отображая обновленные данные.

