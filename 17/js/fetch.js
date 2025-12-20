const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const load = (route, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}`, {
    method,
    body,
  });

const getData = () =>
  load(Route.GET_DATA)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные');
      }
      return response.json();
    });

const sendData = (body) =>
  load(Route.SEND_DATA, Method.POST, body)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось отправить данные');
      }
      return response.json();
    });

export { getData, sendData };
