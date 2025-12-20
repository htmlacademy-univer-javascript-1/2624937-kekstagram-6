import { initScale } from './scale.js';
import { initEffects } from './effect.js';
import { sendData } from './fetch.js';

const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_COMMENT_LENGTH = 140;

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const body = document.body;

const previewImage = uploadForm.querySelector('.img-upload__preview img');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const submitButton = uploadForm.querySelector('.img-upload__submit');
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');


let resetScale;
let resetEffects;


function isTextFieldFocused() {
  return (
    document.activeElement === hashtagInput ||
    document.activeElement === commentInput
  );
}


const normalizeHashtags = (value) => value.trim().toLowerCase().split(/\s+/).filter(Boolean);

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

pristine.addValidator(
  hashtagInput,
  (value) => (
    value.length === 0 ||
      normalizeHashtags(value).every((tag) => VALID_HASHTAG_REGEX.test(tag))
  ),
  'Хэш-тег должен начинаться с #, содержать буквы/цифры и быть до 20 символов'
);

pristine.addValidator(
  hashtagInput,
  (value) => normalizeHashtags(value).length <= MAX_HASHTAG_COUNT,
  `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`
);

pristine.addValidator(
  hashtagInput,
  (value) => {
    const tags = normalizeHashtags(value);
    return new Set(tags).size === tags.length;
  },
  'Хэш-теги не должны повторяться'
);

pristine.addValidator(
  commentInput,
  (value) => value.length <= MAX_COMMENT_LENGTH,
  `Комментарий до ${MAX_COMMENT_LENGTH} символов`
);


const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    if (document.querySelector('.error')) {
      return;
    }

    if (!isTextFieldFocused()) {
      closeUploadForm();
      resetForm();
    }
  }
};


const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  pristine.reset();
};

function closeUploadForm() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

function resetForm() {
  uploadForm.reset();
  uploadFileInput.value = '';
  pristine.reset();

  if (typeof resetScale === 'function') {
    resetScale();
  }

  if (typeof resetEffects === 'function') {
    resetEffects();
  }
}


const successTemplate = document
  .querySelector('#success')
  .content
  .querySelector('.success');

const errorTemplate = document
  .querySelector('#error')
  .content
  .querySelector('.error');

const showMessage = (template) => {
  const message = template.cloneNode(true);
  document.body.append(message);

  const isError = message.classList.contains('error');

  if (isError) {
    uploadOverlay.style.zIndex = '1';
  }

  const inner =
    message.querySelector('.success__inner') ||
    message.querySelector('.error__inner');

  const button = message.querySelector('button');

  function close() {
    message.remove();
    document.removeEventListener('keydown', onEscKeydown);
    message.removeEventListener('click', onOutsideClick);

    if (isError) {
      uploadOverlay.style.zIndex = '';
    }
  }

  function onEscKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      close();
    }
  }

  function onOutsideClick(evt) {
    if (!inner.contains(evt.target)) {
      close();
    }
  }

  button.addEventListener('click', close);
  document.addEventListener('keydown', onEscKeydown);
  message.addEventListener('click', onOutsideClick);
};


uploadFileInput.addEventListener('change', () => {
  openUploadForm();

  const file = uploadFileInput.files[0];
  if (!file) {
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  previewImage.src = imageUrl;

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageUrl})`;
  });

  resetScale = initScale(uploadForm);
  resetEffects = initEffects(uploadForm);
});

uploadCancel.addEventListener('click', () => {
  closeUploadForm();
  resetForm();
});

uploadForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  submitButton.disabled = true;

  try {
    await sendData(new FormData(uploadForm));
    closeUploadForm();
    resetForm();
    showMessage(successTemplate);
  } catch (err) {
    showMessage(errorTemplate);
  } finally {
    submitButton.disabled = false;
  }
});

export { uploadForm };
