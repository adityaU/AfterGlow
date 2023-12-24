import { resultsStore } from 'src/stores/results';
import { apiV2 } from 'boot/axios';
import hash from '../helpers/hash';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';

const results = resultsStore();
const fetchQuestionResults = async function (payload, token, callback) {
  callback(null, null, true);
  const key = await hash(JSON.stringify(payload));
  apiV2
    .post('visualizations/results', payload, apiConfig(token))
    .then((response) => {
      results.pushResults(response.data.data, key);
      callback(key, response.data.data.query, false);
    })
    .catch((error) => {
      if (error.response.status > 500) {
        if (!error.data.error) {
          error.data.error = { message: 'Server is Unavailable at the moment' };
        }
        error.response.data.error.hideFromViewer = true;
      }
      results.pushResults(error.response.data.error, key);
      callback(key, error?.response?.data?.query, false);
    });
};

const searchQuestions = async function (query, tag, token, callback) {
  callback(null, true);
  apiV2
    .get('questions?q=' + query + '&tag=' + tag, apiConfig(token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchQuestions = async function (token, callback) {
  callback(null, true);
  apiV2
    .get('questions/', apiConfig(token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchQuestion = async function (id, token, callback) {
  callback(null, true);
  apiV2
    .get('questions/' + id + '?version=1&share_id=', apiConfig(token))
    .then((response) => {
      callback(response.data.data, false);
    });
};

const fetchQuestionWithShareID = async function (id, shareID, token, callback) {
  await fetchQuestion(id, token, callback);
  return;
};

const saveQuestion = async function (id, payload, token, callback) {
  callback(null, true);
  if (id) {
    apiV2
      .put('questions/' + id, payload, apiConfig(token))
      .then((response) => {
        callback(response.data.data, false);
      })
      .catch((error) => {
        console.log(error);
        callback(null, false);
      });
    return;
  }
  apiV2
    .post('questions', payload, apiConfig(token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
};

// const addVariable = async function (payload, questionID, callback) {
//   const session = sessionStore();
//   payload.question_id = questionID;
//   callback(null, true);
//   payload = { data: { type: 'variables', attributes: payload } };
//   api
//     .post('variables/', payload, apiConfig(session.token))
//     .then((response) => {
//       response.data.data.attributes.id = response.data.data.id;
//       callback(
//         {
//           ...response.data.data.attributes,
//           ...(response.data.data.relationships || {}),
//         },
//         false
//       );
//     })
//     .catch((error) => {
//       console.error(error);
//       callback(null, false);
//     });
// };

const fetchQuestionVariables = async function (id, callback) {
  const session = sessionStore();
  callback(null, true);
  apiV2
    .get('variables?question_id=' + id, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

export {
  fetchQuestionResults,
  fetchQuestion,
  saveQuestion,
  // addVariable,
  fetchQuestions,
  searchQuestions,
  fetchQuestionWithShareID,
  fetchQuestionVariables,
};
