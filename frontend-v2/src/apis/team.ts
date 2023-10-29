import { api, apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';

const fetchTeams = async function(callback) {
  const session = sessionStore();
  apiV2
    .get('teams', apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchTeamsByUser = async function(user_id, callback) {
  const session = sessionStore();
  apiV2
    .get('teams?user_id=' + user_id, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const saveTeam = async function(payload, callback) {
  const session = sessionStore();
  apiV2
    .put('teams/' + payload.id, payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const createTeam = async function(payload, callback) {
  const session = sessionStore();
  apiV2
    .post('teams', payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const removeDatabase = async function(teamID, dbID, callback) {
  const session = sessionStore();
  const payload = { database_id: dbID };
  apiV2
    .post(
      'teams/' + teamID + '/remove_database',
      payload,
      apiConfig(session.token)
    )
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

const addDatabase = async function(teamID, dbID, callback) {
  const session = sessionStore();
  const payload = { database_id: dbID };
  apiV2
    .post(
      'teams/' + teamID + '/add_database',
      payload,
      apiConfig(session.token)
    )
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

const removeUser = async function(teamID, userID, callback) {
  const session = sessionStore();
  const payload = { user_id: userID };
  apiV2
    .post('teams/' + teamID + '/remove_user', payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const addUser = async function(teamID, userID, callback) {
  const session = sessionStore();
  const payload = { user_id: userID };
  apiV2
    .post('teams/' + teamID + '/add_user', payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};
export {
  fetchTeams,
  saveTeam,
  createTeam,
  addDatabase,
  removeDatabase,
  addUser,
  removeUser,
  fetchTeamsByUser,
};
