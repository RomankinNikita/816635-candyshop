'use strict';

(function () {

  var form = document.querySelector('.catalog__sidebar form');
  var inputBtnCounts = form.querySelectorAll('.input-btn__item-count');
  var documentBody = document.querySelector('body');
  var startArr;
  var resultArr;
  var dataCopy;
  var property;
  var filterMap = {
    kind: {
      'icecream': {
        value: 'Мороженое',
        isOn: false
      },
      'soda': {
        value: 'Газировка',
        isOn: false
      },
      'gum': {
        value: 'Жевательная резинка',
        isOn: false
      },
      'marmalade': {
        value: 'Мармелад',
        isOn: false
      },
      'marshmallows': {
        value: 'Зефир',
        isOn: false
      }
    },
    nutritionFacts: {
      'sugar': {
        value: false,
        isOn: false
      },
      'vegetarian': {
        value: true,
        isOn: false
      },
      'gluten': {
        value: false,
        isOn: false
      },
    }
  };

  function toSwitchProperty(eTarName, propFirst, propSecond, value) { // Учитывает input.ckecked
    if (event.target.name === eTarName) {
      filterMap[propFirst][propSecond].isOn = value;
    }
  };

  function toFilterArr(propOne, propTwo, value, isSingle) { // Фильтрует массив
    resultArr = startArr.filter(function (item) {
      if (filterMap[propOne][propTwo].isOn) {
        return (isSingle) ? item[propOne] === value : item[propOne][propTwo] === value;
      }
      return item;
    });
    startArr = resultArr;
    return startArr;
  };

  document.addEventListener('loadData', function () { // Ловим готовность страницы
    dataCopy = window.candies.slice();
    var toFilterForCounts = function (ind) {
      var filtered = dataCopy.filter(function (elem) {
        var conditions = [(elem.kind === 'Мороженое'), (elem.kind === 'Газировка'), (elem.kind === 'Жевательная резинка'), (elem.kind === 'Мармелад'), (elem.kind === 'Зефир'), (elem.nutritionFacts.sugar === false), (elem.nutritionFacts.vegetarian === true), (elem.nutritionFacts.gluten === false), (elem.isFavorite === true), (elem.amount > 0)];
        var condition = conditions[ind];
        return condition;
      });
      return filtered;
    };
    var setValue = function (index) { // Запишем значение счетчика товара в фильтре
      var value = toFilterForCounts(index);
      inputBtnCounts[index].textContent = '(' + value.length + ')';
    };

    for (var i = 0; i < inputBtnCounts.length; i++) {
      setValue(i);
    }
  });

  form.addEventListener('change', function (event) { // Слушаем изменения в форме фильтра
    event.preventDefault();
    property = event.target.value;
console.log('jhjhj');

    if (event.target.checked) { // if checked enable
      toSwitchProperty('food-type', 'kind', property, true);
      toSwitchProperty('food-property', 'nutritionFacts', property, true);
    } else { // if !checked disable
      toSwitchProperty('food-type', 'kind', property, false);
      toSwitchProperty('food-property', 'nutritionFacts', property, false);
    }

    startArr = dataCopy;
    toFilterArr('kind', 'icecream', 'Мороженое', true);
    toFilterArr('kind', 'soda', 'Газировка', true);
    toFilterArr('kind', 'gum', 'Жевательная резинка', true);
    toFilterArr('kind', 'marmalade', 'Мармелад', true);
    toFilterArr('kind', 'marshmallows', 'Зефир', true);
    toFilterArr('nutritionFacts', 'sugar', false, false);
    toFilterArr('nutritionFacts', 'vegetarian', true, false);
    toFilterArr('nutritionFacts', 'gluten', false, false);
    if (event.target.value === 'availability') { // Фильтр 'в наличии'
      if (event.target.checked === false) {
        for (var i = 0; i < form.elements.length; i++) {
          form.elements[i].checked = false;
          console.log(form.elements[i].checked);
        }
        event.target.checked = true;
        startArr = dataCopy;
        resultArr = startArr.filter(function (item) {
          return item.amount > 0;
        });
        startArr = resultArr;
      } else {
        event.target.checked = false;
        startArr = dataCopy;
      }
    }
    if (!startArr.length) { // Ничто не подходит под фильтры
      var filterErrorTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
      var filterErrorBox = filterErrorTemplate.cloneNode(true);
      Object.assign(filterErrorBox.style,{'padding':'5px','width':'500px','color':'white','fontsize':'30px','text-align':'center','position':"absolute",'left':'35%','height':'150px','background-color':'#6e58d9','border':'3px solid #6e58a9'});
      window.loadBlock.before(filterErrorBox);
      var filterErrorHandler = function (evt) {
        evt.preventDefault();
        filterErrorBox.remove();
        document.removeEventListener('click', filterErrorHandler);
        startArr = dataCopy;
        window.fillBlock(window.loadBlock, window.renderCandy, startArr);
      };
      document.addEventListener('click', filterErrorHandler);
    }
    console.log(startArr);
    while (window.loadBlock.firstChild) { // Clean loadBlock
      window.loadBlock.removeChild(loadBlock.firstChild);
    }
    window.fillBlock(window.loadBlock, window.renderCandy, startArr);
  });
})();
