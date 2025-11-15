const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const openBigPicture = (photoData) => {
  // Заполняем данные
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;

  // Скрываем элементы
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  // Добавляем комментарии
  const commentsList = bigPicture.querySelector('.social__comments');
  commentsList.innerHTML = '';

  photoData.comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');
    commentElement.innerHTML = `
      <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
      <p class="social__text">${comment.message}</p>
    `;
    commentsList.appendChild(commentElement);
  });

  // Показываем окно
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // Обработчик Esc
  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      bigPicture.classList.add('hidden');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onEscKeydown);
    }
  };

  document.addEventListener('keydown', onEscKeydown);
};

// Обработчик кнопки закрытия
closeButton.addEventListener('click', () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

export { openBigPicture };
