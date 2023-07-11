import './styles.scss';
import '../index.html';
import { string } from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from '../locales/ru.js';
import { renderText } from './render.js';
import watch from './view.js';
import parseRss from './parseRss.js';

const loadRSS = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);

  return axios.get(proxy.href);
};

const addIdToPosts = (posts) => posts.map((post) => {
  const id = Math.random();
  return { ...post, id };
});

const addNewPostsToFeed = (posts, state) => {
  posts.forEach((newPost) => {
    const newPostUrl = newPost.url;
    const findPost = state.posts.find(({ url }) => url === newPostUrl);
    if (!findPost) {
      state.posts.push(newPost);
    }
  });
};

const refreshFeed = (watchedState, timer) => {
  const promises = watchedState.feeds.map((feed) => loadRSS(feed.url)
    .then((rssDom) => parseRss(rssDom))
    .then((data) => {
      addNewPostsToFeed(addIdToPosts(data.posts), watchedState);
    })
    .catch(() => {
      console.error('Ошибка при обновлении RSS');
    }));

  return Promise.all([promises]).then(() => {
    setTimeout(() => {
      refreshFeed(watchedState, timer);
    }, timer);
  });
};

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
  };

  const elements = {
    form: document.querySelector('form'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    input: document.querySelector('input'),
    statusMessage: document.querySelector('#status-message'),
    buttonAdd: document.querySelector('#buttonAdd'),
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(renderText(i18nInstance));

  const watchedState = watch(state, i18nInstance, elements);

  elements.posts.addEventListener('click', (e) => {
    if (e.target.parentElement.nodeName === 'LI') {
      const postId = Number(e.target.dataset.id);
      if (!state.seenPostIds.includes(postId)) {
        watchedState.seenPostIds.push(postId);
      }
      if (e.target.nodeName === 'BUTTON') {
        watchedState.modalId = Number(e.target.dataset.id);
      }
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
    const feedUrls = state.feeds.map((feed) => feed.url);
    const userSchema = string().required().url().notOneOf(feedUrls);
    userSchema.validate(url)
      .then(() => {
        watchedState.loadingProcess.status = 'loading';
        loadRSS(url)
          .then((rssDom) => {
            const { title, description, posts } = parseRss(rssDom);
            watchedState.feeds.push({ title, description, url });
            watchedState.posts = [...state.posts, ...addIdToPosts(posts)];
            state.loadingProcess.error = '';
            watchedState.loadingProcess.status = 'success';
            state.loadingProcess.status = '';
          }).catch((error) => {
            state.loadingProcess.error = error.code;
            watchedState.loadingProcess.status = 'failed';
            state.loadingProcess.status = '';
          });
      })
      .catch((error) => {
        state.loadingProcess.error = error.type;
        watchedState.loadingProcess.status = 'failed';
        state.loadingProcess.status = '';
      });
  });
  refreshFeed(watchedState, 5000);
};
