import './styles.scss';
import '../index.html';
import { string, setLocale } from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import ru from '../locales/ru.js';
import { removeModal, renderModal, renderText } from './render.js';
import view from './view.js';

const parseRSS = (url) => {
  const xmlDom = axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((xml) => {
      const parser = new DOMParser();
      return parser.parseFromString(xml.data.contents, 'text/xml');
    })
    .catch((error) => {
      throw error('Адрес не доступен. Введите другой адрес');
    });
  return xmlDom;
};

const getFeedTitle = (dom) => dom.querySelector('title').textContent;
const getFeedDescription = (dom) => dom.querySelector('description').textContent;
const getFeedPosts = (dom) => {
  const items = dom.querySelectorAll('item');
  const arr = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    arr.push([uniqueId(), link, title, description]);
  });
  return arr;
};

export default () => {
  const state = {
    form: {
      state: '',
      error: [],
    },
    content: {
      feed: [],
      sources: [],
    },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(renderText(i18nInstance));

  setLocale({
    string: {
      default: i18nInstance.t('errors.default'),
      url: i18nInstance.t('errors.url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('errors.notOneOf'),
    },
  });

  const watchedState = view(state, i18nInstance);

  const modal = document.querySelector('#modal');
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.bsDismiss === 'modal') {
      removeModal();
    }
  });

  const posts = document.querySelector('.posts');
  posts.addEventListener('click', (e) => {
    if (e.target.dataset.bsToggle === 'modal') {
      renderModal(state, e.target.dataset.id);
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');

    const userSchema = string().url().notOneOf(state.content.feed);
    userSchema.validate(url)
      .then(() => {
        parseRSS(url)
          .then((rssDom) => {
            state.content.feed.push(url);
            state.content.sources.push({
              title: getFeedTitle(rssDom),
              description: getFeedDescription(rssDom),
              url,
              posts: getFeedPosts(rssDom),
            });
            watchedState.form.error = '';
            watchedState.form.state = 'valid';
            state.form.state = '';
          });
      })
      .catch((error) => {
        watchedState.form.error = error.errors;
        watchedState.form.state = 'invalid';
        state.form.state = '';
      });
  });
};
