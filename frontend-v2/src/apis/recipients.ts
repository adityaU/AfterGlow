import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

const fetchRecipients = async function (query, token, callback) {
  const response = await apiV2.get(
    'recipients?query=' + query,
    apiConfig(token)
  );
  return callback(response.data.data, false);
};

export { fetchRecipients };
