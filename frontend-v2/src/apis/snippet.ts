import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';

const fetchSnippets = async function (database_id, callback) {
  const session = sessionStore();
  api
    .get('snippets?database_id=' + database_id, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchSnippetRefrencedBy = async function (snippet_id, callback) {
  const session = sessionStore();
  api
    .get('snippets/' + snippet_id + '/referenced_by', apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchSnippet = async function (id, callback) {
  const session = sessionStore();
  api
    .get('snippets/' + id, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const saveSnippet = async function (payload, callback) {
  const session = sessionStore();
  const id = cloneDeep(payload.id);
  api
    .patch('snippets/' + id, payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(error.response, false);
    });
};

const createSnippet = async function (payload, callback) {
  const session = sessionStore();
  api
    .post('snippets/', payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(error.response, false);
    });
};

export {
  fetchSnippets,
  createSnippet,
  saveSnippet,
  fetchSnippet,
  fetchSnippetRefrencedBy,
};
