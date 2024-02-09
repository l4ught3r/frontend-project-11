import uniqueId from 'lodash/uniqueId';

export default (url, state, channel) => {
  const statee = state;
  const newFeed = { ...channel.feed, id: uniqueId(), url };
  const newPosts = channel.posts.map((post) => ({ ...post, id: uniqueId(), feedId: newFeed.id }));

  statee.feeds = [newFeed, ...state.feeds];
  statee.posts = [...newPosts, ...state.posts];
};
