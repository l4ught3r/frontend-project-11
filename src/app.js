import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import render from './render';
import ru from './locales/ru';
import parser from './parser';
import tracking from './tracking';
import add from './add';
import proxy from './proxy';

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const state = {
    fields: {
      url: '',
    },
    feeds: [],
    posts: [],
    error: '',
    urlsUsed: [],
    viewedPost: '',
    state: 'filling',
  };

  const elements = {
    button: document.querySelector('button[type="submit"]'),
    form: document.querySelector('form.rss-form'),
    input: document.querySelector('form.rss-form').elements.url,
  };

  const watchedState = onChange(state, render(state, elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    watchedState.state = 'processing';

    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.fields.url = url;

    yup.setLocale({
      mixed: {
        notOneOf: i18nInstance.t('errors.addedRss'),
        default: 'field_invalid',
      },
      string: {
        url: i18nInstance.t('errors.invalidUrl'),
      },
    });

    const schema = yup.object().shape({
      url: yup.string().url().nullable().notOneOf(state.urlsUsed),
    });

    schema
      .validate(state.fields)
      .then(() => axios.get(proxy(url)))
      .then((response) => parser(response.data))
      .then((channel) => {
        watchedState.urlsUsed.push(url);
        add(url, watchedState, channel);
        setTimeout(() => tracking(watchedState), 5000);
      })
      .catch((err) => {
        watchedState.error = err;
        console.log(err);
      });
    watchedState.state = 'filling';
  });
};
