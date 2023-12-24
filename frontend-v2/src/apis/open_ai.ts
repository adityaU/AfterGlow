import { apiV2 } from 'src/boot/axios';
import apiConfig from 'src/helpers/apiConfig';
import { sessionStore } from 'src/stores/session';

const fetchCompletionResponse = async function (prompt, database_id, callback) {
  const session = sessionStore();
  const payload = { database_id: database_id, prompt: prompt };
  callback(null, true);
  apiV2
    .post('ai_complete', payload, apiConfig(session.token))
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(error.data, false);
    });
};

export { fetchCompletionResponse };
