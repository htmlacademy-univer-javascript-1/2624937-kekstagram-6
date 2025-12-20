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

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: EFFECTS.none.min,
      max: EFFECTS.none.max
    },
    start: EFFECTS.none.start,
    step: EFFECTS.none.step,
    connect: 'lower'
  });

  effectLevelSlider.noUiSlider.on('update', () => {
    const value = Number(effectLevelSlider.noUiSlider.get());
    effectValueField.value = value;

    if (currentEffect !== 'none') {
      EFFECTS[currentEffect].apply(preview, value);
    }
  });

  effectsList.addEventListener('change', (evt) => {
    if (!evt.target.matches('input[type="radio"]')) {
      return;
    }

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
      range: {
        min: cfg.min,
        max: cfg.max
      },
      step: cfg.step
    });

    effectLevelSlider.noUiSlider.set(cfg.start);
    effectValueField.value = cfg.start;
    cfg.apply(preview, cfg.start);
  });

  return () => {
    currentEffect = 'none';
    effectLevelContainer.classList.add('hidden');
    preview.style.filter = '';
    effectValueField.value = '';

    if (effectLevelSlider.noUiSlider) {
      effectLevelSlider.noUiSlider.set(EFFECTS.none.start);
    }
  };
};

export { initEffects };
