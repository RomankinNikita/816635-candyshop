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

  // алгоритм Луна
  function cardNumberInputHandler() {
    var inputCard = event.target;
    var inputCardValue = inputCard.value;
    var splitArr = inputCardValue.split('');
    var sum = 0;
    for (var i = 0; i < splitArr.length; i++) {
      if (i % 2 === 0) {
        splitArr[i] *= 2;
        if (splitArr[i] > 9) {
          splitArr[i] -= 9;
        }
      }
      sum += +splitArr[i];
    }

    if (sum % 10 !== 0) {
      inputCard.setCustomValidity('Неверный номер карты!');
    }
  }
  var cardNumberInput = document.querySelector('#payment__card-number');
  cardNumberInput.addEventListener('input', cardNumberInputHandler);

  // Отключим поля указания адреса доставки курьером, если поле неактивно:
  var deliverBox = document.querySelector('.deliver__courier');
  var fieldSetCourier = document.querySelector('.deliver__entry-fields-wrap');
  if (deliverBox.classList.contains('visually-hidden')) {
    fieldSetCourier.disabled = 1;
  }
})();
