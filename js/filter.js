'use strict';

(function () {
  // // ФИЛЬТР ПО ЦЕНЕ:
  var rangeFilter = document.querySelector('.range__filter'); // Блок слайдера
  var rangeFillLine = rangeFilter.querySelector('.range__fill-line'); // Ползунок слайдера
  var rangePricePinLeft = rangeFilter.querySelector('.range__btn--left'); // Левый пин
  var rangePricePinRight = rangeFilter.querySelector('.range__btn--right'); // Правый пин

  var changePrice = new Event('changePrice', {
    bubbles: true,
    cancelable: true
  });
  changePrice.price = {
    min: 0,
    max: 90
  };

  var mouseDownHandler = function (downEvt) { // Обработчик mouseDown
    downEvt.preventDefault();
    var currentPin = null;
    var anotherPin = null;
    var isLeft = true; // Левый или правый пин
    var rangeFillLineMiddle = rangeFilter.offsetLeft + rangeFillLine.offsetLeft + rangeFillLine.offsetWidth / 2; // Расстояние до середины ползунка
    if (downEvt.clientX <= rangeFillLineMiddle) { // Если ближе середины ползунка
      currentPin = rangePricePinLeft; // то левый пин
      anotherPin = rangePricePinRight;
    } else if (downEvt.clientX > rangeFillLineMiddle) { // иначе
      currentPin = rangePricePinRight; // правый пин
      anotherPin = rangePricePinLeft;
      isLeft = false;
    }

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      if (moveEvt.clientX >= rangeFilter.offsetLeft && moveEvt.clientX <= rangeFilter.offsetLeft + rangeFilter.offsetWidth && currentPin.offsetLeft !== anotherPin.offsetLeft) { // Ограничение движения ползунка за пределы ширины слайдера и друг друга
        if (isLeft) { // Если левый пин
          setPriceRange(currentPin, moveEvt, 'min', true);
        } else { // Если правый пин
          setPriceRange(currentPin, moveEvt, 'max', false);
        }
      } else {
        // document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      }
    };

    var mouseUpPreventHandler = function (evt) { // Запрещает отрабатывать событию mouseUp
      evt.preventDefault();
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseUpPreventHandler);
    };

    var mouseUpHandler = function (upEvt) { // Обработчик mouseUp
      upEvt.preventDefault();

      if (isLeft) { // Если левый пин
        changePrice.price.min = setPriceRange(currentPin, upEvt, 'min', true);
      } else { // Если правый пин
        changePrice.price.max = setPriceRange(currentPin, upEvt, 'max', false);
      }
      document.dispatchEvent(changePrice);
      document.removeEventListener('mousemove', mouseMoveHandler); // Удалим все
      document.removeEventListener('mouseup', mouseUpHandler); // обработчики при
      document.removeEventListener('mousemove', mouseUpPreventHandler); // отпускании мыши

    };

    if (downEvt.target === currentPin) { // Если нажали на пин, то можно перетаскивать ползунок
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    } else { // Если нажали не на один из пинов, то
      document.addEventListener('mouseup', mouseUpHandler); // изменим значения, если пользователь совершил только клик без перемещений
      document.addEventListener('mousemove', mouseUpPreventHandler); // запретим менять значения, если пользователь перемещал мышь без нажатого пина
    }
  };

  var setPriceRange = function (pin, eventName, rangeClass, isLeft) { // Установка значений слайдера и цены
    var rangePrice = document.querySelector('.range__price--' + rangeClass); // Минимальная цена
    var pinWidth = pin.offsetWidth;
    var shift = eventName.clientX - rangeFilter.offsetLeft;
    var zeroValue = 0 + 'px';
    if (eventName) {
      pin.style.left = (shift - pinWidth / 2) + 'px'; // Применим через стили полож. пина
    } else {
      if (isLeft) {
        rangePricePinLeft.style.left = zeroValue;
      } else {
        rangePricePinRight.style.left = rangeFilter.offsetWidth + 'px';
      }
    }
    if (isLeft) {
      rangeFillLine.style.left = eventName ? (shift) + 'px' : zeroValue; // Применим через стили крайнее левое полож. ползунка
    } else {
      rangeFillLine.style.right = eventName ? (rangeFilter.offsetWidth - pin.offsetLeft - pinWidth / 2) + 'px' : zeroValue; // Применим через стили крайнее правое полож. ползунка
    }
    var priceValue = eventName ? Math.round((pin.offsetLeft + pinWidth / 2) / 245 * 90) : (isLeft ? 0 : 90);
    rangePrice.textContent = priceValue // Установим значение цены, соответствующее положению пина
    return priceValue;
  };

  rangeFilter.addEventListener('mousedown', mouseDownHandler);

  window.slider = {
    reset: function () {
      changePrice.price.min = setPriceRange(rangePricePinLeft, '', 'min', true);
      changePrice.price.max = setPriceRange(rangePricePinRight, '', 'max', false);
    }
  }
})();
