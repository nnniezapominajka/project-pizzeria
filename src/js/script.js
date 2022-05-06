// eslint-disable-next-line no-redeclare
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
  },
  cartProduct: {
     amountWidget: '.widget-amount',
     price: '.cart__product-price',
     edit: '[href="#edit"]',
     remove: '[href="#remove"]',
  },
};

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    }
  };


  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
  cart: {
    defaultDeliveryFee: 20,
    },
 };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };
  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      //console.log('new Product:, this Product');
    }
    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.dom= {};

      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.dom.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion (){
      const thisProduct = this;

      /* find the clickable trigger (to element thas should react to clicking) */
      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log('clickableTrigger:', clickableTrigger);
      /* START: add event listener to clickable trigger on event click */
      thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {

        /* prevent default action for event */
        event.preventDefault();

        /* find active product (product that has active class) */
        const activeProduct = document.querySelectorAll(select.all.menuProductsActive);

        /* if there is active product and it's not thisProduct.element, remove class active from it*/
        for (let active of activeProduct) {
          if (active !== thisProduct.element) {

            active.classList.remove(classNames.menuProduct.wrapperActive);
          }
        }

        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
   }

initOrderForm(){
  const thisProduct = this;
  //console.log ('initOrderForm:', thisProduct);

  thisProduct.dom.form.addEventListener('sumbit', function(event){
    event.preventDefault();
    thisProduct.processOrder();
  });

  for ( let input of thisProduct.dom.formInputs){
    input.addEventListener('change', function(){
      thisProduct.processOrder();
    });
  }

  thisProduct.dom.cartButton.addEventListener('click', function(event){
    event.preventDefault();
    thisProduct.addToCart();
    thisProduct.processOrder();
  });

}

processOrder (){
  const thisProduct = this;
  //console.log ('processOrder:', thisProduct);

  // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
  const formData = utils.serializeFormToObject(thisProduct.dom.form);
  //console.log('formData:', formData);

  //set price to default price
  let price = thisProduct.data.price;

  //for every category (param)...
  for(let paramId in thisProduct.data.params){

    // determine parm value, e.g paramID = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
    const param = thisProduct.data.params[paramId];
    //console.log(paramId, param);

    //for every option in this category
    for(let optionId in param.options){

      //determione option value, e.g optionId = olives', option = { label: 'Olives', price: 2, default: true }
      const option = param.options[optionId];
      //console.log(optionId, option);

      //chech if there is parm with a name of paramId in formData and if it includes optionIId);
      const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
      //if(formData[paramId] && formData[paramId].includes(optionId)) {
      if(optionSelected){
        // chech if the option is not default
        if(!option.default == true) {
          //add option price to price variable
          price += option.price
        }
      } else {
        //check if the option is default
        if(option.default == true)
           // reduce price variable
          price -= option.price;

      }
      const optionImage = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);
      //console.log('optionImage:', optionImage);

      if(optionImage) {
        if(optionSelected){
          optionImage.classList.add(classNames.menuProduct.imageVisible);
        } else {
          optionImage.classList.remove(classNames.menuProduct.imageVisible);
        }
      }
    }
  }

  /* muptiply price by amount */
  price *= thisProduct.amountWidget.dom.value;
  // update calculated price in the HTML
  thisProduct.dom.priceElem.innerHTML = price;
  }
  initAmmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);
    thisProduct.dom.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;

    app.cart.add(thisProduct);

  }
  prepartCartProduct(){
    const thisProduct = this;

    const productSummary = {};

  }
  prepareCartProductsParams(){
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.dom.form);
    const params = {};
    for(let paramId in thisProduct.data.params){
      // determine parm value, e.g paramID = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      //console.log(paramId, param);
      //create category param in params const
      params[paramID] = {
        label: param.label,
        options: {}
      }

      for(let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if(optionSelected) {
          // option is selected!
        }
      }
    }
    return params;
  }
}


class AmountWidget{
  constructor(element){
    const thisWidget = this;



    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.dom.input.value);
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);

  }

  getElements(element){
    const thisWidget = this;

    thisWidget.dom = {};

    thisWidget.dom.element = element;
    thisWidget.dom.input = thisWidget.dom.element.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.element.querySelector(select.widgets.amount.linkIncrease);
    thisWidget.dom.value = settings.amountWidget.defaultValue;
  }

  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);

    /* TODO: Add validiation */

    if(thisWidget.dom.value !== newValue && !isNaN(newValue)
    && value <= settings.amountWidget.defaultMax
    && value >= settings.amountWidget.defaultMin){
      thisWidget.dom.value = newValue;
    }
      thisWidget.announce();
      thisWidget.dom.input.value = thisWidget.dom.value;


  }
  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.dom.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.dom.value + 1);
    });
  }

  announce(){
    const thisWidget = this;

    const event = new Event('updated');
    thisWidget.dom.element.dispatchEvent(event);
  }
}

// eslint-disable-next-line no-unused-vars
class Cart {
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    //console.log('new Cart:', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      //console.log('thisCart.dom.toggleTrigger:', thisCart.dom.toggleTrigger);
  }
  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

  }
  add(menuProduct){
    //const thisCart = this;

    console.log('adding product:', menuProduct);
  }
  

}


const app = {
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data', thisApp.data);
    for(let productData in thisApp.data.products) {
      new Product(productData, thisApp.data.products[productData]);
    }
  },

  initData: function() {
    const thisApp = this;

    thisApp.data = dataSource;
  },

    init: function() {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
      //console.log('this.initCart:', thisApp.cart);
  },
  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select,containerOf.cart);
    thisApp.cart = new Cart (cartElem);
  },
};

 app.init();

} 