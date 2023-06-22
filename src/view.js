import onChange from 'on-change';
import {
  renderPosts,
  renderFeed,
  renderMessageSuccess,
  renderError,
} from './render.js';

export default (state, i18n, elements) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'loadingProcess.status') {
      if (value === 'loading') {
        elements.buttonAdd.setAttribute('disabled', '');
      }
      if (value === 'success') {
        elements.buttonAdd.removeAttribute('disabled');
        renderMessageSuccess(i18n, elements);
      }
      if (value === 'failed') {
        renderError(state.loadingProcess.error, i18n, elements);
        elements.buttonAdd.removeAttribute('disabled');
      }
      // eslint-disable-next-line no-param-reassign
      state.loadingProcess.status = '';
    }
    if (path === 'feeds') {
      renderFeed(state, elements);
    }
    if (path.includes('posts')) {
      renderPosts(state, elements);
    }
  });
  return watchedState;
};
