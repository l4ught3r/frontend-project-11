import onChange from 'on-change';
import * as yup from 'yup';
import render from './render';

export default () => {
  const state = {
    fields: {
      url: '',
    },
    error: '',
    urlUsedPreviosly: [],
    fieldValidaty: '',
  };

  const form = document.querySelector('form.rss-form');
  const watchedState = onChange(state, render(form));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.fields.url = url;

    const schema = yup.object().shape({
      url: yup.string().url().nullable().notOneOf(state.urlUsedPreviosly),
    });
    schema
      .validate(state.fields)
      .then(() => {
        watchedState.fieldValidaty = 'valid';
        watchedState.urlUsedPreviosly.push(url);
      })
      .catch((err) => {
        watchedState.error = err;
        watchedState.fieldValidaty = 'invalid';
      });
  });
};
