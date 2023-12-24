import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

const verifyToken = async function (token, onSuccess, onError) {
  try {
    const resp = await apiV2.post(
      '/verify_token/',
      { token: token },
      apiConfig(token)
    );
    return onSuccess(resp.data);
  } catch (e) {
    console.log(e);
    onError();
  }
};

export { verifyToken };
