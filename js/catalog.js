// Модуль работы с карточками товаров и корзиной покупок:
'use strict';

(function () {
  var basketCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var basket = document.querySelector('.goods__cards');
  var basketEmpty = basket.querySelector('.goods__card-empty');
  var basketTotal = document.querySelector('.goods__total');
  var goodsTotal = document.querySelector('.goods__total-count');
  var totalAmount = document.querySelector('.goods__price');
  var basketHeaderAmount = document.querySelector('.main-header__basket');
  var orderForm = document.querySelector('#order-form');
  var orderFormElements = orderForm.querySelectorAll('input');
  var favoriteCount = document.querySelector('#favorite-count');
  var favoriteCountValue = 0;
  var filterForm = document.querySelector('#filter-form');
  var favoriteBtn = filterForm.querySelector('#filter-favorite');

  var eventChange = new Event('change', {bubbles: true, cancelable: true});

  var amount = 0;
  var totalGoods = 0;

  // 2.1 На основе данных, созданных в предыдущем пункте и шаблона catalog__card, создайте DOM-элементы, соответствующие фотографиям и заполните их данными из массива:
  var similarCandyTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

  document.addEventListener('loadData', function () {
    var candies = window.data.get();

    var toDisableFormElements = function () {
      for (var i = 0; i < orderFormElements.length; i++) {
        orderFormElements[i].disabled = true;
      }
    };
    toDisableFormElements();

    var toEnableFormElements = function () {
      for (var i = 0; i < orderFormElements.length; i++) {
        orderFormElements[i].disabled = false;

        if (orderFormElements[i].closest('.payment__card') && orderFormElements[i].closest('.payment__card').classList.contains('visually-hidden')) {
          orderFormElements[i].disabled = true;
        }
        if (orderFormElements[i].closest('.payment__cash') && orderFormElements[i].closest('.payment__cash').classList.contains('visually-hidden')) {
          orderFormElements[i].disabled = true;
        }
        if (orderFormElements[i].closest('.deliver__store') && orderFormElements[i].closest('.deliver__store').classList.contains('visually-hidden')) {
          orderFormElements[i].disabled = true;
        }
        if (orderFormElements[i].closest('.deliver__courier') && orderFormElements[i].closest('.deliver__courier').classList.contains('visually-hidden')) {
          orderFormElements[i].disabled = true;
        }
      }
    };

    var setGoodsCount = function () {
      basketHeaderAmount.textContent = 'В корзине ' + amount + ' товаров';
      goodsTotal.childNodes[0].textContent = 'Итого за ' + amount + ' товаров:';
    };

    var changeBasketTotal = function (index, isIncrease) {
      if (isIncrease) {
        totalGoods += candies[index].price;
      } else {
        var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
        totalGoods -= candies[index].price * input.value;
      }
      setGoodsCount();
      totalAmount.textContent = totalGoods + ' ₽';
    };

    var removeFromBasket = function (index, template, candyAmount) {
      var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
      candies[index].isBasket = false;
      amount -= input.value;
      changeBasketTotal(index, false);
      template.remove();
      candies[index].amount = candyAmount;
      if (basket.children.length === 1) {
        changeEmptyBasketVisibility(false);
        basketHeaderAmount.textContent = 'В корзине ничего нет';
        toDisableFormElements();
      }
    };

    var changeInputValue = function (index, operation) {
      var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
      switch (operation) {
        case 'increase':
          if (candies[index].amount !== 0) {
            changeGoodsAmount(index, 'increment');
            totalGoods += candies[index].price;
            totalAmount.textContent = totalGoods + ' ₽';
            changeAmount(index, false);
          }
          break;
        case 'decrease':
          if (input.value > 1) {
            changeGoodsAmount(index, 'decrement');
            totalGoods -= candies[index].price;
            totalAmount.textContent = totalGoods + ' ₽';
            changeAmount(index, true);
          }
          break;
        default:
          break;
      }
    };

    var changeAmount = function (index, isIncrease) {
      if (isIncrease) {
        candies[index].amount += 1;
      } else {
        candies[index].amount -= 1;
      }
    };

    var changeEmptyBasketVisibility = function (isVisible) {
      if (isVisible) {
        basket.classList.remove('goods__cards--empty');
        basketEmpty.classList.add('visually-hidden');
        basketTotal.classList.remove('visually-hidden');
      } else {
        basket.classList.add('goods__cards--empty');
        basketEmpty.classList.remove('visually-hidden');
        basketTotal.classList.add('visually-hidden');
      }
    };

    var changeGoodsAmount = function (index, operation) {
      var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
      var value = parseInt(input.value, 10);
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
    };

    var renderBasketGoods = function (index, template) {
      if (!candies[index].isBasket) {
        template.querySelector('.card-order__title').textContent = candies[index].name;
        template.querySelector('.card-order__img').src = 'img/cards/' + candies[index].picture;
        template.querySelector('.card-order__price').textContent = candies[index].price + ' ₽';
        template.dataset.id = index;
        candies[index].isBasket = true;
        basket.appendChild(template);
      } else {
        changeGoodsAmount(index, 'increment');
      }
      changeAmount(index, false);
    };

    var setFavoriteCountValue = function (isFav) {
      favoriteCountValue = isFav ? favoriteCountValue + 1 : favoriteCountValue - 1;
      favoriteCount.textContent = '(' + favoriteCountValue + ')';
    };

    // ОБРАБОТЧИК ДОБАВЛЕНИЯ В КОРЗИНУ:
    var btnAddToBasketHandler = function (addEvt) {
      addEvt.preventDefault();
      var template = basketCardTemplate.cloneNode(true);
      var index = addEvt.target.closest('.catalog__card').id;
      var candyAmount = candies[index].amount;
      var cardOrderCount = template.querySelector('.card-order__count');
      cardOrderCount.readOnly = true;
      if (candies[index].amount !== 0) {
        toEnableFormElements();
        renderBasketGoods(index, template);
        var input = basket.querySelector('[data-id="' + index + '"]').querySelector('.card-order__count');
        amount += 1;
        changeBasketTotal(index, true);

        if (basket.classList.contains('goods__cards--empty')) {
          changeEmptyBasketVisibility(true);
        }
        // Кнопки изменения input.value:
        // Кнопка уменьшения:
        var decreaseValueBtn = template.querySelector('.card-order__btn--decrease');
        decreaseValueBtn.addEventListener('click', function () {
          if (input.value === '1') {
            removeFromBasket(index, template, candyAmount);
          } else {
            amount -= 1;
            setGoodsCount();
            changeInputValue(index, 'decrease');
          }
        });

        // Кнопка увеличения:
        var increaseValueBtn = template.querySelector('.card-order__btn--increase');
        increaseValueBtn.addEventListener('click', function () {
          if (candies[index].amount !== 0) {
            amount += 1;
            setGoodsCount();
          }
          changeInputValue(index, 'increase');
        });

        // Удалить из корзины:
        var deleteGoodsBtn = template.querySelector('.card-order__close');
        deleteGoodsBtn.addEventListener('click', function (evt) {
          evt.preventDefault();
          removeFromBasket(index, template, candyAmount);
        });

        // Очистка корзины от товаров в случае успешной отправки формы заказа:
        var resetBasketHandler = function (evt) {
          evt.preventDefault();
          var valid = window.validValue.get();
          if (valid) {
            removeFromBasket(index, template, candyAmount);
            orderForm.removeEventListener('submit', resetBasketHandler);
          }
        };
        orderForm.addEventListener('submit', resetBasketHandler);
      }
    };

    // ОБРАБОТЧИК ДОБАВЛЕНИЯ В ИЗБРАННОЕ:
    var btnFavoriteClickHandler = function (evt, candy) {
      evt.preventDefault();
      var btnFav = evt.target;
      btnFav.classList.toggle('card__btn-favorite--selected');
      btnFav.blur();
      candy.isFavorite = !candy.isFavorite;
      setFavoriteCountValue(!!candy.isFavorite);
      if (favoriteBtn.checked) {
        filterForm.dispatchEvent(eventChange);
      }
    };

    // ФУНКЦИЯ ГЕНЕРАЦИИ КАРТОЧКИ ТОВАРА:
    window.renderCandy = function (candy, id) {
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

      if (candy.isFavorite) {
        cardBtnFav.classList.add('card__btn-favorite--selected');
      }

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
      candyImage.src = 'img/cards/' + candy.picture;
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
      cardBtnFav.addEventListener('click', function (favEvt) {
        btnFavoriteClickHandler(favEvt, candy);
      });

      return candyElement;
    };
  });
})();
