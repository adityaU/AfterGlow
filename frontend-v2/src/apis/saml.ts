import { apiV2 } from 'src/boot/axios';
import apiConfig from 'src/helpers/apiConfig';
import { sessionStore } from 'stores/session';
const fetchSamlMetadata = async function(callback) {
  const session = sessionStore();
  apiV2
    .get('saml/metadata', apiConfig(session.token))
    .then((response) => {
      callback(response.data, false);
    })
    .catch((error) => {
      console.error(error);
      callback(null, false);
    });
}

export { fetchSamlMetadata }
