import './styles.scss';
import '../index.html';
import { string, setLocale } from 'yup';
import i18next from 'i18next';
import ru from '../locales/ru.js';
import { removeModal, renderModal, renderText } from './render.js';
import view from './view.js';
import {
  getFeedPosts, parseRSS, getFeedDescription, getFeedTitle, getNewPostsEvery5Sec,
} from './tools.js';

export default () => {
  const state = {
    form: {
      state: '',
      error: [],
    },
    content: {
      feed: [],
      sources: [],
      id: 0,
    },
    ui: {
      viewedPostIds: [],
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
      if (!state.ui.viewedPostIds.includes(postId)) state.ui.viewedPostIds.push(postId);
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
  const button = document.querySelector('#buttonAdd');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    button.setAttribute('disabled', '');
    const formData = new FormData(event.target);
    const url = formData.get('url');

    const userSchema = string().required().url().notOneOf(state.content.feed);
    userSchema.validate(url)
      .then(() => {
        parseRSS(url)
          .then((rssDom) => {
            state.content.feed.push(url);
            state.content.sources.push({
              title: getFeedTitle(rssDom),
              description: getFeedDescription(rssDom),
              url,
              posts: getFeedPosts(rssDom, state),
            });
            state.form.error = '';
            watchedState.form.state = 'valid';
          }).catch((error) => {
            state.form.error = error.code;
            watchedState.form.state = 'invalid';
          });
      })
      .catch((error) => {
        state.form.error = error.errors;
        watchedState.form.state = 'invalid';
      });
    button.removeAttribute('disabled');
  });
  getNewPostsEvery5Sec(state, watchedState);
};
