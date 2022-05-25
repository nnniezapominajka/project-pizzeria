import {select, settings} from '../settings.js';


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

    //const event = new Event('updated');
    const event = new CustomEvent ('updated', {
      bubbles: true
    });

    thisWidget.dom.element.dispatchEvent(event);
  }
}
export default AmountWidget;