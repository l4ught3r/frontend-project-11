import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import render from './render';
import ru from './locales/ru';
import parser from './parser';
import tracking from './tracking';
import add from './addToState';

const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
});

export default () => {
  const state = {
    fields: {
      url: '',
    },
    feeds: [],
    posts: [],
    newFeedId: '',
    error: '',
    urlUsedPreviosly: [],
    trackingPosts: [],
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
      url: yup.string().url().nullable().notOneOf(state.urlUsedPreviosly),
    });
    schema
      .validate(state.fields)
      .then(() => {
        const modifiedUrl = `${i18nInstance.t('allorigins')}${encodeURIComponent(url)}`;
        return axios.get(modifiedUrl);
      })
      .then((response) => parser(response.data))
      .then((channel) => add(watchedState, channel, 'new'))
      .then((id) => {
        watchedState.newFeedId = id;
        watchedState.urlUsedPreviosly.push(url);
        tracking(watchedState, url, i18nInstance, id);
      })
      .catch((err) => {
        watchedState.error = err;
        console.log(err);
      });
    watchedState.state = 'filling';
  });
};
