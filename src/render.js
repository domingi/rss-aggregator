const renderText = (i18nInstance) => {
  document.querySelector('h1').textContent = i18nInstance.t('h1');
  document.querySelector('p.lead').textContent = i18nInstance.t('lead');
  document.querySelector('label').textContent = i18nInstance.t('label');
  document.querySelector('#example').textContent = i18nInstance.t('example');
  document.querySelector('#buttonAdd').textContent = i18nInstance.t('buttonAdd');
  document.querySelector('#buttonReadAll').textContent = i18nInstance.t('buttonReadAll');
  document.querySelector('#buttonHide').textContent = i18nInstance.t('buttonHide');
};

const renderLoadingStatusMessage = (i18n, elements, error = null) => {
  const { statusMessage, input, form } = elements;

  if (error === null) {
    statusMessage.textContent = i18n.t('messageSuccess');
    input.classList.remove('is-invalid');
    statusMessage.classList.remove('text-danger');
    statusMessage.classList.add('text-success');
  } else {
    statusMessage.textContent = i18n.t(`errors.${error}`);
    input.classList.add('is-invalid');
    statusMessage.classList.add('text-danger');
    statusMessage.classList.remove('text-succes');
  }

  form.reset();
  input.focus();
};

const renderFeed = (state, elements) => {
  const { feeds } = elements;
  feeds.innerHTML = '';
  const container = document.createElement('div');
  container.innerHTML = '<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>';
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.append(container, list);
  state.feeds.map((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'border-end-0');
    item.innerHTML = '<h3 class="h6 m-0"></h3><p class="m-0 small text-black-50"></p></li>';
    item.querySelector('h3').textContent = feed.title;
    item.querySelector('p').textContent = feed.description;
    list.append(item);
    return feed;
  });
};

const renderPosts = (state, elements) => {
  const { posts } = elements;
  posts.innerHTML = '';
  const container = document.createElement('div');
  container.innerHTML = '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div></div>';
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  posts.append(container, list);

  state.posts.map((post) => {
    const { url, postTitle, id } = post;
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    item.innerHTML = `<a data-id=${id} target="_blank" rel="noopener noreferrer"></a><button type="button" class="btn btn-outline-primary btn-sm" data-id=${id} data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    const link = item.querySelector('a');
    link.setAttribute('href', url);
    link.textContent = postTitle;
    if (state.seenPostIds.includes(id)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }
    list.append(item);
    return post;
  });
};

const renderModal = (state, postId, elements) => {
  const { modal } = elements;
  modal.classList.add('show');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('style', 'display: block;');

  const postForModal = state.posts.find((post) => post.id === postId);

  const { url, postTitle, postDescription } = postForModal;
  modal.querySelector('.modal-title').textContent = postTitle;
  modal.querySelector('.modal-body').textContent = postDescription;
  modal.querySelector('#buttonReadAll').setAttribute('href', url);
};

const removeModal = (elements) => {
  const { modal } = elements;
  modal.classList.remove('show');
  modal.removeAttribute('aria-modal');
  modal.removeAttribute('style');
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
  renderLoadingStatusMessage,
  renderModal,
  removeModal,
  renderSeenPosts,
};
