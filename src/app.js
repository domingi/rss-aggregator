import './styles.scss';
import '../index.html';

import { string, setLocale } from 'yup';
import view from './view.js';

setLocale({
  string: {
    default: 'Ошибка данных, введите верный URL',
    url: 'Это не URL',
  },
  mixed: {
    notOneOf: 'Этот URL уже в списке фида. Введите другой адрес',
  },
});

export default () => {
  const form = document.querySelector('form');
  const state = {
    form: {
      state: 'valid',
      error: [],
    },
    feed: [],
  };

  const watchedState = view(state);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userSchema = string().url().notOneOf(state.feed);

    const formData = new FormData(e.target);
    const url = formData.get('url');
    try {
      await userSchema.validate(url);
      state.feed.push(url);
      watchedState.form.error = '';
      watchedState.form.state = 'valid';
    } catch (error) {
      watchedState.form.error = error.errors;
      watchedState.form.state = 'invalid';
      watchedState.form.state = '';
      console.log(state);
    }
  });
};
