'use strict';

// 1. Напишите функцию, для создания массива из 26 сгенерированных объектов:
var CANDY_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var CANDY_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];

var CANDY_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var generateArr = [];

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
      }
    };

    generateArr.push(generateObj);
  }

  return generateArr;
};

var candies = getRandomData(CANDY_NAMES, CANDY_PICTURES, CANDY_CONTENTS, 26);

// 2. Уберите у блока catalog__cards класс catalog__cards--load и скройте, добавлением класса visually-hidden блок catalog__load:
var loadBlock = document.querySelector('.catalog__cards');
loadBlock.classList.remove('catalog__cards--load');
var loadText = document.querySelector('.catalog__load');
loadText.classList.add('visually-hidden');

// 2.1 На основе данных, созданных в предыдущем пункте и шаблона catalog__card, создайте DOM-элементы, соответствующие фотографиям и заполните их данными из массива:
var similarCandyTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

var renderCandy = function (candy) {
  var candyElement = similarCandyTemplate.cloneNode(true);
  var cardTitle = candyElement.querySelector('.card__title');
  var candyImage = candyElement.querySelector('.card__img');
  var candyPrice = candyElement.querySelector('.card__price');
  var candyRating = candyElement.querySelector('.stars__rating');
  var candyRatingCount = candyElement.querySelector('.star__count');
  var candyCharacteristic = candyElement.querySelector('.card__characteristic');
  var candyComposition = candyElement.querySelector('.card__composition-list');

  //в зависимости от количества amount добавьте следующий класс:
  if (candy.amount <= 5) {
    candyElement.classList.remove('card--in-stock');
    if (candy.amount == 0) {
      candyElement.classList.add('card--soon');
    } else {
      candyElement.classList.add('card--little');
    }
  }

  //название вставьте в блок card__title:
  cardTitle.textContent = candy.name;

  //изменим картинку:
  candyImage.src = candy.picture;

  //содержимое блока card__price должно выглядеть следующим образом:{{price}} <span class="card__currency">₽</span><span class="card__weight">/ {{weight}} Г</span>:
  candyPrice.innerHTML = '' + candy.price + ' <span class="card__currency">₽</span><span class="card__weight">/ ' + candy.weight + ' Г</span>';

  //класс блока stars__rating должен соответствовать рейтингу:
  if (candy.rating.value < 5) {
    candyRating.classList.remove('stars__rating--five');
    if (candy.rating.value == 1) {
      candyRating.classList.add('stars__rating--one');
    } else if (candy.rating.value == 2) {
      candyRating.classList.add('stars__rating--two');
    } else if (candy.rating.value == 3) {
      candyRating.classList.add('stars__rating--three');
    } else {
      candyRating.classList.add('stars__rating--four');
    }
  }

  //В блок star__count вставьте значение rating.number:
  candyRatingCount.textContent = '(' + candy.rating.number + ')';

  //Блок card__characteristic должен формироваться следующим образом:
  if (candy.nutritionFacts.sugar) {
    candyCharacteristic.textContent = 'Содержит сахар. ' + candy.nutritionFacts.energy + ' ккал';
  } else {
    candyCharacteristic.textContent = 'Без сахара. ' + candy.nutritionFacts.energy + ' ккал';
  }

  candyComposition.textContent = '' + candy.nutritionFacts.contents + '.';

  return candyElement;
};

// 2.2 Отрисуем сгенерированные DOM-элементы в блок .catalog__cards:
var fillBlock = function (block, createElement, data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createElement(data[i]));
  }

  block.appendChild(fragment);
};

fillBlock(loadBlock, renderCandy, candies);

//По аналогии с исходным массивом данных создайте ещё один массив, состоящий из трёх элементов. Это будет массив объектов, который соответствует товарам, добавленным в корзину:
var goods = getRandomData(CANDY_NAMES, CANDY_PICTURES, CANDY_CONTENTS, 3);

//На основе шаблона goods_card создайте DOM-элементы товаров, добавленных в корзину. Заполните их данными из исходного массива и отрисуйте эти элементы в блок goods__cards:
var similarGoodsTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

var renderGoods = function (product) {
  var goodsElement = similarGoodsTemplate.cloneNode(true);
  var goodsTitle = goodsElement.querySelector('.card-order__title');
  var goodsImage = goodsElement.querySelector('.card-order__img');
  var goodsPrice = goodsElement.querySelector('.card-order__price');

  goodsTitle.textContent = product.name;
  goodsImage.src = product.picture;
  goodsPrice.textContent = '' + product.price + ' ₽';

  return goodsElement;
};

var goodsBlock = document.querySelector('.goods__cards');

fillBlock(goodsBlock, renderGoods, goods);

//Удалите у блока goods__cards класс goods__cards--empty и скройте при этом блок goods__card-empty:
goodsBlock.classList.remove('goods__cards--empty');

var goodsCard = document.querySelector('.goods__card-empty');

goodsCard.classList.add('visually-hidden');
