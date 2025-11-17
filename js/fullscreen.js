const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const openBigPicture = (photoData) => {
  let commentsShown = 0;
  const COMMENTS_PER_PORTION = 5;
  const commentsList = bigPicture.querySelector('.social__comments');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  const commentCountBlock = bigPicture.querySelector('.social__comment-count');

  // Функция для отрисовки порции комментариев
  const renderCommentsPortion = () => {
    const commentsToShow = photoData.comments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);

    commentsToShow.forEach((comment) => {
      const commentElement = document.createElement('li');
      commentElement.classList.add('social__comment');
      commentElement.innerHTML = `
        <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
        <p class="social__text">${comment.message}</p>
      `;
      commentsList.appendChild(commentElement);
    });

    commentsShown += commentsToShow.length;

    // Обновляем счётчик
    commentCountBlock.innerHTML = `${commentsShown} из <span class="comments-count">${photoData.comments.length}</span> комментариев`;

    // Скрываем кнопку, если все комментарии показаны
    if (commentsShown >= photoData.comments.length) {
      commentsLoader.classList.add('hidden');
    }
  };

  // Заполняем данные
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.big-picture__img img').alt = photoData.description;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;

  // ПОКАЗЫВАЕМ блоки счётчика комментариев и загрузки
  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  // Очищаем список комментариев
  commentsList.innerHTML = '';

  // Рендерим первую порцию комментариев
  renderCommentsPortion();

  // Обработчик кнопки "Загрузить ещё"
  const onCommentsLoaderClick = () => {
    renderCommentsPortion();
  };

  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  // Показываем окно
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // Обработчик Esc
  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      // eslint-disable-next-line no-use-before-define
      closeBigPicture();
    }
  };

  document.addEventListener('keydown', onEscKeydown);

  // Функция закрытия
  const closeBigPicture = () => {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscKeydown);
    commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  };

  // Обработчик кнопки закрытия
  closeButton.addEventListener('click', closeBigPicture);
};

export { openBigPicture };
