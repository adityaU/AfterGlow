import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';

const fetchSettings = async function (callback) {
  const session = sessionStore();
  apiV2
    .get('settings', apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const saveSettings = async function (payload, callback) {
  const session = sessionStore();
  const id = payload.id;
  payload.value =
    (payload.value || payload.value === false) && payload.value.toString();
  apiV2
    .patch('settings/' + id, payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

export { fetchSettings, saveSettings };
