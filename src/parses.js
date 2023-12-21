import uniqueId from 'lodash/uniqueId';

export default (state, data) => {
  if (data.contents) {
    const parser = new DOMParser();
    const document = parser.parseFromString(data.contents, 'text/xml');

    const id = uniqueId();
    const channelTitle = document.querySelector('channel > title').textContent;
    const channelDescription = document.querySelector('channel > description').textContent;
    state.feeds.push({
      id,
      title: channelTitle,
      description: channelDescription,
    });
    const items = document.querySelectorAll('item');
    items.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;
      const postId = uniqueId();
      state.posts.push({
        feedId: id,
        postId,
        title,
        description,
        link,
      });
    });
    const state1 = state;
    state1.activeFeed = id;
  } else {
    throw new Error(data.status.error.name);
  }
};
