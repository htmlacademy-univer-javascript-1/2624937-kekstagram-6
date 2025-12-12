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

const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

let pristine;
let resetScale;
let resetEffects;


function onEsc(evt, close) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    close();
  }
}

function onClickOutside(evt, inner, close) {
  if (!inner.contains(evt.target)) {
    close();
  }
}

/* ---------------------------
      ВАЛИДАЦИЯ PRISTINE
----------------------------- */

const normalizeHashtags = (value) =>
  value.trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

const validateHashtagSyntax = (value) => {
  if (value.length === 0) {
    return true;
  }
  return normalizeHashtags(value).every((tag) => VALID_HASHTAG_REGEX.test(tag));
};

const validateHashtagCount = (value) =>
  normalizeHashtags(value).length <= MAX_HASHTAG_COUNT;

const validateHashtagDuplicates = (value) => {
  const hashtags = normalizeHashtags(value);
  return new Set(hashtags).size === hashtags.length;
};

const validateComment = (value) =>
  value.length <= MAX_COMMENT_LENGTH;

const initPristine = () => {
  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  pristine.addValidator(
    hashtagInput,
    validateHashtagSyntax,
    'Хэш-тег должен начинаться с #, содержать буквы/цифры и быть до 20 символов.',
    3,
    true
  );

  pristine.addValidator(
    hashtagInput,
    validateHashtagCount,
    `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов.`,
    2,
    true
  );

  pristine.addValidator(
    hashtagInput,
    validateHashtagDuplicates,
    'Хэш-теги не должны повторяться.',
    1,
    true
  );

  pristine.addValidator(
    commentInput,
    validateComment,
    `Комментарий до ${MAX_COMMENT_LENGTH} символов.`,
  );
};

initPristine();

const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  pristine.reset();
};

const closeUploadForm = () => {
  pristine.reset();
  uploadFileInput.value = '';
  uploadForm.reset();

  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  if (resetScale) {resetScale();}
  if (resetEffects) {resetEffects();}
};

const isTextFieldFocused = () =>
  document.activeElement === hashtagInput ||
  document.activeElement === commentInput;

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    if (!isTextFieldFocused()) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
}

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const showMessage = (template) => {
  const message = template.cloneNode(true);
  document.body.append(message);

  const inner =
    message.querySelector('.success__inner') ||
    message.querySelector('.error__inner');

  const button = message.querySelector('button');

  function close() {
    message.remove();
    document.removeEventListener('keydown', escHandler);
    message.removeEventListener('click', clickOutsideHandler);
  }

  function escHandler(evt) {
    onEsc(evt, close);
  }

  function clickOutsideHandler(evt) {
    onClickOutside(evt, inner, close);
  }

  button.addEventListener('click', close);
  document.addEventListener('keydown', escHandler);
  message.addEventListener('click', clickOutsideHandler);
};


uploadFileInput.addEventListener('change', () => {
  openUploadForm();

  resetScale = initScale(uploadForm);
  resetEffects = initEffects(uploadForm);
});

uploadCancel.addEventListener('click', () => {
  closeUploadForm();
});

uploadForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {return;}

  const submitButton = uploadForm.querySelector('.img-upload__submit');
  submitButton.disabled = true;

  const formData = new FormData(uploadForm);

  try {
    await sendData(formData);
    closeUploadForm();
    showMessage(successTemplate);
  } catch (err) {
    showMessage(errorTemplate);
  } finally {
    submitButton.disabled = false;
  }
});

export { uploadForm, closeUploadForm };
