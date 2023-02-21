import { resultsStore } from 'src/stores/results';
import { api } from 'boot/axios';
import hash from '../helpers/hash';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';

const results = resultsStore();
const fetchQuestionResults = async function (payload, token, callback) {
  callback(null, null, true);
  const key = await hash(JSON.stringify(payload));
  api
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
  api
    .get('questions?q=' + query + '&tag=' + tag, apiConfig(token))
    .then((response) => {
      const questions = response.data.data.map((d) => {
        d.attributes.id = d.id;
        return { ...d.attributes, ...d.relationships };
      });
      callback(questions, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchQuestions = async function (token, callback) {
  callback(null, true);
  api
    .get('questions/', apiConfig(token))
    .then((response) => {
      const questions = response.data.data.map((d) => {
        d.attributes.id = d.id;
        return { ...d.attributes, ...d.relationships };
      });
      callback(questions, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchQuestion = async function (id, token, callback) {
  callback(null, true);
  api
    .get('questions/' + id + '?version=1&share_id=', apiConfig(token))
    .then((response) => {
      response.data.data.attributes.id = response.data.data.id;
      callback(
        {
          ...response.data.data.attributes,
          ...(response.data.data.relationships || {}),
        },
        false
      );
    });
};

const fetchQuestionWithShareID = async function (id, shareID, token, callback) {
  callback(null, true);
  api
    .get('questions/' + id + '?version=1&share_id=' + shareID, apiConfig(token))
    .then((response) => {
      response.data.data.attributes.id = response.data.data.id;
      callback(
        {
          ...response.data.data.attributes,
          ...(response.data.data.relationships || {}),
        },
        false
      );
    });
};

const saveQuestion = async function (id, payload, token, callback) {
  callback(null, true);
  payload = { data: { type: 'questions', attributes: payload } };
  if (id) {
    api
      .put('questions/' + id, payload, apiConfig(token))
      .then((response) => {
        response.data.data.attributes.id = response.data.data.id;
        callback(
          {
            ...response.data.data.attributes,
            ...(response.data.data.relationships || {}),
          },
          false
        );
      })
      .catch((error) => {
        console.log(error);
        callback(null, false);
      });
    return;
  }
  api
    .post('questions/', payload, apiConfig(token))
    .then((response) => {
      response.data.data.attributes.id = response.data.data.id;
      callback(
        {
          ...response.data.data.attributes,
          ...(response.data.data.relationships || {}),
        },
        false
      );
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
};

const addVariable = async function (payload, questionID, callback) {
  const session = sessionStore();
  payload.question_id = questionID;
  callback(null, true);
  payload = { data: { type: 'variables', attributes: payload } };
  api
    .post('variables/', payload, apiConfig(session.token))
    .then((response) => {
      response.data.data.attributes.id = response.data.data.id;
      callback(
        {
          ...response.data.data.attributes,
          ...(response.data.data.relationships || {}),
        },
        false
      );
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchQuestionVariables = async function (id, callback) {
  const session = sessionStore();
  callback(null, true);
  api
    .get('variables?question_id=' + id, apiConfig(session.token))
    .then((response) => {
      callback(
        response.data.data.map((d) => {
          d.attributes.id = d.id;
          return { ...d.attributes, ...d.relationships };
        }),
        false
      );
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
  addVariable,
  fetchQuestions,
  searchQuestions,
  fetchQuestionWithShareID,
  fetchQuestionVariables,
};
