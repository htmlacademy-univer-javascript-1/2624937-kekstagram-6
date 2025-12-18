const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

const initScale = (uploadForm) => {
  const preview = uploadForm.querySelector('.img-upload__preview img');
  const scaleSmallerBtn = uploadForm.querySelector('.scale__control--smaller');
  const scaleBiggerBtn = uploadForm.querySelector('.scale__control--bigger');
  const scaleValueField = uploadForm.querySelector('.scale__control--value');

  let currentScale = 100;

  const setScale = (value) => {
    currentScale = value;
    scaleValueField.value = `${value}%`;
    preview.style.transform = `scale(${value / 100})`;
  };

  const resetScale = () => {
    setScale(100);
  };

  // Удаляем старые обработчики перед добавлением новых
  scaleSmallerBtn.removeEventListener('click', onSmallerClick);
  scaleBiggerBtn.removeEventListener('click', onBiggerClick);

  function onSmallerClick() {
    if (currentScale > SCALE_MIN) {
      setScale(currentScale - SCALE_STEP);
    }
  }

  function onBiggerClick() {
    if (currentScale < SCALE_MAX) {
      setScale(currentScale + SCALE_STEP);
    }
  }

  // Сбрасываем масштаб при каждой инициализации
  resetScale();

  // Добавляем обработчики
  scaleSmallerBtn.addEventListener('click', onSmallerClick);
  scaleBiggerBtn.addEventListener('click', onBiggerClick);

  return () => {
    resetScale();
    // Очистка обработчиков при уничтожении
    scaleSmallerBtn.removeEventListener('click', onSmallerClick);
    scaleBiggerBtn.removeEventListener('click', onBiggerClick);
  };
};

export { initScale };
