const renderForm = (state, elements, i18n, value) => {
  const { input, feedback, button } = elements;
  switch (value) {
    case 'processing':
      input.setAttribute('disabled', '');
      button.setAttribute('disabled', '');
      feedback.textContent = '';
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      break;
    case 'failed':
      feedback.textContent = i18n.t(state.form.error);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.removeAttribute('disabled');
      button.removeAttribute('disabled');
      break;

    default:
      break;
  }
};

const renderLoadingProcces = (state, elements, i18n, value) => {
  const { input, feedback, button } = elements;
  switch (value) {
    case 'succsess':
      feedback.textContent = i18n.t('successfully');
      input.removeAttribute('disabled');
      button.removeAttribute('disabled');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.value = '';
      input.focus();
      break;
    case 'failed':
      feedback.textContent = i18n.t(state.loadingProcces.error);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.removeAttribute('disabled');
      button.removeAttribute('disabled');
      break;

    default:
      break;
  }
};

const createCard = (title) => {
  const cardMain = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');
  const listGroup = document.createElement('ul');

  cardMain.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title', 'h4');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  cardTitle.textContent = title;

  cardBody.append(cardTitle);
  cardMain.append(cardBody, listGroup);
  return cardMain;
};

const renderFeeds = (state, elements, i18n) => {
  const { feeds } = elements;

  if (!feeds.hasChildNodes()) {
    const card = createCard(i18n.t('feeds'));
    feeds.append(card);
  }
  const cardMain = feeds.querySelector('.card');
  const listGroup = feeds.querySelector('ul');

  const items = state.feeds.map((feed) => {
    const item = document.createElement('li');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    item.classList.add('list-group-item', 'border-0', 'border-end-0');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;
    item.append(title, description);
    return item;
  });
  listGroup.append(...items);
  feeds.append(cardMain);
};

const renderModal = (state, element) => {
  const { modal } = element;
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const [postOpen] = state.posts.filter((post) => post.id === state.openIdModal);

  modalTitle.textContent = postOpen.title;
  modalBody.innerHTML = `<p>${postOpen.description}</p>`;
};

const renderPosts = (state, elements, i18n) => {
  const { posts } = elements;

  if (!posts.hasChildNodes()) {
    const card = createCard(i18n.t('posts'));
    posts.append(card);
  }
  const cardMain = posts.querySelector('.card');
  const listGroup = posts.querySelector('ul');

  listGroup.innerHTML = '';

  const items = state.posts.map((post) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const button = document.createElement('button');

    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    if (state.ulOpened.includes(post.id)) {
      link.classList.add('fw-normal', 'link-secondary');
    } else {
      link.classList.add('fw-bold');
    }
    link.textContent = post.title;
    link.href = post.link;
    link.dataset.id = post.id;
    link.setAttribute('target', '_blank');

    button.textContent = i18n.t('view');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';

    item.append(link, button);
    return item;
  });

  listGroup.append(...items);
  posts.append(cardMain);
};

export default (state, elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.status':
      renderForm(state, elements, i18n, value);
      break;

    case 'loadingProcces.status':
      renderLoadingProcces(state, elements, i18n, value);
      break;

    case 'feeds':
      renderFeeds(state, elements, i18n);
      break;

    case 'posts':
      renderPosts(state, elements, i18n);
      break;

    case 'ulOpened':
      renderPosts(state, elements, i18n);
      break;

    case 'openIdModal':
      renderModal(state, elements);
      renderPosts(state, elements, i18n);
      break;

    default:
      break;
  }
};
