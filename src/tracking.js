import axios from 'axios';
import parser from './parser';
import func from './func';

export default (state, url, i18n, feedId) => {
  const modifiedUrl = `${i18n.t('allorigins')}${encodeURIComponent(url)}`;

  const iter = () => {
    axios
      .get(modifiedUrl)
      .then((response) => parser(response.data))
      .then((channel) => func(state, channel, 'existing', feedId))
      .catch((err) => console.log(err))
      .then(() => setTimeout(() => iter(), 5000));
  };
  setTimeout(() => iter(), 5000);
};
