import onChange from 'on-change';

export default (state) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const error = document.querySelector('#error');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      if (value === 'invalid') {
        error.textContent = state.form.error;
        input.classList.add('is-invalid');
        input.focus();
      }
      if (value === 'valid') {
        error.textContent = state.form.error;
        input.classList.remove('is-invalid');
        form.reset();
        input.focus();
      }
    }
  });
  return watchedState;
};
