'use strict';

(function () {
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND_ERROR: 404
  };
  var XHR_TIMEOUT = 10000;
  // Обработчик успешного и неудачного запроса/отправки данных:
  var loadErrorListener = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.SUCCESS:
          onLoad(xhr.response);
          break;
        case Code.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case Code.UNAUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case Code.NOT_FOUND_ERROR:
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

    xhr.timeout = XHR_TIMEOUT; // 10s
  };

  // Функция получения данных с сервера:
  window.load = function (onLoad, onError) {
    var url = 'https://js.dump.academy/candyshop/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    loadErrorListener(xhr, onLoad, onError);
    xhr.open('GET', url);
    xhr.send();
  };
  // Функция для отправки данных на сервер:
  window.upload = function (data, onLoad, onError) {
    var url = 'https://js.dump.academy/candyshop';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    loadErrorListener(xhr, onLoad, onError);
    xhr.open('POST', url);
    xhr.send(data);
  };
})();
