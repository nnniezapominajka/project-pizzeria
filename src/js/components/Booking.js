import {
  select,
  templates
} from '../settings.js';
import AmountWidget from './AmountWidget.js';


class Booking {
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets(thisBooking.dom.peopleAmount.addEventListener('updated', function () {
    }));
    thisBooking.initWidgets(thisBooking.dom.hoursAmount.addEventListener('updated', function () {
    }));
  }

  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget(thisBooking.data);
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    console.log( thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.amountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.amountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

  }
}

export default Booking;