// Модуль, который создаёт данные:
'use strict';
(function () {
  window.popup = {
    modalErrorMessage: document.querySelector('.modal__message'),
    modalErrorSection: document.querySelector('#modal-error'),
    modalErrorClose: document.querySelector('#error__close-btn'),
    modalSuccessSection: document.querySelector('#modal-success'),
    modalSuccessClose: document.querySelector('#success__close-btn'),
    escCloseButtonHandler: function (evt, elem) {
      if (evt.keyCode === 27) {
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

  var successDataHandler = function (data) {
    var loadBlock = document.querySelector('.catalog__cards');
    var loadText = document.querySelector('.catalog__load');
    loadBlock.classList.remove('catalog__cards--load');
    loadText.classList.add('visually-hidden');
    window.candies = data;
    var fillBlock = function (block, createElement, data) {
      var fragment = document.createDocumentFragment();

      data.forEach(function (item, i) {
        fragment.appendChild(createElement(item, i));
      });
      block.appendChild(fragment);
    };
    fillBlock(loadBlock, window.renderCandy, window.candies);
  };

  window.load(successDataHandler, errorDataHandler);
})();
