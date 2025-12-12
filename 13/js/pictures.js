import { getData } from './fetch.js';
import { openBigPicture } from './fullscreen.js';

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

const showErrorMessage = (message) => {
  const errorBlock = document.createElement('div');
  errorBlock.textContent = message;

  errorBlock.style.position = 'fixed';
  errorBlock.style.top = '20px';
  errorBlock.style.left = '50%';
  errorBlock.style.transform = 'translateX(-50%)';
  errorBlock.style.padding = '15px 25px';
  errorBlock.style.zIndex = '1000';
  errorBlock.style.backgroundColor = 'red';
  errorBlock.style.color = 'white';
  errorBlock.style.fontSize = '18px';
  errorBlock.style.borderRadius = '8px';
  errorBlock.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';

  document.body.append(errorBlock);

  setTimeout(() => {
    errorBlock.remove();
  }, 4000);
};

const renderThumbnails = async () => {
  try {
    const photos = await getData();
    const fragment = document.createDocumentFragment();

    photos.forEach((photo) => {
      fragment.appendChild(createThumbnail(photo));
    });

    picturesContainer.appendChild(fragment);

  } catch (error) {
    showErrorMessage(`Ошибка загрузки данных: ${error.message}`);
  }
};

export { renderThumbnails };
