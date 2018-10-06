// Модуль для работы с формой заказа:
'use strict';

(function () {
  var orderForm = document.querySelector('#order-form'); // Форма заказа

  // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ФОРМЕ ОФОРМЛЕНИЯ ЗАКАЗА:
  function toDisableInputs(inputs, value) { // активация/деактивация полей формы
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = value;
    }
  }

  function toSwitchHidden(switchEvt, className, blockOne, blockTwo) {
    var inputsOne = blockOne.querySelectorAll('input');
    var inputsTwo = blockTwo.querySelectorAll('input');

    if (switchEvt.target.id === className) {
      blockOne.classList.remove('visually-hidden');
      blockTwo.classList.add('visually-hidden');
      toDisableInputs(inputsOne, false);
      toDisableInputs(inputsTwo, true);
    }
  }

  function switchMethodBlock(evt, classOne, classTwo) {
    var methodBlockOne = document.querySelector('.' + classOne);
    var methodBlockTwo = document.querySelector('.' + classTwo);
    toSwitchHidden(evt, classOne, methodBlockOne, methodBlockTwo);
    toSwitchHidden(evt, classTwo, methodBlockTwo, methodBlockOne);
    orderForm.elements['deliver-description'].disabled = (methodBlockTwo.classList.contains('visually-hidden')) ? true : false;
  }

  orderForm.addEventListener('change', function (event) {
    event.preventDefault();
    if (event.target.name === 'pay-method') {
      switchMethodBlock(event, 'payment__card', 'payment__cash');
    }
    if (event.target.name === 'method-deliver') {
      switchMethodBlock(event, 'deliver__store', 'deliver__courier');
    }
  });

  // Форма:
  var cardDate = orderForm['card-date'];
  var cardCvc = orderForm['card-cvc'];
  var cardHolderName = orderForm.cardholder;
  var cardNumber = orderForm['card-number'];
  var deliverStreet = orderForm['deliver-street'];
  var deliverHouse = orderForm['deliver-house'];
  var deliverFloor = orderForm['deliver-floor'];
  var deliverRoom = orderForm['deliver-room'];
  var formName = orderForm.name;
  var formTel = orderForm.tel;
  var formEmail = orderForm.email;


  var regExObj = {
    nameRegExp: /^[a-zA-ZА-Яа-яЁё]+$/,
    emailRegExp: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
    cardDateRegExp: /^((0[1-9])|(1[0-2]))\/(\d{2})$/, // 4272290303583157
    cardHolderRegExp: /^[a-zA-Z ]*$/,
  };
  var valid = true;

  function renderError(elem, text) { // Функция отрисовки ошибки
    var errorElem = document.createElement('p');
    elem.style.border = '2px solid red';
    errorElem.textContent = text;
    elem.parentElement.appendChild(errorElem);
    var focusHandler = function (evt) {
      evt.preventDefault();
      valid = true;
      errorElem.remove();
      elem.style.border = '';
      elem.addEventListener('blur', blurHandler);
    };
    var blurHandler = function () {
      elem.removeEventListener('focus', focusHandler);
      elem.removeEventListener('blur', blurHandler);
    };
    elem.addEventListener('focus', focusHandler);
  }

  function toCheckCardNumber(numberValue) {
    var splitArr = numberValue.split('');
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
      return false;
    }
    return true;
  }

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
    // ИМЯ
    if (formName.value.length > 20) {
      valid = false;
      renderError(formName, 'Поле не должно содержать больше 20 символов!');
    }
    if (formName.value.length < 2) {
      valid = false;
      renderError(formName, 'Поле должно содержать не меньше 2 символов!');
    }
    if (!regExObj.nameRegExp.test(formName.value)) {
      valid = false;
      renderError(formName, 'Поле должно содержать текст!');
    }
    // ТЕЛЕФОН
    if (formTel.value.length < 1) {
      valid = false;
      renderError(formTel, 'Это поле, обязательное для заполнения!');
    }
    // ПОЧТА
    if (formEmail.value.length !== 0) {
      if (!regExObj.emailRegExp.test(formEmail.value)) {
        valid = false;
        renderError(formEmail, 'Введите корректный адрес');
      }
    }
    // НОМЕР КАРТЫ
    if (cardNumber.value.length !== 16 && cardNumber.disabled === false) {
      valid = false;
      renderError(cardNumber, 'Введите 16-значный номер карты!');
    }
    if (!toCheckCardNumber(cardNumber.value) && cardNumber.disabled === false) {
      valid = false;
      renderError(cardNumber, 'Номер карты некорректен');
    }
    // СРОК ДЕЙСТВИЯ
    if (cardDate.value.length < 1 && cardDate.disabled === false) {
      valid = false;
      renderError(cardDate, 'Обязательное поле!');
    }
    if (!regExObj.cardDateRegExp.test(cardDate.value) && cardDate.disabled === false) {
      valid = false;
      renderError(cardDate, 'Введите дату в формате мм/гг');
    }
    // CVC
    if (cardCvc.value.length !== 3 && cardCvc.disabled === false) {
      valid = false;
      renderError(cardCvc, 'Введите трехзначный код!');
    }
    if (cardCvc.value < 100 && cardCvc.disabled === false) {
      valid = false;
      renderError(cardCvc, 'Введите значение от 100 до 999');
    }
    // ИМЯ ДЕРЖАТЕЛЯ КАРТЫ
    if (cardHolderName.value.length > 20 && cardHolderName.disabled === false) {
      valid = false;
      renderError(cardHolderName, 'Поле не должно содержать больше 20 символов!');
    }
    if (cardHolderName.value.length < 2 && cardHolderName.disabled === false) {
      valid = false;
      renderError(cardHolderName, 'Поле должно содержать не меньше 2 символов!');
    }
    if (!regExObj.cardHolderRegExp.test(cardHolderName.value) && cardHolderName.disabled === false) {
      valid = false;
      renderError(cardHolderName, 'Поле должно содержать текст!');
    }
    // УЛИЦА
    if (deliverStreet.value.length < 1 && deliverStreet.disabled === false) {
      valid = false;
      renderError(deliverStreet, 'Обязательное поле!');
    }
    // ДОМ
    if (deliverHouse.value.length < 1 && deliverHouse.disabled === false) {
      valid = false;
      renderError(deliverHouse, 'Обязательное поле!');
    }
    // ЭТАЖ
    if (isNaN(deliverFloor.value) && deliverFloor.disabled === false) {
      valid = false;
      renderError(deliverFloor, 'Введите число!');
    }
    // КВАРТИРА
    if (deliverRoom.value.length < 1 && deliverRoom.disabled === false) {
      valid = false;
      renderError(deliverRoom, 'Обязательное поле!');
    }
    if (valid) {
      window.upload(new FormData(orderForm), successUploadHandler, errorUploadHandler);
    }
  });

  // Смена карты метро:
  var storeImg = document.querySelector('.deliver__store-map-img');
  var subwayList = document.querySelector('.deliver__store-list');
  subwayList.addEventListener('change', function (evt) {
    evt.preventDefault();
    storeImg.src = 'img/map/' + event.target.value + '.jpg';
  });
  // Статус карты:
  var cardStatus = document.querySelector('.payment__card-status');
  var cardInputList = document.querySelector('.payment__inputs');
  cardInputList.addEventListener('input', function (evt) {
    evt.preventDefault();
    var validate = true;
    validate = (!(!regExObj.cardDateRegExp.test(cardDate.value)) && !(cardNumber.value.length !== 16) && !(!toCheckCardNumber(cardNumber.value)) && !(cardDate.value.length < 1) && !(cardCvc.value < 100) && !(cardCvc.value < 100) && !(cardHolderName.value.length < 2) && !(!regExObj.cardHolderRegExp.test(cardHolderName.value))) ? true : false;
    cardStatus.textContent = validate ? 'Одобрен' : 'Не определён';
  });
})();
