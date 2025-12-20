const commentStep = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialCommentsList = bigPicture.querySelector('.social__comments');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoaderButton = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('#picture-cancel');

let currentComments = [];
let shownCommentsCount = 0;

let shownCommentsCountElement;
let totalCommentsCountElement;

const initCommentCounter = () => {
  if (!commentCountBlock.querySelector('.social__comment-shown-count')) {
    commentCountBlock.innerHTML = `
      <span class="social__comment-shown-count">0</span>
      из
      <span class="social__comment-total-count">0</span>
      комментариев
    `;
  }

  shownCommentsCountElement = commentCountBlock.querySelector('.social__comment-shown-count');
  totalCommentsCountElement = commentCountBlock.querySelector('.social__comment-total-count');
};

function closeBigPicture() {
  shownCommentsCount = 0;
  currentComments = [];
  socialCommentsList.innerHTML = '';

  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
}

closeButton.addEventListener('click', closeBigPicture);

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35"
      height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

const updateCommentsCounter = () => {
  shownCommentsCountElement.textContent = shownCommentsCount;
  totalCommentsCountElement.textContent = currentComments.length;

  if (shownCommentsCount >= currentComments.length) {
    commentsLoaderButton.classList.add('hidden');
  } else {
    commentsLoaderButton.classList.remove('hidden');
  }
};

const renderNextComments = () => {
  const fragment = document.createDocumentFragment();

  const nextCount = Math.min(
    shownCommentsCount + commentStep,
    currentComments.length
  );

  currentComments
    .slice(shownCommentsCount, nextCount)
    .forEach((comment) => {
      fragment.appendChild(createCommentElement(comment));
    });

  socialCommentsList.appendChild(fragment);
  shownCommentsCount = nextCount;

  updateCommentsCounter();
};

commentsLoaderButton.addEventListener('click', renderNextComments);

const openBigPicture = (photoData) => {
  currentComments = photoData.comments;
  shownCommentsCount = 0;

  socialCommentsList.innerHTML = '';

  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = currentComments.length;
  socialCaption.textContent = photoData.description;

  initCommentCounter();

  shownCommentsCountElement.textContent = 0;
  totalCommentsCountElement.textContent = currentComments.length;

  commentsLoaderButton.classList.remove('hidden');

  renderNextComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

export { openBigPicture, closeBigPicture };
