'use strict';

(function () {

  var form = document.querySelector('.catalog__sidebar form');
  var formFields = Array.from(form.elements);
  var favorite = form.querySelector('#filter-favorite');
  var availability = form.querySelector('#filter-availability');
  var catalogBlock = document.querySelector('.catalog__cards');
  var filterItemCount = document.querySelectorAll('.input-btn__item-count');

  var limitPrice = {
    min: 0,
    max: 90
  }

  var filteredData = null;

  var filterCriteria = {
    kinds: [],
    nutritionFacts: {
      sugar: false,
      vegetarian: false,
      gluten: false
    }
  };
  var kindMap = {
    'мороженое': 'icecream',
    'газировка': 'soda',
    'жевательная резинка': 'gum',
    'мармелад': 'marmalade',
    'зефир': 'marshmallows'
  };

  document.addEventListener('loadData', function () { // Ловим готовность страницы чтобы получить исходные данные
    var dataCopy = window.data.get();
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
      filterItemCount[index].textContent = '(' + value.length + ')';
    };

    for (var i = 0; i < filterItemCount.length; i++) { // Присвоим каждому счетчику его значение
      setValue(i);
    }
  });

  function switchKind(target) {
    if (!filterCriteria.kinds.includes(target.value)) {
      filterCriteria.kinds.push(target.value);
    } else {
      var index = filterCriteria.kinds.indexOf(target.value);
      filterCriteria.kinds.splice(index, 1);
    }
  };

  function filterKind(item) {
    return filterCriteria.kinds.length ? filterCriteria.kinds.includes(kindMap[item.kind.toLowerCase()]) : true;
  };

  function filterNutrition(item, field) {
    var result = true;
    if (filterCriteria.nutritionFacts[field]) {
      result = field === 'sugar' || field === 'gluten' ? !item.nutritionFacts[field] : item.nutritionFacts[field];
    }
    return result;
  };

  function filterPrice(item) {
    return item.price >= limitPrice.min && item.price <= limitPrice.max;
  };

  function filterFavorite(item) {
    return favorite.checked ? item.isFavorite : true;
  };

  function filterAvailability(item) {
    return availability.checked ? item.amount > 0 : true;
  };

  function resetFilterCriteria(elem) {
    filterCriteria.kinds = [];
    filterCriteria.nutritionFacts.sugar = false;
    filterCriteria.nutritionFacts.gluten = false;
    filterCriteria.nutritionFacts.vegetarian = false;
    formFields.forEach(function (item) {
      if (elem !== item) {
        item.checked = false;
      }
    });
  };

  function resetFilter(target) {
    resetFilterCriteria(target);
    window.slider.reset();
  };

  var fillCatalogBlock = window.debounce(function(data) {
    catalogBlock.innerHTML = '';
    window.fillBlock(catalogBlock, window.renderCandy, data);
  });

  function sortPopularity(initData) {
    var data = initData.slice();
    fillCatalogBlock(data);
  };

  function sortFromCheapToExpensive(initData) {
    var data = initData.slice();
    data.sort(function (first, second) {
      if (first.price > second.price) {
        return 1;
      } else if (first.price < second.price) {
        return -1;
      } else {
        return 0;
      }
    });
    fillCatalogBlock(data);
  };

  function sortFromExpensiveToCheap(initData) {
    var data = initData.slice();
    data.sort(function (first, second) {
      if (first.price < second.price) {
        return 1;
      } else if (first.price > second.price) {
        return -1;
      } else {
        return 0;
      }
    });
    fillCatalogBlock(data);
  };

  function sortRating(initData) {
    var data = initData.slice();
    data.sort(function (first, second) {
      if (first.rating.value < second.rating.value) {
        return 1;
      } else if (first.rating.value > second.rating.value) {
        return -1;
      } else {
        return second.rating.number - first.rating.number;
      }
    });
    fillCatalogBlock(data);
  };
  var submitHandler = function (sbmtEvt) {
    sbmtEvt.preventDefault();
    resetFilter(sbmtEvt);
    fillCatalogBlock(window.data.get());
  };

  function filterHandler(event) {
    event.preventDefault();
    var target = event.target;
    var data = window.data.get();

    if (target === favorite) {
      resetFilter(target);
    }

    if (target === availability) {
      resetFilter(target);
    }

    if (target.name === 'food-type') {
      switchKind(target);
    }
    if (target.name === 'food-property') {
      filterCriteria.nutritionFacts[target.value] = target.checked;
    }
    filteredData = data.filter(function (item) {
      return filterKind(item) && filterNutrition(item, 'sugar') &&
        filterNutrition(item, 'vegetarian') && filterNutrition(item, 'gluten') &&
        filterPrice(item) && filterFavorite(item) && filterAvailability(item);
    });
    fillCatalogBlock(filteredData);
    if (target.value === 'popular') {
      sortPopularity(filteredData.slice());
    }
    if (target.value === 'expensive') {
      sortFromExpensiveToCheap(filteredData.slice());
    }
    if (target.value === 'cheap') {
      sortFromCheapToExpensive(filteredData.slice());
    }
    if (target.value === 'rating') {
      sortRating(filteredData.slice());
    }
    if (!filteredData.length) { // Ничто не подходит под фильтры
      var filterErrorTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
      var filterErrorBox = filterErrorTemplate.cloneNode(true);
      Object.assign(filterErrorBox.style, {
        'padding': '5px',
        'width': '500px',
        'color': 'white',
        'fontsize': '30px',
        'text-align': 'center',
        'position': "absolute",
        'left': '35%',
        'height': '150px',
        'background-color': '#6e58d9',
        'border': '3px solid #6e58a9'
      });
      catalogBlock.appendChild(filterErrorBox);
    }
  };
  form.addEventListener('change', filterHandler);
  form.addEventListener('submit', submitHandler);

  document.addEventListener('changePrice', function (event) {
    limitPrice = event.price;
    if (!favorite.checked && !availability.checked) {
      form.dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true
      }));
    }

  });
})();
