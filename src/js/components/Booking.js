import {select,templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element){
    const thisBooking = this;
    //debugger;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.innerHTML = generatedHTML;
    //console.log('thisBooking.dom.wrapper.innerHTML', thisBooking.dom.wrapper.innerHTML)
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);

  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.amountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.amountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.peopleAmount.addEventListener('updated', function() {

    });
    thisBooking.dom.hoursAmount.addEventListener('updated', function() {

    });

    thisBooking.dom.datePicker = new DatePicker (thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = new HourPicker (thisBooking.dom.hourPicker);

  }
}

export default Booking;