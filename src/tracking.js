import axios from 'axios';
import parser from './parser';

export default (state, url, i18n, feedId) => {
  const modifiedUrl = `${i18n.t('allorigins')}${encodeURIComponent(url)}`;

  const iter = () => {
    axios
      .get(modifiedUrl)
      .then((response) => parser(state, response.data, 'existing', feedId))
      .catch((err) => console.log(err))
      .then(() => setTimeout(() => iter(), 5000));
  };
  setTimeout(() => iter(), 5000);
};
