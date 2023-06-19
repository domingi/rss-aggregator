import './styles.scss';
import '../index.html';
import { string, setLocale } from 'yup';
import i18next from 'i18next';
import ru from '../locales/ru.js';
import { removeModal, renderModal, renderText } from './render.js';
import view from './view.js';
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
    modalId: {
      currentId: 0,
      seenPostIds: [],
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
      default: 'default',
      url: 'url',
    },
    mixed: {
      notOneOf: 'notOneOf',
      required: 'required',
    },
  });

  const watchedState = view(state, i18nInstance);

  const posts = document.querySelector('.posts');
  posts.addEventListener('click', (e) => {
    if (e.target.dataset.bsToggle === 'modal') {
      const postId = Number(e.target.dataset.id);
      if (!state.modalId.seenPostIds.includes(postId)) {
        state.modalId.seenPostIds.push(postId);
      }
      renderModal(state, postId);
    }
  });

  const modal = document.querySelector('#modal');
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.bsDismiss === 'modal') {
      removeModal();
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');

    const userSchema = string().required().url().notOneOf(state.feeds);
    userSchema.validate(url)
      .then(() => {
        watchedState.loadingProcess.status = 'loading';
        loadRSS(url)
          .then((rssDom) => {
            state.feeds.push(url);
            state.posts.push({
              title: rssDom.querySelector('title').textContent,
              description: rssDom.querySelector('description').textContent,
              url,
              items: parseRSS(rssDom, state),
            });
            state.loadingProcess.error = '';
            watchedState.loadingProcess.status = 'success';
          }).catch((error) => {
            state.loadingProcess.error = error.code;
            watchedState.loadingProcess.status = 'failed';
          });
      })
      .catch((error) => {
        state.loadingProcess.error = error.errors;
        watchedState.loadingProcess.status = 'failed';
      });
  });
  refreshFeed(state, watchedState);
};
