const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Завантажуємо HTML файл та створюємо DOM
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
let dom;
let document;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: "dangerously" });
  document = dom.window.document;

  // Імпортуємо ваш скрипт
  const scriptContent = fs.readFileSync(path.resolve(__dirname, './main.js'), 'utf8');
  const scriptElement = document.createElement('script');
  scriptElement.textContent = scriptContent;
  document.body.appendChild(scriptElement);
});

describe('Cart functionality', () => {
  test('should add item to cart', () => {
    const buyButton = document.querySelector('.buy-button');
    buyButton.click();

    const cartItems = document.querySelector('#cart-items').children;
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].textContent).toContain('грн');
  });

  test('should calculate total correctly', () => {
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => button.click());

    const cartTotal = document.querySelector('#cart-total').textContent;
    expect(cartTotal).toBe('45.00');  // Оновіть цю суму відповідно до ваших даних
  });

  test('should remove item from cart', () => {
    const buyButton = document.querySelector('.buy-button');
    buyButton.click();

    const removeButton = document.querySelector('.remove-button');
    removeButton.click();

    const cartItems = document.querySelector('#cart-items').children;
    expect(cartItems.length).toBe(0);
  });

  test('should show alert when checkout is successful', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const buyButton = document.querySelector('.buy-button');
    buyButton.click();

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.click();

    expect(window.alert).toHaveBeenCalledWith('Замовлення оформлено! Дякуємо за покупку.');
  });
});
