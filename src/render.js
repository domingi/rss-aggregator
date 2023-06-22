/* eslint-disable no-param-reassign */
const renderText = (i18nInstance) => {
  document.querySelector('h1').textContent = i18nInstance.t('h1');
  document.querySelector('p.lead').textContent = i18nInstance.t('lead');
  document.querySelector('label').textContent = i18nInstance.t('label');
  document.querySelector('#example').textContent = i18nInstance.t('example');
  document.querySelector('#buttonAdd').textContent = i18nInstance.t('buttonAdd');
  document.querySelector('#buttonReadAll').textContent = i18nInstance.t('buttonReadAll');
  document.querySelector('#buttonHide').textContent = i18nInstance.t('buttonHide');
};

const renderError = (errorSource, i18n, elements) => {
  elements.statusMessage.textContent = i18n.t(`errors.${errorSource}`);
  elements.input.classList.add('is-invalid');
  elements.statusMessage.classList.add('text-danger');
  elements.statusMessage.classList.remove('text-succes');

  elements.form.reset();
  elements.input.focus();
};

const renderMessageSuccess = (i18n, elements) => {
  elements.statusMessage.textContent = i18n.t('messageSuccess');
  elements.input.classList.remove('is-invalid');
  elements.statusMessage.classList.remove('text-danger');
  elements.statusMessage.classList.add('text-success');

  elements.form.reset();
  elements.input.focus();
};

const renderFeed = (state, elements) => {
  elements.feed.innerHTML = '';
  const feedDiv = document.createElement('div');
  feedDiv.innerHTML = '<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>';
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  elements.feed.append(feedDiv, ul);
  state.posts.map((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${item.title}</h3><p class="m-0 small text-black-50">${item.description}</p></li>`;
    ul.append(li);
    return item;
  });
};

const renderPosts = (state, elements) => {
  elements.posts.innerHTML = '';
  const postsDiv = document.createElement('div');
  postsDiv.innerHTML = '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div></div>';
  const ul2 = document.createElement('ul');
  ul2.classList.add('list-group', 'border-0', 'rounded-0');
  elements.posts.append(postsDiv, ul2);

  state.posts.map((post) => {
    post.items.map((item) => {
      const [id, link, title] = item;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      li.innerHTML = `<a href=${link} data-id=${id} target="_blank" rel="noopener noreferrer">${title}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id=${id} data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      const a = li.querySelector('a');
      if (state.seenPostIds.includes(id)) {
        a.classList.add('fw-normal');
      } else a.classList.add('fw-bold');
      ul2.append(li);
      return item;
    });
    return post;
  });
};

const renderModal = (state, postId, elements) => {
  elements.modal.classList.add('show');
  elements.modal.setAttribute('aria-modal', 'true');
  elements.modal.setAttribute('style', 'display: block;');

  const postForModal = state.posts.reduce((acc, feed) => {
    const data = feed.items.find((item) => item.includes(postId));
    if (data) return [...data];
    return acc;
  }, []);
  // eslint-disable-next-line no-unused-vars
  const [_id, link, title, description] = postForModal;
  elements.modal.querySelector('.modal-title').textContent = title;
  elements.modal.querySelector('.modal-body').textContent = description;
  elements.modal.querySelector('#buttonReadAll').setAttribute('href', link);
};

const removeModal = (elements) => {
  elements.modal.classList.remove('show');
  elements.modal.removeAttribute('aria-modal');
  elements.modal.removeAttribute('style');
};

const renderSeenPosts = (state) => {
  state.seenPostIds.forEach((id) => {
    const postLink = document.querySelector(`a[data-id="${id}"]`);
    postLink.classList.add('fw-normal');
    postLink.classList.remove('fw-bold');
  });
};

export {
  renderText,
  renderPosts,
  renderFeed,
  renderMessageSuccess,
  renderError,
  renderModal,
  removeModal,
  renderSeenPosts,
};
