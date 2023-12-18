export default (form) => (path, value) => {
  const input = form.elements.url;
  if (path === 'fieldValidaty') {
    if (value === 'invalid') {
      input.classList.add('is-invalid');
    } else if (value === 'valid') {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      form.reset();
      input.focus();
    }
  }
};
