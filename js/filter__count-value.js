'use strict';

(function () {

  var form = document.querySelector('.catalog__sidebar form');
  var startArr;
  var resultArr;
  var dataCopy;
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
      'sugar-free': {
        value: false,
        isOn: false
      },
      'vegetarian': {
        value: true,
        isOn: false
      },
      'gluten-free': {
        value: false,
        isOn: false
      },
    }
  };

  document.addEventListener('loadData', function () {
    dataCopy = window.candies.slice();
  });

  form.addEventListener('change', function (event) {
    event.preventDefault();
    var property = event.target.value;

    if (event.target.checked) { // if checked enable
      if (event.target.name === 'food-type') {
        filterMap.kind[property].isOn = true;
      }
      if (event.target.name === 'food-property') {
        filterMap.nutritionFacts[property].isOn = true;
      }
    } else { // if !checked disable
      if (event.target.name === 'food-type') {
        filterMap.kind[property].isOn = false;
      }
      if (event.target.name === 'food-property') {
        filterMap.nutritionFacts[property].isOn = false;
      }
    }

    startArr = dataCopy;
    // icecream
    resultArr = startArr.filter(function (item) {
      if (filterMap.kind.icecream.isOn) {
        return item.kind === 'Мороженое';
      }
      return item;
    });
    startArr = resultArr;
    // soda
    resultArr = startArr.filter(function (item) {
      if (filterMap.kind.soda.isOn) {
        return item.kind === 'Газировка';
      }
      return item;
    });
    startArr = resultArr;
    // sugar
    resultArr = startArr.filter(function (item) {
      if (filterMap.nutritionFacts['sugar-free'].isOn) {
        return item.nutritionFacts.sugar === false;
      }
      return item;
    });
    startArr = resultArr;
    // vegetarian
    resultArr = startArr.filter(function (item) {
      if (filterMap.nutritionFacts['vegetarian'].isOn) {
        return item.nutritionFacts.vegetarian === false;
      }
      return item;
    });
    startArr = resultArr;
    // gluten
    resultArr = startArr.filter(function (item) {
      if (filterMap.nutritionFacts['gluten-free'].isOn) {
        return item.nutritionFacts.gluten === false;
      }
      return item;
    });
    startArr = resultArr;
    console.log(startArr);

  });































  // var form = document.querySelector('.catalog__sidebar form');
  // var foodTypeInputs = form.elements[name = "food-type"]; // form.inputs.name=food


  // var kindMap = { // Объект с критериями фильтрации
  //   kind: {
  //     'icecream': 'Мороженое',
  //     'soda': 'Газировка',
  //     'gum': 'Жевательная резинка',
  //     'marmalade': 'Мармелад',
  //     'marshmallows': 'Зефир'
  //   },
  //   nutritionFacts: {
  //     'sugar': false,
  //     'vegetarian': true,
  //     'gluten': false
  //   },
  // };

  // document.addEventListener('loadData', function () {
  //   var dataCopy = window.candies.slice();

  //   function filterArr(inputValue, property, value) { // Фильтрует по указанному критерию
  //     var arr = dataCopy.filter(function (elem) {
  //       if (inputValue === 'food-type') {
  //         return elem['' + property] === value;
  //       }
  //       if (inputValue === 'food-property') {
  //         return elem['' + Object.keys(kindMap)[1]]['' + property] === value;
  //       }
  //       return elem['amount'] > 0;
  //     });
  //     return arr;
  //   };
  //   var filteredArrs = { // Объект с результатами фильтрации по каждому варианту
  //     'filteredIcecream': filterArr('food-type', Object.keys(kindMap)[0], kindMap.kind.icecream),
  //     'filteredSoda': filterArr('food-type', Object.keys(kindMap)[0], kindMap.kind.soda),
  //     'filteredGum': filterArr('food-type', Object.keys(kindMap)[0], kindMap.kind.gum),
  //     'filteredMarmalade': filterArr('food-type', Object.keys(kindMap)[0], kindMap.kind.marmalade),
  //     'filteredMarshmallows': filterArr('food-type', Object.keys(kindMap)[0], kindMap.kind.marshmallows),
  //     'filteredSugar': filterArr('food-property', Object.keys(kindMap['nutritionFacts'])[0], kindMap.nutritionFacts.sugar),
  //     'filteredVegetarian': filterArr('food-property', Object.keys(kindMap['nutritionFacts'])[1], kindMap.nutritionFacts.vegetarian),
  //     'filteredGluten': filterArr('food-property', Object.keys(kindMap['nutritionFacts'])[2], kindMap.nutritionFacts.gluten),
  //     'filteredAmount': filterArr()
  //   };
  //   console.log(filteredArrs['filteredIcecream']);
  //   console.log(filteredArrs['filteredSoda']);
  //   console.log(filteredArrs['filteredGum']);
  //   console.log(filteredArrs['filteredMarmalade']);
  //   console.log(filteredArrs['filteredMarshmallows']);
  //   console.log(filteredArrs['filteredSugar']);
  //   console.log(filteredArrs['filteredVegetarian']);
  //   console.log(filteredArrs['filteredGluten']);
  //   console.log(filteredArrs['filteredAmount']);

  // });
  ///////////////
  // for (var i = 0; i < array.length; i++) { // Присвоение значений счетчикам товаров

  // }



  // function toFilterData(property) { // kind = property
  //     var newData = dataCopy.filter(function (elem) {
  //       return event.target.value === kindMap[property][elem[property].toLowerCase()];
  //     });
  //     console.log(newData);
  //     return newData;
  // };


  // form.addEventListener('change', function (event) {
  //   event.preventDefault();

  //   toFilterData('kind');

  // });


  // dataCopy.filter(function () {
  //   return filterFunc(param1) && filterFunc(param2) && filterFunc(param3)....;
  // });























  // var form = document.querySelector('.catalog__sidebar form');
  // var filterCounts = document.querySelectorAll('.input-btn__item-count'); // выберем все счетчики товаров в фильтрах
  // var filterInputButtons = document.querySelectorAll('.input-btn__input--checkbox'); // Все инпуты фильтров
  // //////

  // var kindMap = {
  //   'мороженое': 'icecream',
  //   'газировка': 'soda',
  //   'жевательная резинка': 'gum',
  //   'мармелад': 'marmalade',
  //   'зефир': 'marshmallows',
  // }
  // var property = {
  //   'sugar' : false,
  //   'vegetarian' : false,
  //   'gluten-free': false
  // }

  // function filterKinds(kinds) {
  //   var filteredCandy = [];
  //   newData.forEach(function(item) {
  //     if(kinds.includes(kindMap[item.kind.toLowerCase()])) {
  //       filteredCandy.push(item);
  //     }
  //   });
  //   return filteredCandy;
  // };
  // document.addEventListener('loadData', function() {
  //     newData = window.candies.slice();
  //   });
  // form.addEventListener('change', function(event) {
  //   event.preventDefault();
  //   filterKinds()
  // });
  // var kinds = [];
  // function switchKind(value) {
  //   kinds.includes(value) ? kinds.splice(kinds.indexOf(value), 1) : kinds.push(value);
  // }
  // document.addEventListener('loadData', function() {
  //   newData = window.candies.slice();
  // });
  // var newData = [];
  // form.addEventListener('change', function(event) {
  //   event.preventDefault();
  //   console.log(event.target.value);
  //   if(event.target.name === 'food-type') {
  //     switchKind(event.target.value);
  //     newData = filterKinds(kinds);
  //   }
  //   console.log(kinds)
  //   if(event.target.name === 'food-property') {
  //     property[event.target.value] = event.target.value === 'sugar' ? !event.target.checked : event.target.checked;
  //     console.log(property)
  //     newData = newData.filter(function(item) {
  //       return item.nutritionFacts[event.target.value] === property[event.target.value];
  //     });

  //   }
  //   console.log(newData);
  // });
})();
