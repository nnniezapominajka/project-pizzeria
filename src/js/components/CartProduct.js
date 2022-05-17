import {
  select
} from '../settings.js';
import AmountWidget from './AmountWidget.js';
class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.params = menuProduct.params;

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget(thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
      thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;

      
    }));
    thisCartProduct.initActions();
  }
  getElements(element) {
    const thisCartProduct = this;
    thisCartProduct.dom = {
      amountWidget: element.querySelector(select.cartProduct.amountWidget),
      price: element.querySelector(select.cartProduct.price),
      edit: element.querySelector(select.cartProduct.edit),
      remove: element.querySelector(select.cartProduct.remove),
    };
    thisCartProduct.dom.wrapper = element;

  }
  initAmountWidget() {
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
  }
  remove() {
    const thisCartProduct = this;
    
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  
  initActions() {
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function (event) {
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function (event) {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }

  getData() {
    const thisCartProduct = this;

    const productSummary = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      amount: thisCartProduct.amountWidget.value,
      priceSingle: thisCartProduct.priceSingle,
      price: thisCartProduct.price,
      params: thisCartProduct.params,
    };
    return (productSummary);
  }
}
export default CartProduct;