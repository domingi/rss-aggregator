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
  const { statusMessage, input, form } = elements;
  statusMessage.textContent = i18n.t(`errors.${errorSource}`);
  input.classList.add('is-invalid');
  statusMessage.classList.add('text-danger');
  statusMessage.classList.remove('text-succes');

  form.reset();
  input.focus();
};

const renderMessageSuccess = (i18n, elements) => {
  const { statusMessage, input, form } = elements;
  statusMessage.textContent = i18n.t('messageSuccess');
  input.classList.remove('is-invalid');
  statusMessage.classList.remove('text-danger');
  statusMessage.classList.add('text-success');

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

  state.feeds.map((feed) => {
    feed.posts.map((post) => {
      const [id, url, title] = post;
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      item.innerHTML = `<a href=${url} data-id=${id} target="_blank" rel="noopener noreferrer"></a><button type="button" class="btn btn-outline-primary btn-sm" data-id=${id} data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      const link = item.querySelector('a');
      link.textContent = title;
      if (state.seenPostIds.includes(id)) {
        link.classList.add('fw-normal');
      } else link.classList.add('fw-bold');
      list.append(item);
      return post;
    });
    return feed;
  });
};

const renderModal = (state, postId, elements) => {
  const { modal } = elements;
  modal.classList.add('show');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('style', 'display: block;');

  const postForModal = state.feeds.reduce((acc, feed) => {
    const data = feed.posts.find((post) => post.includes(postId));
    if (data) return [...data];
    return acc;
  }, []);
  const [, url, title, description] = postForModal;
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').textContent = description;
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
  renderMessageSuccess,
  renderError,
  renderModal,
  removeModal,
  renderSeenPosts,
};
