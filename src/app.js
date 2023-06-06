import './styles.scss';
import '../index.html';
import { string, setLocale } from 'yup';
import i18next from 'i18next';
import ru from '../locales/ru.js';

import view from './view.js';

const renderText = (i18nInstance) => {
  document.querySelector('h1').textContent = i18nInstance.t('h1');
  document.querySelector('p.lead').textContent = i18nInstance.t('lead');
  document.querySelector('label').textContent = i18nInstance.t('label');
  document.querySelector('#example').textContent = i18nInstance.t('example');
  document.querySelector('#buttonAdd').textContent = i18nInstance.t('buttonAdd');
  document.querySelector('#buttonReadAll').textContent = i18nInstance.t('buttonReadAll');
  document.querySelector('#buttonHide').textContent = i18nInstance.t('buttonHide');
};

export default () => {
  const state = {
    form: {
      state: 'valid',
      error: [],
    },
    feed: [],
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(renderText(i18nInstance));

  setLocale({
    string: {
      default: i18nInstance.t('errors.default'),
      url: i18nInstance.t('errors.url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('errors.notOneOf'),
    },
  });

  const form = document.querySelector('form');
  const watchedState = view(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userSchema = string().url().notOneOf(state.feed);

    const formData = new FormData(e.target);
    const url = formData.get('url');
    userSchema.validate(url)
      .then(() => {
        state.feed.push(url);
        watchedState.form.error = '';
        watchedState.form.state = 'valid';
      })
      .catch((error) => {
        watchedState.form.error = error.errors;
        watchedState.form.state = 'invalid';
        state.form.state = '';
      });
  });
};
