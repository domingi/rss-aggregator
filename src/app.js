import './styles.scss';
import '../index.html';
import { string } from 'yup';
import i18next from 'i18next';
import ru from '../locales/ru.js';
import { renderText } from './render.js';
import watch from './view.js';
import {
  parseRSS, loadRSS, refreshFeed,
} from './tools.js';

export default () => {
  const state = {
    loadingProcess: {
      status: '',
      error: [],
    },
    feeds: [],
    posts: [],
    modalId: null,
    seenPostIds: [],
    idCounter: 0,
  };

  const elements = {
    form: document.querySelector('form'),
    feed: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    input: document.querySelector('input'),
    statusMessage: document.querySelector('#status-message'),
    buttonAdd: document.querySelector('#buttonAdd'),
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(renderText(i18nInstance));

  const watchedState = watch(state, i18nInstance, elements);

  elements.posts.addEventListener('click', (e) => {
    if (e.target.dataset.bsToggle === 'modal') {
      const postId = Number(e.target.dataset.id);
      if (!state.seenPostIds.includes(postId)) {
        watchedState.seenPostIds.push(postId);
      }
      watchedState.modalId = Number(e.target.dataset.id);
    }
  });

  elements.modal.addEventListener('click', (e) => {
    if (e.target.dataset.bsDismiss === 'modal') {
      watchedState.modalId = null;
    }
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');

    const userSchema = string().required().url().notOneOf(state.feeds);
    userSchema.validate(url)
      .then(() => {
        watchedState.loadingProcess.status = 'loading';
        loadRSS(url)
          .then((rssDom) => {
            watchedState.posts.push(parseRSS(rssDom, url, state));
            watchedState.feeds.push(url);
            state.loadingProcess.error = '';
            watchedState.loadingProcess.status = 'success';
          }).catch((error) => {
            state.loadingProcess.error = error.code;
            watchedState.loadingProcess.status = 'failed';
          });
      })
      .catch((error) => {
        state.loadingProcess.error = error.type;
        watchedState.loadingProcess.status = 'failed';
      });
  });
  refreshFeed(watchedState);
};
