import uniqueId from 'lodash/uniqueId';

export default (url, state, channel) => {
  const newFeed = { ...channel.feed, id: uniqueId(), url };
  const newPosts = channel.posts.map((post) => ({ ...post, id: uniqueId(), feedId: newFeed.id }));

  state.feeds = [newFeed, ...state.feeds];
  state.posts = [...newPosts, ...state.posts];
};
