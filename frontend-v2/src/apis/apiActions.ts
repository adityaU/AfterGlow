import { apiActionStore } from 'stores/apiActions';
import hash from 'src/helpers/hash';
import { apiV2 } from 'boot/axios';
import apiConfig from 'src/helpers/apiConfig';
const apiAction = apiActionStore();
const fetchQuestionApiActions = async function(
  questionID,
  token,
  oldKey,
  callback
) {
  callback(null, true);
  const key = await hash('questionID=' + questionID + '&key=' + oldKey);
  const url = 'api_actions?question_id=' + questionID;
  apiV2.get(url, apiConfig(token)).then((response) => {
    apiAction.push(response.data.data, key);
    callback(key, false);
  });
};

const deleteApiAction = async function(id, token, callback) {
  const url = 'api_actions/' + id;

  apiV2
    .delete(url, apiConfig(token))
    .then(() => callback(true, false))
    .catch(() => {
      callback(false, false);
    });
};

const createApiAction = async function(payload, token, callback) {
  const url = 'api_actions';
  payload.question_id = +payload.question_id;
  apiV2
    .post(url, payload, apiConfig(token))
    .then((response) => {
      callback(true, false, response.data.data);
    })
    .catch((error) => {
      callback(false, false, error.response.data);
    });
  return;
};

const updateApiAction = async function(payload, token, callback) {
  const url = 'api_actions/' + payload.id;

  apiV2
    .put(url, payload, apiConfig(token))
    .then((response) => {
      callback(true, false, response.data.data);
    })
    .catch((error) => {
      callback(false, false, error.response.data);
    });
  return;
};

const sendRequest = async function(id, payload, token, callback) {
  const url = 'api_actions/' + id + '/send_request';
  apiV2
    .post(url, payload, apiConfig(token))
    .then((response) => {
      callback(true, response.data.data, false);
    })
    .catch((error) => {
      callback(true, error, false);
    });
};

export {
  fetchQuestionApiActions,
  deleteApiAction,
  updateApiAction,
  sendRequest,
  createApiAction,
};
