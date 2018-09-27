// Модуль для работы с формой заказа:
'use strict';

(function () {
  // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ФОРМЕ ОФОРМЛЕНИЯ ЗАКАЗА:
  var containerPayment = document.querySelector('.payment__method');
  containerPayment.addEventListener('click', function () {
    toSwitchTab('.payment__card', '.payment__cash', '-wrap');
  });
  var containerDeliver = document.querySelector('.deliver__toggle');
  containerDeliver.addEventListener('click', function () {
    toSwitchTab('.deliver__store', '.deliver__courier', '');
  });
  // СМЕНА ВКЛАДОК:
  function toSwitchTab(openClass, closeClass, specialString) {
    if (event.target.id) {
      var openWindow = document.querySelector(openClass + specialString);
      var closeWindow = document.querySelector(closeClass + specialString);
      var currentWindow = document.querySelector('.' + event.target.id + specialString);
      currentWindow.classList.remove('visually-hidden');
      if (currentWindow === openWindow) {
        closeWindow.classList.add('visually-hidden');
      } else {
        openWindow.classList.add('visually-hidden');
      }
    }
  }
  // Форма:
  var orderForm = document.querySelector('#order-form');
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
    window.upload(new FormData(orderForm), successUploadHandler, errorUploadHandler);
  });
})();
