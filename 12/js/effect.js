const EFFECTS = {
  none: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    apply(img) {
      img.style.filter = '';
    }
  },
  chrome: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    apply(img, value) {
      img.style.filter = `grayscale(${value})`;
    }
  },
  sepia: {
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    apply(img, value) {
      img.style.filter = `sepia(${value})`;
    }
  },
  marvin: {
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    apply(img, value) {
      img.style.filter = `invert(${value}%)`;
    }
  },
  phobos: {
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    apply(img, value) {
      img.style.filter = `blur(${value}px)`;
    }
  },
  heat: {
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    apply(img, value) {
      img.style.filter = `brightness(${value})`;
    }
  }
};


const initEffects = (uploadForm) => {
  const preview = uploadForm.querySelector('.img-upload__preview img');
  const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
  const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
  const effectValueField = uploadForm.querySelector('.effect-level__value');
  const effectsList = uploadForm.querySelector('.effects');

  let currentEffect = 'none';

  effectLevelContainer.classList.add('hidden');

  noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    connect: 'lower'
  });

  // обновление стиля при изменении ползунка
  effectLevelSlider.noUiSlider.on('update', () => {
    const value = effectLevelSlider.noUiSlider.get();
    effectValueField.value = value;
    EFFECTS[currentEffect].apply(preview, value);
  });

  // при переключении эффекта
  effectsList.addEventListener('change', (evt) => {
    currentEffect = evt.target.value;

    if (currentEffect === 'none') {
      effectLevelContainer.classList.add('hidden');
      preview.style.filter = '';
      effectValueField.value = '';
      return;
    }

    const cfg = EFFECTS[currentEffect];

    effectLevelContainer.classList.remove('hidden');

    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: cfg.min, max: cfg.max },
      start: cfg.start,
      step: cfg.step
    });

    effectValueField.value = cfg.start;
    cfg.apply(preview, cfg.start);
  });

  // вернуть функцию сброса эффектов
  return () => {
    currentEffect = 'none';
    effectLevelContainer.classList.add('hidden');
    preview.style.filter = '';
    effectValueField.value = '';
    effectLevelSlider.noUiSlider.set(1);
  };
};

export { initEffects };
