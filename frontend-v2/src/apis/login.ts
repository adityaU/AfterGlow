import { apiV2 } from 'boot/axios';

const login = async function(email, password, callback) {
  callback(null, true);
  const payload = { email: email, password: password };
  apiV2
    .post('login', payload, {})
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      callback(error, false);
    });
};

const loginWithGoogle = async function(callback) {
  callback(null, true);
  apiV2
    .get('auth/google', {})
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      callback(error, false);
    });
};

const loginWithSAML = async function(callback) {
  callback(null, true);
  apiV2
    .get('auth/saml', {})
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      callback(error, false);
    });
};

const loginCallback = async function(code, provider, callback) {
  callback(null, true);
  const payload = { code: code, provider: provider };
  apiV2
    .post('callback/google', payload, {})
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      callback(error, false);
    });
};

const samlLoginCallback = async function(code, callback) {
  callback(null, true);
  apiV2
    .post('saml/acs' + code, {}, {})
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      callback(error, false);
    });
};

const fetchInitConfigurations = async function(callback) {
  callback(null, true);
  apiV2
    .get('init_config', {})
    .then((response) => {
      callback(response.data.data, false);
    })
    .catch((error) => {
      callback(error, false);
    });

};


export { login, loginWithGoogle, loginCallback, loginWithSAML, samlLoginCallback, fetchInitConfigurations }
