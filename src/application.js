/* eslint-disable no-param-reassign, no-console  */
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import view from './view.js';
import resources from './locales/index.js';
import parse from './parse.js';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback'),
  button: document.querySelector('[type="submit"]'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  modal: document.querySelector('.modal'),
};

const proxyLoad = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const state = {
  form: {
    status: '',
    error: '',
  },
  loadingProcces: {
    status: '',
    error: '',
  },
  feeds: [],
  posts: [],
  openIdModal: null,
  ulOpened: [],
};

const checkNewPosts = (watchedState) => {
  const { feeds } = watchedState;
  feeds.forEach((feed) => {
    axios.get(proxyLoad(feed.url))
      .then((response) => {
        const { posts } = parse(response.data.contents);
        const newPosts = posts.filter((post) => (
          !watchedState.posts.some((item) => item.title === post.title)
        ));
        watchedState.posts.unshift(...newPosts);
        // console.log(state);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  setTimeout(() => checkNewPosts(watchedState), 5000);
};

const getFeedAndPosts = (watchedState, url) => {
  axios.get(proxyLoad(url))
    .then((response) => {
      const { feed, posts } = parse(response.data.contents);
      feed.url = url;
      feed.id = _.uniqueId();
      watchedState.loadingProcces.status = 'succsess';
      watchedState.feeds.unshift(feed);
      watchedState.posts.unshift(...posts);
      // console.log(state);
      checkNewPosts(watchedState);
    })
    .catch((e) => {
      watchedState.loadingProcces.error = (e.isAxiosError) ? 'networkError' : e.message;
      watchedState.loadingProcces.status = 'failed';
    });
};

const validateSchema = (links) => {
  const schema = yup.string().notOneOf(links, 'notOneOf').url('invalidURL');
  return schema;
};

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    resources,
  });

  const watchedState = onChange(state, view(state, elements, i18n));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const links = watchedState.feeds.map((feed) => feed.url);
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.status = 'processing';

    validateSchema(links).validate(url)
      .then(() => {
        getFeedAndPosts(watchedState, url);
      })
      .catch((error) => {
        watchedState.form.error = error.message;
        watchedState.form.status = 'failed';
      });
  });

  elements.posts.addEventListener('click', (event) => {
    const { id } = event.target.dataset;
    if (!watchedState.ulOpened.includes(id)) {
      watchedState.ulOpened.push(id);
    }
    if (id) {
      watchedState.openIdModal = id;
    }
  });
};
