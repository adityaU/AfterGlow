import { dashboardsStore } from 'src/stores/dashboard';
import { api, apiV2 } from 'boot/axios';
import hash from '../helpers/hash';
import apiConfig from '../helpers/apiConfig';

import { sessionStore } from 'stores/session';

const dashboards = dashboardsStore();
const fetchDashboard = async function(id, payload, token, callback) {
  callback(null, true);
  const key = await hash('id=' + id + '&payload=' + JSON.stringify(payload));
  apiV2
    .get('dashboards/' + id + '?share_id=' + payload.shareID, apiConfig(token))
    .then((response) => {
      dashboards.push(
        response.data.data,
        key
      );
      callback(key, false);
    })
    .catch((error) => {
      console.log(error);
      dashboards.push(error.response.data, key);
      callback(key, false);
    });
};

const fetchDashboardHTML = async function(id, token, callback) {
  callback(null, true);
  api
    .get('dashboards/' + id + '/html', apiConfig(token))
    .then((response) => {
      callback(response.data.html, false);
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
};

const fetchDashboards = async function(token, callback) {
  callback(null, true);
  apiV2
    .get('dashboards', apiConfig(token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
};

const saveDashboard = async function(id, payload, token, callback) {
  callback(true);
  payload = { data: { type: 'dashboards', attributes: payload } };
  api
    .put('dashboards/' + id, payload, apiConfig(token))
    .then((response) => {
      callback(false);
    })
    .catch((_) => {
      console.log(error);
      callback(false);
    });
};

const createDashboard = async function(payload, token, callback) {
  callback(null, true);
  payload = { data: { type: 'dashboards', attributes: payload } };
  api
    .post('dashboards/', payload, apiConfig(token))
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
    .catch((_) => {
      console.log(error);
      callback(null, false);
    });
};

const fetchPossibleVariables = async function(dashboardID, callback) {
  const session = sessionStore();

  api
    .get(
      'dashboards/' + dashboardID + '/possible_variables',
      apiConfig(session.token)
    )
    .then((response) => {
      callback(response.data.variables, false);
    })
    .catch((error) => {
      console.log(error);
      callback(null, false);
    });
};
const fetchVariables = async function(variableIds, callback) {
  if (variableIds.length > 0) {
    const session = sessionStore();

    api
      .get(
        'variables?filter=' + JSON.stringify({ id: variableIds.join(',') }),
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
        console.log(error);
        callback(null, false);
      });
  }
};

const addVariable = async function(payload, dashboardID, callback) {
  const session = sessionStore();
  payload.dashboard_id = dashboardID;
  payload.question_id = null;
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
      console.log(error);
      callback(null, false);
    });
};

const saveVariable = async function(payload, callback) {
  const session = sessionStore();
  callback(null, true);
  payload = { data: { type: 'variables', attributes: payload } };
  api
    .put(
      'variables/' + payload.data.attributes.id,
      payload,
      apiConfig(session.token)
    )
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

const deleteVariable = async function(varID, callback) {
  const session = sessionStore();
  callback(false, true);
  api
    .delete('variables/' + varID, apiConfig(session.token))
    .then((response) => {
      callback(true, false);
    })
    .catch((error) => {
      console.log(error);
      callback(false, false);
    });
};

export {
  fetchDashboard,
  fetchDashboards,
  saveDashboard,
  createDashboard,
  fetchDashboardHTML,
  fetchPossibleVariables,
  fetchVariables,
  addVariable,
  deleteVariable,
  saveVariable,
};
