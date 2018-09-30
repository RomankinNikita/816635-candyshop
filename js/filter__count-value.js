'use strict';
// var conditions = [(elem.kind === 'Мороженое'), (elem.kind === 'Газировка'), (elem.kind === 'Жевательная резинка'), (elem.kind === 'Мармелад'), (elem.kind === 'Зефир'), (elem.nutritionFacts.sugar === false), (elem.nutritionFacts.vegetarian === true), (elem.nutritionFacts.gluten === false), (elem.isFavorite === true), (elem.amount > 0)];
(function () {
  var filterCounts = document.querySelectorAll('.input-btn__item-count'); // выберем все счетчики товаров в фильтрах
  var filterInputButtons = document.querySelectorAll('.input-btn__input--checkbox'); // Все инпуты фильтров
  var condition;
  var toFilterArr = function (i) {
    var filtered = window.candies.filter(function (elem) {
      var conditions = [(elem.kind === 'Мороженое'), (elem.kind === 'Газировка')];
      condition = conditions[i];
      return condition;
    });
    return filtered;
  };
  var setValue = function (index) { // Запишем значение счетчика товара в фильтре
    var value = toFilterArr(index);
    filterCounts[index].textContent = '(' + value.length + ')';
  };
  var toSwitchFilter = function (loadBlock, idButton, index) {
    var flag = false;
    var filterSwitcher = document.querySelector('#' + idButton);
    filterSwitcher.addEventListener('click', function (evt) { // CLICK listener
      flag = !flag;
      while (loadBlock.firstChild) { // Clean loadBlock
        loadBlock.removeChild(loadBlock.firstChild);
      }
      if (flag) {
        window.fillBlock(loadBlock, window.renderCandy, toFilterArr(index));
      } else {
        // window.fillBlock(loadBlock, window.renderCandy, window.candies);
      }
    });
  };

  window.setFilter = function (loadBlock) {
    for (var i = 0; i < filterCounts.length; i++) {
      setValue(i);
      toSwitchFilter(loadBlock, filterInputButtons[i].id, i);
    }
  };
})();
