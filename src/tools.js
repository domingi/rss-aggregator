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

const parseRSS = (dom, url, state) => {
  const title = dom.querySelector('title').textContent;
  const description = dom.querySelector('description').textContent;

  const posts = dom.querySelectorAll('item');
  const items = [];
  posts.forEach((post) => {
    const { currentId } = state.modalId;
    state.modalId.currentId += 1;
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    items.push([currentId, link, postTitle, postDescription]);
  });
  return {
    title, description, url, items,
  };
};

const getNewFeedPosts = (dom, state, post, url) => {
  const newPosts = parseRSS(dom, url, state);
  const newPostsAdd = newPosts.items.reduce((acc, newPost) => {
    const [_id, url1] = newPost;
    const comparePosts = post.items.filter(([_id2, url2]) => url2 === url1);
    if (comparePosts.length === 0) acc.push(newPost);
    return acc;
  }, []);
  return [...post.items, ...newPostsAdd];
};

const refreshFeed = (watchedState) => {
  const iter = () => {
    if (watchedState.feeds.length === 0) return;
    const promises = watchedState.posts.map((post) => loadRSS(post.url)
      .then((rssDom) => {
        post.items = getNewFeedPosts(rssDom, watchedState, post, post.url);
      }).catch(() => {
        console.log('Ошибка при обновлении RSS');
      }));
    Promise.all([promises]);
  };

  return new Promise((resolve) => {
    setTimeout(resolve, 5000);
  }).then(() => iter())
    .then(() => {
      refreshFeed(watchedState);
    });
};

export {
  parseRSS,
  loadRSS,
  refreshFeed,
};
