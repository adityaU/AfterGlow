import { apiV2 } from 'boot/axios';
import { resultsStore } from 'stores/results';
import apiConfig from 'src/helpers/apiConfig';
import hash from 'src/helpers/hash';
import { sessionStore } from 'src/stores/session';

const results = resultsStore();
const fetchVizResults = async function(
  vizID,
  questionID,
  payload,
  query,
  callback,
  key
) {
  callback(null, '', true);
  if (payload?.visualization?.queryTerms?.details?.hasOwnProperty('details')) {
    payload.visualization.queryTerms = payload.visualization.queryTerms.details;
  }
  if (payload?.visualization?.queryTerms) {
    payload.visualization.query_terms = payload.visualization.queryTerms;
  }
  if (payload?.visualization?.rendererType) {
    payload.visualization.renderer_type = payload.visualization.rendererType;
  }
  const url = vizID
    ? 'visualizations/' + vizID + '/results'
    : 'visualizations/results';
  key = key
    ? key
    : await hash(
      'payload=' +
      JSON.stringify(payload) +
      '&questionID=' +
      questionID +
      '&vizID=' +
      vizID
    );
  apiV2
    .post(url, payload, apiConfig(query.token))
    .then((response) => {
      results.pushResults(response.data.data, key);
      callback(key, response.data.query, false);
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status > 500) {
        if (!error.data.error) {
          error.data.error = { message: 'Server is Unavailable at the moment' };
        }
        error.response.data.error.hideFromViewer = true;
      }
      results.pushResults(error.response.data.error, key);
      callback(key, error.response.data.query, false);
    });
};

const fetchViz = function(vizID, query, callback) {
  callback(null, true);

  apiV2
    .get('/visualizations/' + vizID, apiConfig(query.token))
    .then((response) => {
      callback(makeVisualizationFromResponse(response.data.data), false);
    })
    .catch((error) => {
      console.log(error);
      callback({}, false);
    });
};

const downloadVizData = function(payload, query, callback) {
  callback(null, null, true);
  apiV2
    .post('/visualizations/create_csv', payload, apiConfig(query.token))
    .then((response) => {
      callback(true, response.data.data, false);
    })
    .catch((error) => {
      console.log(error);
      callback(false, error.response.data.error, false);
    });
};

const makeVisualizationFromResponse = function(viz) {
  return {
    id: viz.id,
    name: viz.name,
    settings: viz.settings,
    rendererType: viz.renderer_type,
    queryTerms: viz.query_terms,
    questionID: viz.question_id,
  };
};

const searchVisualizations = async function(query, callback) {
  const session = sessionStore();
  callback(null, true);
  const response = await apiV2.get(
    '/visualizations/search?q=' + query,
    apiConfig(session.token)
  );
  return callback(response.data.data, false);
};

export {
  fetchVizResults,
  makeVisualizationFromResponse,
  fetchViz,
  downloadVizData,
  searchVisualizations,
};
