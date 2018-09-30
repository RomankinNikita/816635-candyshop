// Модуль для работы с формой заказа:
'use strict';

(function () {
  // Поля формы с информацией о способе доставки
  var deliverStoreFieldset = document.querySelector('.deliver__stores');
  var deliverCourierFieldset = document.querySelector('.deliver__entry-fields-wrap');

function switchFieldsetSubmit(fieldOne, fieldTwo) { // fieldset enabled/disabled
  fieldOne.disabled = true;
  fieldTwo.disabled = false;
};

var cardWrap = document.querySelector('.payment__card-wrap'); // Поля формы заполнения данных банковской карты


  // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ФОРМЕ ОФОРМЛЕНИЯ ЗАКАЗА:
  var containerPayment = document.querySelector('.payment__method');
  containerPayment.addEventListener('click', function () {
    toSwitchTab('.payment__card', '.payment__cash', '-wrap');
  });
  var containerDeliver = document.querySelector('.deliver__toggle');
  containerDeliver.addEventListener('click', function (event) {
    toSwitchTab('.deliver__store', '.deliver__courier', '', deliverCourierFieldset, deliverStoreFieldset);
  }, true);
  // СМЕНА ВКЛАДОК:
  function toSwitchTab(openClass, closeClass, specialString, fieldOne, fieldTwo) {
    if (event.target.id) {
      var openWindow = document.querySelector(openClass + specialString);
      var closeWindow = document.querySelector(closeClass + specialString);
      var currentWindow = document.querySelector('.' + event.target.id + specialString);
      currentWindow.classList.remove('visually-hidden');
      if (currentWindow === openWindow) {
        closeWindow.classList.add('visually-hidden');
        switchFieldsetSubmit(fieldOne, fieldTwo);
      } else {
        openWindow.classList.add('visually-hidden');
        switchFieldsetSubmit(fieldTwo, fieldOne);
      }
    }
  }

  // Форма:
  var orderForm = document.querySelector('#order-form'); // Форма заказа
  var valid = true;

  function renderError(elem, text) { // Функция отрисовки ошибки
    var p = document.createElement('p');
    elem.style.border = '2px solid red';
    p.textContent = text;
    elem.parentElement.appendChild(p);
    var focusHandler = function () {
      valid = true;
      p.remove();
      elem.style.border = '';
      elem.addEventListener('blur', blurHandler);
    };
    var blurHandler = function () {
      elem.removeEventListener('focus', focusHandler);
      elem.removeEventListener('blur', blurHandler);
    };
    elem.addEventListener('focus', focusHandler);
  };

  var successUploadHandler = function () {
    orderForm.reset();
    window.popup.modalSuccessSection.classList.remove('modal--hidden');
    window.popup.closeSuccessPopup();
  };
  var errorUploadHandler = function (message) {
    window.popup.closeErrorPopup(message);
  };
  orderForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (orderForm.name.length > 20) {
      valid = false;
      renderError(orderForm.name, 'Поле не должно содержать больше 20 символов');
    }
    if (orderForm.name.length < 2) {
      valid = false;
      renderError(orderForm.name, 'Поле должно содержать не меньше 2 символов');
    }
    if (orderForm.name.length === 0) {
      valid = false;
      renderError(orderForm.name, 'Укажите Ваше имя');
    }
    // Спросить про проверку на формат
    if (orderForm.tel.length > 15) {
      valid = false;
      renderError(orderForm.name, 'Поле не должно содержать больше 15 символов');
    }
    if (orderForm.tel.length < 6) {
      valid = false;
      renderError(orderForm.name, 'Поле должно содержать не меньше 6 символов');
    }
    if (orderForm.tel.length === 0) {
      valid = false;
      renderError(orderForm.name, 'Укажите Ваш телефон');
    }
    if (valid) {
      orderForm.submit();
    }
    window.upload(new FormData(orderForm), successUploadHandler, errorUploadHandler);
  });
})();
