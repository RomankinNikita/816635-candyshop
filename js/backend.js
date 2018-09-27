// Модуль, который экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR:
'use strict';

(function () {
  // Обработчик успешного и неудачного запроса/отправки данных:
  var loadErrorListener = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s
  };

  // Функция получения данных с сервера:
  window.load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/candyshop/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    loadErrorListener(xhr, onLoad, onError);
    xhr.open('GET', URL);
    xhr.send();
  };
  // Функция для отправки данных на сервер:
  window.upload = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/candyshop';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    loadErrorListener(xhr, onLoad, onError);
    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
