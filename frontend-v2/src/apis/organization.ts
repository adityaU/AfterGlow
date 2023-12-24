import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';

const fetchOrganizations = async function (callback) {
  const session = sessionStore();
  apiV2
    .get('organizations', apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const saveOrganization = async function (payload, callback) {
  const id = payload.id;
  const session = sessionStore();
  apiV2
    .patch('organizations/' + id, payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const createOrganization = async function (payload, callback) {
  const session = sessionStore();
  payload.is_deactivated = payload.is_deactivated || false;
  apiV2
    .post('organizations', payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

const fetchOrgSettings = async function (orgID, callback) {
  const session = sessionStore();
  apiV2
    .get(
      'organization_settings?organization_id=' + orgID,
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

const saveOrgSettings = async function (payload, callback) {
  const session = sessionStore();
  const id = payload.id;
  payload.value =
    (payload.value || payload.value === false) && payload.value.toString();
  apiV2
    .patch('organization_settings/' + id, payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
};

export {
  fetchOrganizations,
  saveOrganization,
  createOrganization,
  fetchOrgSettings,
  saveOrgSettings,
};
