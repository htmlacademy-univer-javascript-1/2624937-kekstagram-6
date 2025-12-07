const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

const initScale = (uploadForm) => {
  const preview = uploadForm.querySelector('.img-upload__preview img');

  const scaleSmallerBtn = uploadForm.querySelector('.scale__control--smaller');
  const scaleBiggerBtn = uploadForm.querySelector('.scale__control--bigger');
  const scaleValueField = uploadForm.querySelector('.scale__control--value');

  const setScale = (value) => {
    scaleValueField.value = `${value}%`;
    preview.style.transform = `scale(${value / 100})`;
  };

  // при каждом открытии формы
  setScale(100);

  scaleSmallerBtn.addEventListener('click', () => {
    let value = parseInt(scaleValueField.value, 10);
    if (value > SCALE_MIN) {
      value -= SCALE_STEP;
      setScale(value);
    }
  });

  scaleBiggerBtn.addEventListener('click', () => {
    let value = parseInt(scaleValueField.value, 10);
    if (value < SCALE_MAX) {
      value += SCALE_STEP;
      setScale(value);
    }
  });

  // вернуть наружу функцию сброса
  return () => setScale(100);
};

export { initScale };
