const renderGeneralStructure = (type, i18nInstance) => {
  const container = document.querySelector(`.${type}`);
  container.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');
  const div2 = document.createElement('div');
  div2.classList.add('card-body');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nInstance.t(type);
  container.prepend(div);
  div.prepend(div2);
  div.append(ul);
  div2.prepend(h2);

  return ul;
};

const valid = (form, i18n) => {
  const input = form.elements.url;
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  form.reset();
  input.focus();
  const feedbackContainer = document.querySelector('.feedback');
  feedbackContainer.classList.remove('text-danger');
  feedbackContainer.classList.add('text-success');
  feedbackContainer.textContent = i18n.t('rssUploadedSuccessfully');
};

const invalid = (errorName, form, i18n) => {
  const input = form.elements.url;
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  const feedbackContainer = document.querySelector('.feedback');
  feedbackContainer.classList.remove('text-success');
  feedbackContainer.classList.add('text-danger');
  feedbackContainer.textContent = i18n.t(errorName);
};

export default (state, form, i18n) => (path, value) => {
  if (path === 'error') {
    const input = form.elements.url;
    input.classList.add('is-invalid');
    if (value.name === i18n.t('errorNames.validation')) {
      if (value.errors.toString() === 'errors.invalidUrl') {
        invalid('validationErrors.invalidUrl', form, i18n);
      }
      if (value.errors.toString() === 'errors.addedRss') {
        invalid('validationErrors.addedRss', form, i18n);
      }
    }
  }
  if (path === 'feeds') {
    const list = renderGeneralStructure('feeds', i18n);

    state.feeds.forEach((feed) => {
      const feedElement = document.createElement('li');
      feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
      list.prepend(feedElement);

      const title = document.createElement('h3');
      title.classList.add('h6', 'm-0');
      title.textContent = feed.title;
      feedElement.append(title);

      const description = document.createElement('p');
      description.classList.add('m-0', 'small', 'text-black-50');
      description.textContent = feed.description;
      feedElement.append(description);

      valid(form, i18n);
    });
  }
  if (path === 'activeFeed') {
    const list = renderGeneralStructure('posts', i18n);

    const posts = state.posts.filter(({ feedId }) => feedId === value);
    posts.forEach((post) => {
      const feedElement = document.createElement('li');
      feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
      list.append(feedElement);

      const link = document.createElement('a');
      link.setAttribute('href', post.link);
      link.classList.add('fw-bold');
      link.dataset.id = post.id;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.textContent = post.title;
      feedElement.append(link);
    });
  }
};
