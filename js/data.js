// модуль, который создаёт данные
'use strict';
(function () {
  // 1. Напишите функцию, для создания массива из 26 сгенерированных объектов:
  var CANDY_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

  var CANDY_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];

  var CANDY_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

  var generateArr = [];

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

  // Генерация произвольных значений:
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

  // Создание коллекции с карточками товаров:
  window.candies = getRandomData(CANDY_NAMES, CANDY_PICTURES, CANDY_CONTENTS, 3);
})();
