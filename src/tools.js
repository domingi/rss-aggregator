/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import axios from 'axios';

function MyError(message, code) {
  this.name = 'MyError';
  this.message = message || 'Сообщение по умолчанию';
  this.stack = (new Error()).stack;
  this.code = code;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

const parseRSS = (url, watchedState) => {
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

const getFeedTitle = (dom) => dom.querySelector('title').textContent;

const getFeedDescription = (dom) => dom.querySelector('description').textContent;

const getFeedPosts = (dom, state) => {
  const items = dom.querySelectorAll('item');
  const arr = [];
  items.forEach((item) => {
    const { id } = state.content;
    state.content.id += 1;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    arr.push([id, link, title, description]);
  });
  return arr;
};

const getNewFeedPosts = (dom, state, link) => {
  const newPosts = getFeedPosts(dom, state);
  const feedToUpdate = state.content.sources.find(({ url }) => url === link);
  const newPostsToAdd = feedToUpdate.posts.filter((post) => {
    const [_id, _url, title] = post;
    const comparePosts = newPosts.filter(([_id2, _url2, title2]) => title2 === title);
    return !(comparePosts.length > 0);
  });
  return [...feedToUpdate.posts, ...newPostsToAdd];
};

const getNewPostsEvery5Sec = (state, watchedState) => new Promise((resolve) => {
  setTimeout(resolve, 5000);
})
  .then(() => {
    state.content.sources.forEach((source) => {
      parseRSS(source.url)
        .then((rssDom) => {
          source.posts = getNewFeedPosts(rssDom, state, source.url);
          watchedState.form.state = 'updated';
        })
        .then(() => {
          getNewPostsEvery5Sec(state, watchedState);
        });
    });
  });

export {
  getFeedTitle,
  getFeedDescription,
  getFeedPosts,
  parseRSS,
  getNewPostsEvery5Sec,
};
