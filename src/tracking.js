import axios from 'axios';
import parser from './parser';
import add from './addToState';
import proxy from './proxy';

export default (state, url, feedId) => {
  const modifiedUrl = proxy(url);

  const iter = () => {
    axios
      .get(modifiedUrl)
      .then((response) => parser(response.data))
      .then((channel) => add(state, channel, 'existing', feedId))
      .catch((err) => console.log(err))
      .then(() => setTimeout(() => iter(), 5000));
  };
  setTimeout(() => iter(), 5000);
};
