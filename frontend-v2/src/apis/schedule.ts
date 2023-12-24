import { api, apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

const saveSchedule = async function (id, entityName, payload, token, callback) {
  callback(null, true);
  apiV2
    .post(entityName + '/' + id + '/schedule', payload, apiConfig(token))
    .then((response) => {
      callback(response.data.schedule, false);
    })
    .catch((error) => {
      console.error(error);
      callback([], false);
    });
};

const fetchSchedule = async function (id, entityName, token, callback) {
  callback(null, true);
  apiV2
    .get(entityName + '/' + id + '/schedule', apiConfig(token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback([], false);
    });
};
export { saveSchedule, fetchSchedule };
