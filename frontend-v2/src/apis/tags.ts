import { api, apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

import { sessionStore } from 'stores/session';
import { getRandomColor } from 'src/helpers/colorGenerator';

const fetchTags = async function(callback) {
  const session = sessionStore();
  apiV2
    .get('tags', apiConfig(session.token))
    .then((response) => {
      callback(
        response.data.data,
        false
      );
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchTagsByIDs = async function(ids, callback) {
  const session = sessionStore();
  api
    .get(
      'tags?filter=' + JSON.stringify({ id: ids.join(',') }),
      apiConfig(session.token)
    )
    .then((response) => {
      callback(
        response.data.data.map((v) => {
          return { ...v.attributes, ...{ id: v.id } };
        }),
        false
      );
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const createTag = async function(tag, callback) {
  callback(null, true);
  const session = sessionStore();
  tag.color = getRandomColor(tag.name);
  const payload = {
    data: { attributes: tag, type: 'tags' },
  };
  api
    .post('tags/', payload, apiConfig(session.token))
    .then((response) => {
      response.data.data.attributes.id = response.data.data.id;
      callback(response.data.data.attributes, false);
    })
    .catch((error) => {
      console.error(error);
      callback([], false);
    });
};

export { fetchTags, createTag, fetchTagsByIDs };
