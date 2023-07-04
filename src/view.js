import onChange from 'on-change';
import {
  renderPosts,
  renderFeed,
  renderLoadingStatusMessage,
  removeModal,
  renderModal,
  renderSeenPosts,
} from './render.js';

const handleLoadingProcessStatus = (value, state, i18n, elements) => {
  switch (value) {
    case 'loading':
      elements.buttonAdd.setAttribute('disabled', '');
      break;

    case 'success':
      elements.buttonAdd.removeAttribute('disabled');
      renderLoadingStatusMessage(i18n, elements);
      break;

    case 'failed':
      renderLoadingStatusMessage(i18n, elements, state.loadingProcess.error);
      elements.buttonAdd.removeAttribute('disabled');
      break;

    default:
      throw new Error('Unknown loadingProcessStatus');
  }
};

const handleFeeds = (state, elements) => {
  renderFeed(state, elements);
};

const handlePosts = (state, elements) => {
  renderPosts(state, elements);
};

const handleModal = (state, elements, value) => {
  if (value === null) {
    removeModal(elements);
  } else {
    renderModal(state, value, elements);
  }
};

const handleSeenPosts = (state) => {
  renderSeenPosts(state);
};

export default (state, i18n, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'loadingProcess.status':
        handleLoadingProcessStatus(value, state, i18n, elements);
        break;

      case 'feeds':
        handleFeeds(state, elements);
        break;

      case 'posts':
        handlePosts(state, elements);
        break;

      case 'modalId':
        handleModal(state, elements, value);
        break;

      case 'seenPostIds':
        handleSeenPosts(state);
        break;

      default:
        console.log('Nothing happens');
    }
  });
  return watchedState;
};
