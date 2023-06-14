import onChange from 'on-change';
import {
  renderPosts,
  renderFeed,
  renderMessageSuccess,
  renderError,
} from './render.js';

export default (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      if (value === 'invalid') {
        renderError(state, i18n);
      }
      if (value === 'valid') {
        renderFeed(state);
        renderPosts(state);
        renderMessageSuccess(i18n);
      }
      if (value === 'updated') {
        renderPosts(state);
      }
      // eslint-disable-next-line no-param-reassign
      state.form.state = '';
    }
  });
  return watchedState;
};
