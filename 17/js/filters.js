import { debounce } from './util.js';


const FILTER_RANDOM_COUNT = 10;
const RERENDER_DELAY = 500;

const filtersElement = document.querySelector('.img-filters');
const filterButtons = filtersElement.querySelectorAll('.img-filters__button');


const filterDefault = (photos) => photos.slice();

const filterRandom = (photos) =>
  photos
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, FILTER_RANDOM_COUNT);

const filterDiscussed = (photos) =>
  photos
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length);

const setActiveFilter = (button) => {
  filterButtons.forEach((btn) =>
    btn.classList.remove('img-filters__button--active')
  );
  button.classList.add('img-filters__button--active');
};

const showFilters = () => {
  filtersElement.classList.remove('img-filters--inactive');
};

const initFilters = (photos, render) => {
  showFilters();
  const debouncedRender = debounce(render, RERENDER_DELAY);

  filtersElement.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    setActiveFilter(evt.target);

    switch (evt.target.id) {
      case 'filter-random':
        debouncedRender(filterRandom(photos));
        break;
      case 'filter-discussed':
        debouncedRender(filterDiscussed(photos));
        break;
      default:
        debouncedRender(filterDefault(photos));
    }
  });
};

export { initFilters };
