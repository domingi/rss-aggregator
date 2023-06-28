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

const addNewPostsToFeed = (data, feed, url) => {
  const newFeed = parseRss(data, url);
  const newPosts = newFeed.posts.reduce((acc, newPost) => {
    const [, newPostUrl] = newPost;
    const comparePosts = feed.posts.filter(([, oldPostUrl]) => oldPostUrl === newPostUrl);
    if (comparePosts.length === 0) acc.push(newPost);
    return acc;
  }, []);
  return [...feed.posts, ...newPosts];
};

const refreshFeed = (watchedState) => {
  if (watchedState.feedList.length === 0) {
    return setTimeout(() => {
      refreshFeed(watchedState);
    }, 10000);
  }

  const promises = watchedState.feeds.map((feed) => loadRSS(feed.url)
    .then((rssDom) => {
      // eslint-disable-next-line no-param-reassign
      feed.posts = addNewPostsToFeed(rssDom, feed, feed.url);
    }).catch(() => {
      console.log('Ошибка при обновлении RSS');
    }));

  return Promise.all([promises]).then(() => {
    setTimeout(() => {
      refreshFeed(watchedState);
    }, 10000);
  });
};

export default () => {
  const state = {
    loadingProcess: {
      status: '',
      error: [],
    },
    feedList: [],
    feeds: [],
    modalId: null,
    seenPostIds: [],
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

    const userSchema = string().required().url().notOneOf(state.feedList);
    userSchema.validate(url)
      .then(() => {
        watchedState.loadingProcess.status = 'loading';
        loadRSS(url)
          .then((rssDom) => {
            watchedState.feeds.push(parseRss(rssDom, url));
            watchedState.feedList.push(url);
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
