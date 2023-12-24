import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

import { sessionStore } from 'stores/session';

const autocomplete = async function (query, prefix, database_id, callback) {
  const session = sessionStore();
  apiV2
    .get(
      '/sql_autocomplete?query=' +
        query +
        '&prefix=' +
        prefix +
        '&database_id=' +
        database_id,
      apiConfig(session.token)
    )
    .then((response) => {
      callback(response.data.data);
    })
    .catch((error) => {
      console.log(error);
      callback();
    });
};

// const searchTimezones = async function (query, callback) {

//   const session = sessionStore();
//   try{
//   let resp = await apiV2
//     .get(
//       '/sql_autocomplete?query=' +
//         query +
//         '&prefix=' +
//         prefix +
//         '&database_id=' +
//         database_id,
//       apiConfig(session.token)
//     )

//     return callback(resp.data.data, false)

//   }catch(e){
//     console.log(e)
//     return callback([], false)

//   }
// }

export { autocomplete };
