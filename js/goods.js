'use strict';

// 1. Напишите функцию, для создания массива из 26 сгенерированных объектов:
var CANDY_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var CANDY_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];

var CANDY_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var generateArr = [];

// Корзина покупок:
var basketCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var basket = document.querySelector('.goods__cards');
var basketEmpty = basket.querySelector('.goods__card-empty');
var basketTotal = document.querySelector('.goods__total');
var goodsTotal = document.querySelector('.goods__total-count');
var totalAmount = document.querySelector('.goods__price');
var basketHeaderAmount = document.querySelector('.main-header__basket');

var amount = 0;
var totalGoogs = 0;

// Вспомогательные функции:
var getRandomValue = function (param) {
  var result = Math.round(Math.random() * (param.length - 1));
  return result;
};
var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var isTrue = function () {
  return (Math.floor(Math.random() * 2) === 0);
};

var getRandomData = function (names, pictures, contents, n) {
  generateArr = [];
  for (var i = 0; i < n; i++) {
    var randomName = names[getRandomValue(names)];
    var randomPicture = 'img/cards/' + pictures[getRandomValue(pictures)];
    var randomAmount = getRandomInRange(0, 20);
    var randomPrice = getRandomInRange(100, 1500);
    var randomWeight = getRandomInRange(30, 300);
    var randomRatingValue = getRandomInRange(1, 5);
    var randomRatingNumber = getRandomInRange(10, 900);
    var randomSugar = isTrue();
    var randomEnergy = getRandomInRange(70, 500);
    var randomContents = contents[getRandomValue(contents)];
    for (var j = 0; j < getRandomInRange(0, contents.length - 1); j++) {
      randomContents += ', ' + contents[getRandomValue(contents)];
    }

    var generateObj = {
      name: randomName,
      picture: randomPicture,
      amount: randomAmount,
      price: randomPrice,
      weight: randomWeight,
      rating: {
        value: randomRatingValue,
        number: randomRatingNumber
      },
      nutritionFacts: {
        sugar: randomSugar,
        energy: randomEnergy,
        contents: randomContents
      },
    };

    generateArr.push(generateObj);
  }

  return generateArr;
};

var candies = getRandomData(CANDY_NAMES, CANDY_PICTURES, CANDY_CONTENTS, 3);

// 2. Уберите у блока catalog__cards класс catalog__cards--load и скройте, добавлением класса visually-hidden блок catalog__load:
var loadBlock = document.querySelector('.catalog__cards');

loadBlock.classList.remove('catalog__cards--load');
var loadText = document.querySelector('.catalog__load');
loadText.classList.add('visually-hidden');

// 2.1 На основе данных, созданных в предыдущем пункте и шаблона catalog__card, создайте DOM-элементы, соответствующие фотографиям и заполните их данными из массива:
var similarCandyTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

function changeBasketTotal(index, isIncrease) {
  if (isIncrease) {
    totalGoogs += candies[index].price;
  } else {
    var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
    totalGoogs -= candies[index].price * input.value;
  }
  basketHeaderAmount.textContent = 'В корзине ' + amount + ' товаров';
  goodsTotal.childNodes[0].textContent = 'Итого за ' + amount + ' товаров:';
  totalAmount.textContent = totalGoogs + ' ₽';
}

function removeFromBasket(index, template, candyAmount) {
  candies[index].isBasket = false;
  amount -= 1;
  changeBasketTotal(index, false);
  template.remove();
  candies[index].amount = candyAmount;
  if (basket.children.length === 1) {
    changeEmptyBasketVisibility(false);
    basketHeaderAmount.textContent = 'В корзине ничего нет';
  }
}

function changeInputValue(index, operation) {
  var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
  switch (operation) {
    case 'increase':
      if (candies[index].amount !== 0) {
        changeGoodsAmount(index, 'increment');
        totalGoogs += candies[index].price;
        totalAmount.textContent = totalGoogs + ' ₽';
        changeAmount(index, false);;
      }
      break;
    case 'decrease':
      if (input.value > 1) {
        changeGoodsAmount(index, 'decrement');
        totalGoogs -= candies[index].price;
        totalAmount.textContent = totalGoogs + ' ₽';
        changeAmount(index, true);;
      }
      break;
    default:
      break;
  }
}

function changeAmount(index, isIncrease) {
  if (isIncrease) {
    candies[index].amount += 1;
  } else {
    candies[index].amount -= 1;
  }
}

function changeEmptyBasketVisibility(isVisible) {
  if (isVisible) {
    basket.classList.remove('goods__cards--empty');
    basketEmpty.classList.add('visually-hidden');
    basketTotal.classList.remove('visually-hidden');
  } else {
    basket.classList.add('goods__cards--empty');
    basketEmpty.classList.remove('visually-hidden');
    basketTotal.classList.add('visually-hidden');
  }

}

function changeGoodsAmount(index, operation) {
  var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
  var value = parseInt(input.value);
  switch (operation) {
    case 'increment':
      value += 1;
      break;
    case 'decrement':
      value -= 1;
      break;
    default:
      break;
  }
  input.value = value;
}

function renderBasketGoods(index, template) {
  if (!candies[index].isBasket) {
    template.querySelector('.card-order__title').textContent = candies[index].name;
    template.querySelector('.card-order__img').src = candies[index].picture;
    template.querySelector('.card-order__price').textContent = candies[index].price + ' ₽';
    template.dataset.id = index;
    candies[index].isBasket = true;
    basket.appendChild(template);
    amount += 1;
  } else {
    changeGoodsAmount(index, 'increment')
  }
  changeAmount(index, false);
}
// ОБРАБОТЧИК ДОБАВЛЕНИЯ В КОРЗИНУ:
var btnAddToBasketHandler = function (event) {
  event.preventDefault();
  var template = basketCardTemplate.cloneNode(true);
  var index = event.target.closest('.catalog__card').id;
  var candyAmount = candies[index].amount;
  if (candies[index].amount !== 0) {
    renderBasketGoods(index, template);
    changeBasketTotal(index, true);

    if (basket.classList.contains('goods__cards--empty')) {
      changeEmptyBasketVisibility(true);
    }
    // Кнопки изменения input.value:
    // Кнопка уменьшения:
    var decreaseValueBtn = template.querySelector('.card-order__btn--decrease');
    decreaseValueBtn.addEventListener('click', function () {
      changeInputValue(index, 'decrease');
    });
    // Кнопка увеличения:
    var increaseValueBtn = template.querySelector('.card-order__btn--increase');
    increaseValueBtn.addEventListener('click', function () {
      changeInputValue(index, 'increase');
    });
    // Удалить из корзины:
    var deleteGoodsBtn = template.querySelector('.card-order__close');
    deleteGoodsBtn.addEventListener('click', function (event) {
      event.preventDefault();
      removeFromBasket(index, template, candyAmount);
    });
  }
};
// ОБРАБОТЧИК ДОБАВЛЕНИЯ В ИЗБРАННОЕ:
var btnFavoriteClickHandler = function (event) {
  event.preventDefault();
  var btnFav = event.target;
  btnFav.classList.toggle('card__btn-favorite--selected');
  btnFav.blur();
  var index = btnFav.closest('.catalog__card').id;
  candies[index].isFavorite = !candies[index].isFavorite;
}

var renderCandy = function (candy, id) {
  var candyElement = similarCandyTemplate.cloneNode(true);
  var cardTitle = candyElement.querySelector('.card__title');
  var candyImage = candyElement.querySelector('.card__img');
  var candyPrice = candyElement.querySelector('.card__price');
  var candyRating = candyElement.querySelector('.stars__rating');
  var candyRatingCount = candyElement.querySelector('.star__count');
  var candyCharacteristic = candyElement.querySelector('.card__characteristic');
  var candyComposition = candyElement.querySelector('.card__composition-list');
  var basketBtn = candyElement.querySelector('.card__btn');
  var cardBtnFav = candyElement.querySelector('.card__btn-favorite');

  candyElement.id = id;
  // в зависимости от количества amount добавьте следующий класс:
  if (candy.amount <= 5) {
    candyElement.classList.remove('card--in-stock');
    var amountClass = candy.amount === 0 ? 'card--soon' : 'card--little';
    candyElement.classList.add(amountClass);
  }
  // название вставьте в блок card__title:
  cardTitle.textContent = candy.name;
  // изменим картинку:
  candyImage.src = candy.picture;
  // содержимое блока card__price должно выглядеть следующим образом:{{price}} <span class="card__currency">₽</span><span class="card__weight">/ {{weight}} Г</span>:
  candyPrice.textContent = candy.price;
  var candyPriceSpanFirst = document.createElement('span');
  candyPriceSpanFirst.classList.add('card__currency');
  candyPriceSpanFirst.textContent = ' ₽';
  candyPrice.appendChild(candyPriceSpanFirst);
  var candyPriceSpanSecond = document.createElement('span');
  candyPriceSpanSecond.classList.add('card__weight');
  candyPriceSpanSecond.textContent = '/ ' + candy.weight + ' Г';
  candyPrice.appendChild(candyPriceSpanSecond);
  // класс блока stars__rating должен соответствовать рейтингу:
  if (candy.rating.value < 5) {
    candyRating.classList.remove('stars__rating--five');
    var ratingValue = ['one', 'two', 'three', 'four'];
    candyRating.classList.add('stars__rating--' + ratingValue[candy.rating.value - 1]);
  }
  // В блок star__count вставьте значение rating.number:
  candyRatingCount.textContent = '(' + candy.rating.number + ')';
  // Блок card__characteristic должен формироваться следующим образом:
  var isSugarText = candy.nutritionFacts.sugar ? 'Содержит сахар. ' : 'Без сахара. ';
  candyCharacteristic.textContent = isSugarText + candy.nutritionFacts.energy + ' ккал';
  candyComposition.textContent = '' + candy.nutritionFacts.contents + '.';
  // СОБЫТИЯ КНОПОК добавления в корзину и в избранное:
  // ДОБАВИТЬ В КОРЗИНУ:
  basketBtn.addEventListener('click', btnAddToBasketHandler);
  // ДОБАВИТЬ В ИЗБРАННОЕ:
  cardBtnFav.addEventListener('click', btnFavoriteClickHandler);

  return candyElement;
};

// ОТРИСОВКА сгенерированных DOM-элементов в блок .catalog__cards:
var fillBlock = function (block, createElement, data) {
  var fragment = document.createDocumentFragment();

  data.forEach(function (item, i) {
    fragment.appendChild(createElement(item, i));
  });
  block.appendChild(fragment);
};
fillBlock(loadBlock, renderCandy, candies);
// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ФОРМЕ ОФОРМЛЕНИЯ ЗАКАЗА:
var container = document.querySelector('.order');
container.addEventListener('click', function (event) {
  if (event.target.closest('.payment')) {
    toSwitchTab(container, '.payment__card', '.payment__cash', '-wrap');
  } else {
    toSwitchTab(container, '.deliver__store', '.deliver__courier', '');
  }
});
// СМЕНА ВКЛАДОК:
function toSwitchTab(block, openClass, closeClass, specialString) {
  if (event.target.id) {
    var openWindow = block.querySelector(openClass + specialString);
    var closeWindow = block.querySelector(closeClass + specialString);
    var currentWindow = block.querySelector('.' + event.target.id + specialString);
    currentWindow.classList.remove('visually-hidden');
    (currentWindow === openWindow) ? closeWindow.classList.add('visually-hidden'): openWindow.classList.add('visually-hidden');
  }
}

// ОБРАБАТЫВАЕМ ОТПУСКАНИЕ .range__btn в фильтре по цене:
var rangeFilter = document.querySelector('.range');
rangeFilter.addEventListener('mouseup', function (event) {
  if (event.target.classList.contains('range__btn--left')) {
    setPriceLimit('left', 'min', true);
  } else if (event.target.classList.contains('range__btn--right')) {
    setPriceLimit('right', 'max', false);
  }
});
// Изменение значения min и max цены в фильтре:
function setPriceLimit(style, limit, isMin) {
  var currentBtn = event.target;
  var style = window.getComputedStyle(currentBtn).getPropertyValue(style);
  var value = +style.slice(0, -2) * 100 / 245;
  var priceValue = null;
  isMin ? priceValue = value : priceValue = 100 - value;
  var rangePrice = document.querySelector('.range__price--' + limit);
  rangePrice.textContent = priceValue;
}
