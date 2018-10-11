'use strict';

(function () {
  var limitPrice = {
    MIN: 0,
    MAX: 90
  };
  var formFilter = document.querySelector('.catalog__sidebar form');
  var formFields = Array.from(formFilter.elements);
  var favoriteFilter = formFilter.querySelector('#filter-favorite');
  var availabilityFilter = formFilter.querySelector('#filter-availability');
  var catalogBlock = document.querySelector('.catalog__cards');
  var filterItemCount = document.querySelectorAll('.input-btn__item-count');
  var documentMain = document.querySelector('main');
  var filterPriceCount = formFilter.querySelector('.range__count');

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
      var values = toFilterForCounts(index);
      filterItemCount[index].textContent = '(' + values.length + ')';
    };

    for (var i = 0; i < filterItemCount.length; i++) { // Присвоим каждому счетчику его значение
      setValue(i);
    }

    var filterPriceGoods = dataCopy.filter(function (item) {
      return item.price >= limitPrice.MIN && item.price <= limitPrice.MAX;
    });
    var filterPriceCountValue = filterPriceGoods.length;
    filterPriceCount.textContent = '(' + filterPriceCountValue + ')';
  });

  var switchKind = function (target) {
    if (!filterCriteria.kinds.includes(target.value)) {
      filterCriteria.kinds.push(target.value);
    } else {
      var index = filterCriteria.kinds.indexOf(target.value);
      filterCriteria.kinds.splice(index, 1);
    }
  };

  var filterKind = function (item) {
    return filterCriteria.kinds.length ? filterCriteria.kinds.includes(kindMap[item.kind.toLowerCase()]) : true;
  };

  var filterNutrition = function (item, field) {
    var result = true;
    if (filterCriteria.nutritionFacts[field]) {
      result = field === 'sugar' || field === 'gluten' ? !item.nutritionFacts[field] : item.nutritionFacts[field];
    }
    return result;
  };

  var filterPrice = function (item) {
    return item.price >= limitPrice.MIN && item.price <= limitPrice.MAX;
  };

  var filterFavorite = function (item) {
    return favoriteFilter.checked ? item.isFavorite : true;
  };

  var filterAvailability = function (item) {
    return availabilityFilter.checked ? item.amount > 0 : true;
  };

  var resetFilterCriteria = function (elem) {
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

  var resetFilter = function (target) {
    resetFilterCriteria(target);
    window.slider.reset();
  };

  var fillCatalogBlock = window.debounce(function (data) {
    catalogBlock.innerHTML = '';
    window.fillBlock(catalogBlock, window.renderCandy, data);
  });

  var sortPopularity = function (initData) {
    var data = initData.slice();
    fillCatalogBlock(data);
  };

  var sortFromCheapToExpensive = function (initData) {
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

  var sortFromExpensiveToCheap = function (initData) {
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

  var sortRating = function (initData) {
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

  var renderEmptyFilterBlock = window.debounce(function () {
    var filterErrorTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
    var filterErrorBox = filterErrorTemplate.cloneNode(true);
    Object.assign(filterErrorBox.style, {
      'padding': '5px',
      'width': '500px',
      'color': 'white',
      'fontsize': '30px',
      'text-align': 'center',
      'position': 'fixed',
      'left': '40vw',
      'top': '30vh',
      'height': '150px',
      'background-color': '#6e58d9',
      'border': '3px solid #6e58a9'
    });
    document.querySelector('main').appendChild(filterErrorBox);
  });

  var submitHandler = function (sbmtEvt) {
    sbmtEvt.preventDefault();
    resetFilter(sbmtEvt);
    fillCatalogBlock(window.data.get());
    if (documentMain.lastElementChild.classList.contains('catalog__empty-filter')) {
      documentMain.lastElementChild.remove();
    }
  };

  var filterHandler = function (filterEvt) {
    filterEvt.preventDefault();
    var target = filterEvt.target;
    var data = window.data.get();

    if (documentMain.lastElementChild.classList.contains('catalog__empty-filter')) {
      documentMain.lastElementChild.remove();
    }

    if (target === favoriteFilter) {
      resetFilter(target);
    }

    if (target === availabilityFilter) {
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
      renderEmptyFilterBlock();
    }
  };
  formFilter.addEventListener('change', filterHandler);
  formFilter.addEventListener('submit', submitHandler);

  document.addEventListener('changePrice', function (priceEvt) {
    limitPrice = priceEvt.price;
    if (!favoriteFilter.checked && !availabilityFilter.checked) {
      formFilter.dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true
      }));
    }
  });
})();
