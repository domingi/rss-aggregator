const renderText = (i18nInstance) => {
  document.querySelector('h1').textContent = i18nInstance.t('h1');
  document.querySelector('p.lead').textContent = i18nInstance.t('lead');
  document.querySelector('label').textContent = i18nInstance.t('label');
  document.querySelector('#example').textContent = i18nInstance.t('example');
  document.querySelector('#buttonAdd').textContent = i18nInstance.t('buttonAdd');
  document.querySelector('#buttonReadAll').textContent = i18nInstance.t('buttonReadAll');
  document.querySelector('#buttonHide').textContent = i18nInstance.t('buttonHide');
};

const renderError = (state) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const statusMessage = document.querySelector('#status-message');

  statusMessage.textContent = state.form.error;
  input.classList.add('is-invalid');
  statusMessage.classList.add('text-danger');
  statusMessage.classList.remove('text-succes');

  form.reset();
  input.focus();
};

const renderMessageSuccess = (i18n) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const statusMessage = document.querySelector('#status-message');

  statusMessage.textContent = i18n.t('messageSuccess');
  input.classList.remove('is-invalid');
  statusMessage.classList.remove('text-danger');
  statusMessage.classList.add('text-success');

  form.reset();
  input.focus();
};

const renderPosts = (state) => {
  const feed = document.querySelector('.feeds');
  feed.innerHTML = '';
  const feedDiv = document.createElement('div');
  feedDiv.innerHTML = '<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>';
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feed.append(feedDiv, ul);
  state.content.sources.map((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${item.title}</h3><p class="m-0 small text-black-50">${item.description}</p></li>`;
    ul.append(li);
    return item;
  });

  const posts = document.querySelector('.posts');
  posts.innerHTML = '';
  const postsDiv = document.createElement('div');
  postsDiv.innerHTML = '<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div></div>';
  const ul2 = document.createElement('ul');
  ul2.classList.add('list-group', 'border-0', 'rounded-0');
  posts.append(postsDiv, ul2);
  state.content.sources.map((item) => {
    item.posts.map((post) => {
      const [index, link, title] = post;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      li.innerHTML = `<a href=${link} class="fw-bold" data-id=${index} target="_blank" rel="noopener noreferrer">${title}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id=${index} data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      ul2.append(li);
      return post;
    });
    return item;
  });
};

const renderModal = (state, id) => {
  const modal = document.querySelector('#modal');
  modal.classList.add('show');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('style', 'display: block;');

  const postForModal = state.content.sources.reduce((acc, feed) => {
    const data = feed.posts.find((post) => post.includes(id));
    if (data) return [...data];
    return acc;
  }, []);
  // eslint-disable-next-line no-unused-vars
  const [_id, link, title, description] = postForModal;
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').textContent = description;
  modal.querySelector('#buttonReadAll').setAttribute('href', link);
};

const removeModal = () => {
  const modal = document.querySelector('#modal');
  modal.classList.remove('show');
  modal.removeAttribute('aria-modal');
  modal.removeAttribute('style');
};

export {
  renderText,
  renderPosts,
  renderMessageSuccess,
  renderError,
  renderModal,
  removeModal,
};
