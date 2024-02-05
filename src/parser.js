export default (data) => {
  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(data.contents, 'text/xml');
    const documentItems = document.querySelectorAll('item');

    const title = document.querySelector('channel > title').textContent;
    const description = document.querySelector('channel > description').textContent;

    const items = Array.from(documentItems).map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }));

    const channel = {
      title,
      description,
      items,
      documentItems,
    };

    return channel;
  } catch (err) {
    const parser = new DOMParser();
    const document = parser.parseFromString(data.contents, 'text/xml');
    const errorNode = document.querySelector('parsererror div').textContent;
    throw new Error(errorNode);
  }
};
