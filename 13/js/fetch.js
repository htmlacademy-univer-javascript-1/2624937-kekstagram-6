const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';


const getData = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/data`);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};


const sendData = async (body) => {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  return response.json();
};

export { getData, sendData };
