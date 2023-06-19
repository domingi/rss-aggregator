import onChange from 'on-change';
import {
  renderPosts,
  renderFeed,
  renderMessageSuccess,
  renderError,
} from './render.js';

export default (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'loadingProcess.status') {
      if (value === 'loading') {
        document.querySelector('#buttonAdd').setAttribute('disabled', '');
      }
      if (value === 'success') {
        document.querySelector('#buttonAdd').removeAttribute('disabled');
        renderFeed(state);
        renderPosts(state);
        renderMessageSuccess(i18n);
      }
      if (value === 'failed') {
        renderError(state.loadingProcess.error, i18n);
        document.querySelector('#buttonAdd').removeAttribute('disabled');
      }
      if (value === 'updated') {
        renderPosts(state);
      }
      // eslint-disable-next-line no-param-reassign
      state.loadingProcess.status = '';
    }
  });
  return watchedState;
};
