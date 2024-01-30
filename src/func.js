import uniqueId from 'lodash/uniqueId';

export default (state, channel, type, currentFeedId) => {
  const newPostsId = [];

  if (type === 'new') {
    const id = uniqueId();
    state.feeds.push({
      id,
      title: channel.title,
      description: channel.description,
    });
    channel.items.forEach((item) => {
      const postId = uniqueId();
      state.posts.push({
        feedId: id,
        id: postId,
        title: item.title,
        description: item.description,
        link: item.link,
      });
    });
    return id;
  }
  if (type === 'existing') {
    const existingPosts = state.posts.filter(({ feedId }) => feedId === currentFeedId);
    const existingPostsTitles = existingPosts.map(({ title }) => title);
    const newPosts = Array.from(channel.documentItems).filter((item) => {
      const title = item.querySelector('title').textContent;
      return !existingPostsTitles.includes(title);
    });
    newPosts.forEach((post) => {
      const title = post.querySelector('title').textContent;
      const description = post.querySelector('description').textContent;
      const link = post.querySelector('link').textContent;
      const postId = uniqueId();
      newPostsId.push(postId);
      state.trackingPosts.push({
        feedId: currentFeedId,
        id: postId,
        title,
        description,
        link,
      });
      state.posts.push({
        feedId: currentFeedId,
        id: postId,
        title,
        description,
        link,
      });
    });
    return newPostsId;
  }
};
