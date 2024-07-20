import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';

export const fetchSystemVariables = async function(callback) {
  const session = sessionStore();
  apiV2
    .get('system_variables', apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, true);
    });
};

export const updateSystemVariable = async function(variable, callback) {
  const session = sessionStore();
  apiV2
    .put(`system_variables/${variable.id}`, variable, apiConfig(session.token))
    .then((data) => {
      callback(data.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(false, true);
    });
};

export const createSystemVariable = async function(variable, callback) {
  const session = sessionStore();
  apiV2
    .post('system_variables', variable, apiConfig(session.token))
    .then((data) => {
      callback(data.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(false, true);
    });
};

export const deleteSystemVariable = async function(key, callback) {
  const session = sessionStore();
  apiV2
    .delete(`system_variables/${key}`, apiConfig(session.token))
    .then(() => {
      callback(true, false);
    })
    .catch((error) => {
      console.error(error);
      callback(false, true);
    });
};
