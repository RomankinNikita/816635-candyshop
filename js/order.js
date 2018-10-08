// Модуль для работы с формой заказа:
'use strict';

(function () {
  var Valid = {
    REQUIRED_LENGTH: 1,
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    CARD_NUMBER_LENGTH: 16,
    CARD_CVC_LENGTH: 3,
    CARD_CVC_MIN_VALUE: 100
  };
  var RegExp = {
    NAME_REG_EXP: /^[a-zA-ZА-Яа-яЁё]+$/,
    EMAIL_REG_EXP: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
    CARD_DATE_REG_EXP: /^((0[1-9])|(1[0-2]))\/(\d{2})$/,
    CARDHOLDER_REG_EXP: /^[a-zA-Z ]*$/,
  };
  var orderForm = document.querySelector('#order-form'); // Форма заказа

  // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ФОРМЕ ОФОРМЛЕНИЯ ЗАКАЗА:
  var toDisableInputs = function (inputs, value) { // активация/деактивация полей формы
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = value;
    }
  };

  var toSwitchHidden = function (switchEvt, className, blockOne, blockTwo) {
    var inputsOne = blockOne.querySelectorAll('input');
    var inputsTwo = blockTwo.querySelectorAll('input');

    if (switchEvt.target.id === className) {
      blockOne.classList.remove('visually-hidden');
      blockTwo.classList.add('visually-hidden');
      toDisableInputs(inputsOne, false);
      toDisableInputs(inputsTwo, true);
    }
  };

  var switchMethodBlock = function (evt, classOne, classTwo) {
    var methodBlockOne = document.querySelector('.' + classOne);
    var methodBlockTwo = document.querySelector('.' + classTwo);
    toSwitchHidden(evt, classOne, methodBlockOne, methodBlockTwo);
    toSwitchHidden(evt, classTwo, methodBlockTwo, methodBlockOne);
    orderForm.elements['deliver-description'].disabled = (methodBlockTwo.classList.contains('visually-hidden')) ? true : false;
  };

  orderForm.addEventListener('change', function (changeEvt) {
    changeEvt.preventDefault();
    if (changeEvt.target.name === 'pay-method') {
      switchMethodBlock(changeEvt, 'payment__card', 'payment__cash');
    }
    if (changeEvt.target.name === 'method-deliver') {
      switchMethodBlock(changeEvt, 'deliver__store', 'deliver__courier');
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

  var valid = true;

  var renderError = function (elem, text) { // Функция отрисовки ошибки
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
  };

  var toCheckCardNumber = function (numberValue) {
    var cardNumbers = numberValue.split('');
    var sum = 0;
    for (var i = 0; i < cardNumbers.length; i++) {
      if (i % 2 === 0) {
        cardNumbers[i] *= 2;
        if (cardNumbers[i] > 9) {
          cardNumbers[i] -= 9;
        }
      }
      sum += +cardNumbers[i];
    }

    if (sum % 10 !== 0) {
      return false;
    }
    return true;
  };

  var successUploadHandler = function () {
    orderForm.reset();
    window.popup.modalSuccessSection.classList.remove('modal--hidden');
    window.popup.closeSuccessPopup();
  };
  var errorUploadHandler = function (message) {
    window.popup.closeErrorPopup(message);
  };

  orderForm.addEventListener('blur', function (blurEvt) {
    blurEvt.preventDefault();
    var target = blurEvt.target;

    if (target === formName) {
      if (formName.value.length > Valid.MAX_LENGTH) {
        valid = false;
        renderError(formName, 'Поле не должно содержать больше 20 символов!');
      }
      if (formName.value.length < Valid.MIN_LENGTH) {
        valid = false;
        renderError(formName, 'Поле должно содержать не меньше 2 символов!');
      }
      if (!RegExp.NAME_REG_EXP.test(formName.value)) {
        valid = false;
        renderError(formName, 'Поле должно содержать текст!');
      }
    }

    if (target === formTel) {
      if (formTel.value.length < Valid.REQUIRED_LENGTH) {
        valid = false;
        renderError(formTel, 'Это поле, обязательное для заполнения!');
      }
    }

    if (target === formEmail) {
      if (formEmail.value.length !== 0) {
        if (!RegExp.EMAIL_REG_EXP.test(formEmail.value)) {
          valid = false;
          renderError(formEmail, 'Введите корректный адрес');
        }
      }
    }

    if (target === cardNumber) {
      if (cardNumber.value.length !== Valid.CARD_NUMBER_LENGTH && cardNumber.disabled === false) {
        valid = false;
        renderError(cardNumber, 'Введите 16-значный номер карты!');
      }
      if (!toCheckCardNumber(cardNumber.value) && cardNumber.disabled === false) {
        valid = false;
        renderError(cardNumber, 'Номер карты некорректен');
      }
    }

    if (target === cardDate) {
      if (cardDate.value.length < Valid.REQUIRED_LENGTH && cardDate.disabled === false) {
        valid = false;
        renderError(cardDate, 'Обязательное поле!');
      }
      if (!RegExp.CARD_DATE_REG_EXP.test(cardDate.value) && cardDate.disabled === false) {
        valid = false;
        renderError(cardDate, 'Введите дату в формате мм/гг');
      }
    }

    if (target === cardCvc) {
      if (cardCvc.value.length !== Valid.CARD_CVC_LENGTH && cardCvc.disabled === false) {
        valid = false;
        renderError(cardCvc, 'Введите трехзначный код!');
      }
      if (cardCvc.value < Valid.CARD_CVC_MIN_VALUE && cardCvc.disabled === false) {
        valid = false;
        renderError(cardCvc, 'Введите значение от 100 до 999');
      }
    }

    if (target === cardHolderName) {
      if (cardHolderName.value.length > Valid.MAX_LENGTH && cardHolderName.disabled === false) {
        valid = false;
        renderError(cardHolderName, 'Поле не должно содержать больше 20 символов!');
      }
      if (cardHolderName.value.length < Valid.MIN_LENGTH && cardHolderName.disabled === false) {
        valid = false;
        renderError(cardHolderName, 'Поле должно содержать не меньше 2 символов!');
      }
      if (!RegExp.CARDHOLDER_REG_EXP.test(cardHolderName.value) && cardHolderName.disabled === false) {
        valid = false;
        renderError(cardHolderName, 'Поле должно содержать текст!');
      }
    }

    if (target === deliverStreet) {
      if (deliverStreet.value.length < Valid.REQUIRED_LENGTH && deliverStreet.disabled === false) {
        valid = false;
        renderError(deliverStreet, 'Обязательное поле!');
      }
    }

    if (target === deliverHouse) {
      if (deliverHouse.value.length < Valid.REQUIRED_LENGTH && deliverHouse.disabled === false) {
        valid = false;
        renderError(deliverHouse, 'Обязательное поле!');
      }
    }

    if (target === deliverFloor) {
      if (isNaN(deliverFloor.value) && deliverFloor.disabled === false) {
        valid = false;
        renderError(deliverFloor, 'Введите число!');
      }
    }

    if (target === deliverRoom) {
      if (deliverRoom.value.length < Valid.REQUIRED_LENGTH && deliverRoom.disabled === false) {
        valid = false;
        renderError(deliverRoom, 'Обязательное поле!');
      }
    }
  }, true);

  orderForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    // ИМЯ
    if (formName.value.length > Valid.MAX_LENGTH) {
      valid = false;
      renderError(formName, 'Поле не должно содержать больше 20 символов!');
    }
    if (formName.value.length < Valid.MIN_LENGTH) {
      valid = false;
      renderError(formName, 'Поле должно содержать не меньше 2 символов!');
    }
    if (!RegExp.NAME_REG_EXP.test(formName.value)) {
      valid = false;
      renderError(formName, 'Поле должно содержать текст!');
    }
    // ТЕЛЕФОН
    if (formTel.value.length < Valid.REQUIRED_LENGTH) {
      valid = false;
      renderError(formTel, 'Это поле, обязательное для заполнения!');
    }
    // ПОЧТА
    if (formEmail.value.length !== 0) {
      if (!RegExp.EMAIL_REG_EXP.test(formEmail.value)) {
        valid = false;
        renderError(formEmail, 'Введите корректный адрес');
      }
    }
    // НОМЕР КАРТЫ
    if (cardNumber.value.length !== Valid.CARD_NUMBER_LENGTH && cardNumber.disabled === false) {
      valid = false;
      renderError(cardNumber, 'Введите 16-значный номер карты!');
    }
    if (!toCheckCardNumber(cardNumber.value) && cardNumber.disabled === false) {
      valid = false;
      renderError(cardNumber, 'Номер карты некорректен');
    }
    // СРОК ДЕЙСТВИЯ
    if (cardDate.value.length < Valid.REQUIRED_LENGTH && cardDate.disabled === false) {
      valid = false;
      renderError(cardDate, 'Обязательное поле!');
    }
    if (!RegExp.CARD_DATE_REG_EXP.test(cardDate.value) && cardDate.disabled === false) {
      valid = false;
      renderError(cardDate, 'Введите дату в формате мм/гг');
    }
    // CVC
    if (cardCvc.value.length !== Valid.CARD_CVC_LENGTH && cardCvc.disabled === false) {
      valid = false;
      renderError(cardCvc, 'Введите трехзначный код!');
    }
    if (cardCvc.value < Valid.CARD_CVC_MIN_VALUE && cardCvc.disabled === false) {
      valid = false;
      renderError(cardCvc, 'Введите значение от 100 до 999');
    }
    // ИМЯ ДЕРЖАТЕЛЯ КАРТЫ
    if (cardHolderName.value.length > Valid.MAX_LENGTH && cardHolderName.disabled === false) {
      valid = false;
      renderError(cardHolderName, 'Поле не должно содержать больше 20 символов!');
    }
    if (cardHolderName.value.length < Valid.MIN_LENGTH && cardHolderName.disabled === false) {
      valid = false;
      renderError(cardHolderName, 'Поле должно содержать не меньше 2 символов!');
    }
    if (!RegExp.CARDHOLDER_REG_EXP.test(cardHolderName.value) && cardHolderName.disabled === false) {
      valid = false;
      renderError(cardHolderName, 'Поле должно содержать текст!');
    }
    // УЛИЦА
    if (deliverStreet.value.length < Valid.REQUIRED_LENGTH && deliverStreet.disabled === false) {
      valid = false;
      renderError(deliverStreet, 'Обязательное поле!');
    }
    // ДОМ
    if (deliverHouse.value.length < Valid.REQUIRED_LENGTH && deliverHouse.disabled === false) {
      valid = false;
      renderError(deliverHouse, 'Обязательное поле!');
    }
    // ЭТАЖ
    if (isNaN(deliverFloor.value) && deliverFloor.disabled === false) {
      valid = false;
      renderError(deliverFloor, 'Введите число!');
    }
    // КВАРТИРА
    if (deliverRoom.value.length < Valid.REQUIRED_LENGTH && deliverRoom.disabled === false) {
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
    storeImg.src = 'img/map/' + evt.target.value + '.jpg';
  });
  // Статус карты:
  var cardStatus = document.querySelector('.payment__card-status');
  var cardInputList = document.querySelector('.payment__inputs');
  cardInputList.addEventListener('input', function (evt) {
    evt.preventDefault();
    var validate = true;
    validate = (!(!RegExp.CARD_DATE_REG_EXP.test(cardDate.value)) && !(cardNumber.value.length !== Valid.CARD_NUMBER_LENGTH) && !(!toCheckCardNumber(cardNumber.value)) && !(cardDate.value.length < Valid.REQUIRED_LENGTH) && !(cardCvc.value < Valid.CARD_CVC_MIN_VALUE) && !(cardCvc.value.length !== Valid.CARD_CVC_LENGTH) && !(cardHolderName.value.length < Valid.MIN_LENGTH) && !(!RegExp.CARDHOLDER_REG_EXP.test(cardHolderName.value))) ? true : false;
    cardStatus.textContent = validate ? 'Одобрен' : 'Не определён';
  });
})();
