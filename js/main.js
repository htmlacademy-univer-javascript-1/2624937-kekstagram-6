const PHOTO_COUNT = 25;
const MAX_COMMENTS = 20;

const photos = [];
const comments = [];

const Likes = {
  min: 15,
  max: 200
};

const Avatar = {
  min: 1,
  max: 6
};

const NAMES = ['Артем', 'Роман', 'Мария', 'Дмитрий', 'София', 'Иван', 'Анна', 'Кирилл', 'Ольга', 'Алексей', 'Екатерина'];

const MESSAGES = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

const DESCRIPTIONS = [
  'Мой взгляд — моя вселенная.',
  'Внутри меня целый мир.',
  'Солнце в душе.',
  'Улыбка как настроение.',
  'Просто я.',
  'Поймала момент.',
  'В тишине своих мыслей.'];

const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


const addComment = (index) => ({
  id: index,
  avatar: `img/avatar-${getRandomInRange(Avatar.min, Avatar.max)}.svg`,
  message: MESSAGES[getRandomInRange(0, MESSAGES.length - 1)],
  name: NAMES[getRandomInRange(0, NAMES.length - 1)]
});

const addComments = () => {
  for (let i = 0; i < MAX_COMMENTS; i++) {
    comments.push(addComment(i));
  }
};

const addPhoto = (index) => ({
  id: index,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTIONS[getRandomInRange(0, DESCRIPTIONS.length - 1)],
  likes: getRandomInRange(Likes.min, Likes.max),
  comments: addComments()
});

const addPhotos = () => {
  for (let i = 0; i < PHOTO_COUNT; i++) {
    photos.push(addPhoto(i));
  }
};

addPhotos();
