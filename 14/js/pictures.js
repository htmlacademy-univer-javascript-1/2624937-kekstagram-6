import { getData } from './fetch.js';
import { openBigPicture } from './fullscreen.js';
import { initFilters } from './filters.js';

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

const createThumbnail = (photo) => {
  const thumbnail = pictureTemplate.cloneNode(true);

  const image = thumbnail.querySelector('.picture__img');
  image.src = photo.url;
  image.alt = photo.description;

  thumbnail.querySelector('.picture__likes').textContent = photo.likes;
  thumbnail.querySelector('.picture__comments').textContent = photo.comments.length;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo);
  });

  return thumbnail;
};

const clearThumbnails = () => {
  picturesContainer.querySelectorAll('.picture').forEach((el) => el.remove());
};

const renderThumbnails = (photos) => {
  clearThumbnails();
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createThumbnail(photo));
  });

  picturesContainer.appendChild(fragment);
};

const showErrorMessage = (message) => {
  const errorBlock = document.createElement('div');
  errorBlock.textContent = message;
  errorBlock.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    z-index: 1000;
    background-color: red;
    color: white;
    font-size: 18px;
    border-radius: 8px;
  `;
  document.body.append(errorBlock);
  setTimeout(() => errorBlock.remove(), 4000);
};

const loadPictures = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initFilters(photos, renderThumbnails);
  } catch (error) {
    showErrorMessage(`Ошибка загрузки данных: ${error.message}`);
  }
};

export { loadPictures, renderThumbnails };
