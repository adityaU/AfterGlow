
import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'

import { sessionStore } from 'stores/session'

const autocomplete = async function(query, prefix, database_id, callback){

  const session = sessionStore()
  api.get('/sql_autocomplete?query=' + query + '&prefix=' + prefix + '&database_id=' + database_id, apiConfig(session.token)).then((response)=> {
    callback(response.data)
  }).catch(error => {
    console.log(error)
    callback()
  })
}

export {autocomplete}
