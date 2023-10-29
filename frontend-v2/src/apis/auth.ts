import { api, apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

const verifyToken = async function (token, onSuccess, onError) {
  apiV2
    .post('/verify_token/', { token: token }, apiConfig(token))
    .then((response) => {
      onSuccess(response.data);
    })
    .catch((error) => {
      console.log(error);
      onError();
    });
};

export { verifyToken };
