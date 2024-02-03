import onChange from 'on-change';

const renderLinks = (post) => (path, value) => {
  if (path === 'viewedPost') {
    const link = document.querySelector(`a[data-id="${value}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal');
    link.classList.add('link-secondary');

    const modalTitle = document.querySelector('.modal-title');
    modalTitle.textContent = post.title;
    const modalBody = document.querySelector('.modal-body');
    modalBody.textContent = post.description;
    const modalLink = document.querySelector('.modal-footer a');
    modalLink.setAttribute('href', post.link);
  }
};

const renderGeneralStructure = (type, i18n) => {
  const view = document.querySelector(`.${type}`);
  view.textContent = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const div2 = document.createElement('div');
  div2.classList.add('card-body');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18n.t(type);
  view.prepend(div);
  div.prepend(div2);
  div.append(ul);
  div2.prepend(h2);

  return ul;
};

const renderPosts = (posts, view, direction, i18n, state) => {
  posts.forEach((post) => {
    const listEl = document.createElement('li');
    listEl.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    listEl.classList.add('align-items-start', 'border-0', 'border-end-0');
    if (direction === 'append') {
      view.append(listEl);
    } else if (direction === 'prepend') {
      view.prepend(listEl);
    }

    const link = document.createElement('a');
    link.setAttribute('href', post.link);
    link.classList.add('fw-bold');
    link.dataset.id = post.id;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = post.title;
    listEl.append(link);

    const watchedState = onChange(state, renderLinks(post));

    link.addEventListener('click', () => {
      watchedState.viewedPost = post.id;
    });

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18n.t('buttons');
    listEl.append(button);

    button.addEventListener('click', () => {
      watchedState.viewedPost = post.id;
    });
  });
};

const valid = (elements, i18n) => {
  elements.input.classList.remove('is-invalid');
  elements.input.classList.add('is-valid');
  elements.form.reset();
  elements.input.focus();
  const feedbackContainer = document.querySelector('.feedback');
  feedbackContainer.classList.remove('text-danger');
  feedbackContainer.classList.add('text-success');
  feedbackContainer.textContent = i18n.t('rssUploadedSuccessfully');
};

const invalid = (errorName, elements, i18n) => {
  elements.input.classList.remove('is-valid');
  elements.input.classList.add('is-invalid');
  const feedbackContainer = document.querySelector('.feedback');
  feedbackContainer.classList.remove('text-success');
  feedbackContainer.classList.add('text-danger');
  feedbackContainer.textContent = i18n.t(errorName);
};

export default (state, elements, i18n) => (path, value, previousValue) => {
  if (path === 'state') {
    if (value === 'processing') {
      elements.button.classList.add('disabled');
    }
    if (value === 'filling') {
      elements.button.classList.remove('disabled');
    }
  }
  if (path === 'error') {
    elements.input.classList.add('is-invalid');
    if (value.name === i18n.t('errorNames.validation')) {
      if (value.errors.toString() === 'errors.invalidUrl') {
        invalid('validationErrors.invalidUrl', elements, i18n, state);
      }
      if (value.errors.toString() === 'errors.addedRss') {
        invalid('validationErrors.addedRss', elements, i18n, state);
      }
    } else if (value.name === i18n.t('errorNames.axios')) {
      invalid('validationErrors.networkError', elements, i18n, state);
    } else if (value.name === i18n.t('errorNames.rss')) {
      if (value.message === 'doc is not defined') {
        invalid('validationErrors.invalidRss', elements, i18n, state);
      }
    }
  }
  if (path === 'feeds') {
    const view = renderGeneralStructure('feeds', i18n);

    state.feeds.forEach((feed) => {
      const feedElement = document.createElement('li');
      feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
      view.prepend(feedElement);

      const title = document.createElement('h3');
      title.classList.add('h6', 'm-0');
      title.textContent = feed.title;
      feedElement.append(title);

      const description = document.createElement('p');
      description.classList.add('m-0', 'small', 'text-black-50');
      description.textContent = feed.description;
      feedElement.append(description);

      valid(elements, i18n, state);
    });
  }
  if (path === 'newFeedId' && !previousValue) {
    const view = renderGeneralStructure('posts', i18n);

    const { posts } = state;
    renderPosts(posts, view, 'append', i18n, state);
  }
  if (path === 'newFeedId' && previousValue) {
    const view = document.querySelector('.posts ul');
    const posts = state.posts.filter(({ feedId }) => value === feedId).reverse();
    renderPosts(posts, view, 'prepend', i18n, state);
  }
  if (path === 'trackingPosts') {
    const view = document.querySelector('.posts ul');
    const existingPosts = state.posts.map(({ id }) => id);
    const posts = state.trackingPosts.filter(({ id }) => !existingPosts.includes(id)).reverse();
    renderPosts(posts, view, 'prepend', i18n, state);
  }
};
