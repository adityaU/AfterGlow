import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';
import { sessionStore } from 'stores/session';

const deleteEntity = async function(entityName, id, callback) {
  callback(null, true);

  const session = sessionStore();
  apiV2
    .delete(entityName + 's/' + id, apiConfig(session.token))
    .then((response) => {
      callback(null, false);
    })
    .catch((error) => {
      console.log(error);
      callback(error.response.data, false);
    });
};

export { deleteEntity };
