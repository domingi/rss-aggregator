/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';

function MyError(message, code) {
  this.name = 'MyError';
  this.message = message || 'Unknown error';
  this.stack = (new Error()).stack;
  this.code = code;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

const loadRSS = (url) => {
  const xmlDom = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((xml) => {
      if (!xml.data.contents.startsWith('<?xml')) {
        throw new MyError('Error: not RSS', 'notRss');
      }
      const parser = new DOMParser();
      return parser.parseFromString(xml.data.contents, 'text/xml');
    });
  return xmlDom;
};

const parseRSS = (dom, state) => {
  const items = dom.querySelectorAll('item');
  const arr = [];
  items.forEach((item) => {
    const { currentId } = state.modalId;
    state.modalId.currentId += 1;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    arr.push([currentId, link, title, description]);
  });
  return arr;
};

const getNewFeedPosts = (dom, state, post) => {
  const newPosts = parseRSS(dom, state);
  const newPostsAdd = newPosts.reduce((acc, newPost) => {
    const [_id, url1] = newPost;
    const comparePosts = post.items.filter(([_id2, url2]) => url2 === url1);
    if (comparePosts.length === 0) acc.push(newPost);
    return acc;
  }, []);
  return [...post.items, ...newPostsAdd];
};

const refreshFeed = (state, watchedState) => {
  const iter = () => {
    if (state.feeds.length === 0) return;
    const promises = state.posts.map((post) => loadRSS(post.url)
      .then((rssDom) => {
        post.items = getNewFeedPosts(rssDom, state, post);
      }).catch((error) => {
        console.log('Ошибка при обновлении RSS');
      }));
    const promise = Promise.all([promises]);
    promise.then(() => {
      state.loadingProcess.error = '';
      watchedState.loadingProcess.status = 'updated';
    });
  };

  return new Promise((resolve) => {
    setTimeout(resolve, 5000);
  }).then(() => iter())
    .then(() => {
      refreshFeed(state, watchedState);
    });
};

export {
  parseRSS,
  loadRSS,
  refreshFeed,
};
