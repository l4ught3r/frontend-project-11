import _ from 'lodash';
import axios from 'axios';
import parser from './parser';
import proxy from './proxy';

const tracking = (state) => {
  const { feeds, posts } = state;
  const promises = feeds.map(({ url, id }) => axios
    .get(proxy(url))
    .then((response) => parser(response.data))
    .then((channel) => {
      const updatedPosts = channel.posts;
      const oldPosts = posts.filter((post) => post.feedId === id);
      const addedPosts = _.differenceBy(updatedPosts, oldPosts, 'link');
      if (addedPosts.length !== 0) {
        const newPosts = addedPosts.map((post) => ({ ...post, id: _.uniqueId(), feedId: id }));
        state.posts = [...newPosts, ...posts];
      }
    })
    .catch((err) => console.log(err)));
  Promise.all(promises).then(() => setTimeout(() => tracking(state), 5000));
};

export default tracking;
