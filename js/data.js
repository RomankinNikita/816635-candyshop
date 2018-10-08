// Модуль, который создаёт данные:
'use strict';
(function () {
  var ESC_KEY = 27;
  var candies = null;
  window.popup = {
    modalErrorMessage: document.querySelector('.modal__message'),
    modalErrorSection: document.querySelector('#modal-error'),
    modalErrorClose: document.querySelector('#error__close-btn'),
    modalSuccessSection: document.querySelector('#modal-success'),
    modalSuccessClose: document.querySelector('#success__close-btn'),
    escCloseButtonHandler: function (evt, elem) {
      if (evt.keyCode === ESC_KEY) {
        elem.classList.add('modal--hidden');
        document.removeEventListener('keydown', function () {
          window.popup.escCloseButtonHandler(evt, elem);
        });
      }
    },
    clickCloseButtonHandler: function (elem) {
      elem.classList.add('modal--hidden');
      elem.removeEventListener('click', function () {
        window.popup.clickCloseButtonHandler(elem);
      });
    },
    closePopup: function (modalSection, modalClose) {
      document.addEventListener('keydown', function (evt) {
        window.popup.escCloseButtonHandler(evt, modalSection);
      });
      modalClose.addEventListener('click', function () {
        window.popup.clickCloseButtonHandler(modalSection);
      });
    },
    closeSuccessPopup: function () {
      window.popup.closePopup(window.popup.modalSuccessSection, window.popup.modalSuccessClose);
    },
    closeErrorPopup: function (message) {
      window.popup.modalErrorMessage.textContent = message;
      window.popup.modalErrorSection.classList.remove('modal--hidden');
      window.popup.closePopup(window.popup.modalErrorSection, window.popup.modalErrorClose);
    }
  };
  var errorDataHandler = function (message) {
    window.popup.closeErrorPopup(message);
  };
  var loadData = new Event('loadData', {bubbles: true, cancelable: true});
  var successDataHandler = function (data) {
    var loadBlock = document.querySelector('.catalog__cards'); // При успешной
    var loadText = document.querySelector('.catalog__load'); // загрузке данных
    loadBlock.classList.remove('catalog__cards--load'); // уберем блок:
    loadText.classList.add('visually-hidden'); // "Данные загружаются"
    candies = data; // Массив с данными, полученными с сервера
    document.dispatchEvent(loadData);
    window.fillBlock = function (block, createElement, dataArr) { // Отрисуем карточки товаров
      var fragment = document.createDocumentFragment();
      dataArr.forEach(function (item, i) {
        fragment.appendChild(createElement(item, i));
      });
      block.appendChild(fragment);
    };

    window.fillBlock(loadBlock, window.renderCandy, candies);
  };
  window.load(successDataHandler, errorDataHandler);

  window.data = {
    get: function () {
      return candies;
    }
  };
})();
