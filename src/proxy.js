export default (url, base = 'https://allorigins.hexlet.app/get') => {
  const newUrl = new URL(base);
  const enteredUrl = encodeURI(url);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', enteredUrl);
  return newUrl;
};
