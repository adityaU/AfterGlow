import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

import { sessionStore } from 'stores/session';
import { getRandomColor } from 'src/helpers/colorGenerator';

const fetchTags = async function (callback) {
  const session = sessionStore();
  apiV2
    .get('tags', apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const searchTags = async function (q, callback) {
  const session = sessionStore();
  const resp = await apiV2.get('tags/search?q=' + q, apiConfig(session.token));

  return callback(resp.data.data);
};

const fetchTagsByIDs = async function (ids, callback) {
  const session = sessionStore();
  apiV2
    .get(
      'tags?filter=' + JSON.stringify({ id: ids.join(',') }),
      apiConfig(session.token)
    )
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const createTag = async function (tag, callback) {
  const session = sessionStore();
  tag.color = getRandomColor(tag.name, true);
  const response = await apiV2.post('tags', tag, apiConfig(session.token));
  return callback(response.data.data, false);
};

export { fetchTags, createTag, fetchTagsByIDs, searchTags };
