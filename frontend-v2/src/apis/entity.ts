
import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'
import { sessionStore } from 'stores/session'

const deleteEntity = async function(entityName, id, callback) {
  callback(true)

  const session = sessionStore()
  api.delete(entityName + 's/' + id, apiConfig(session.token)).then((response) => {
    callback(false)
  }).catch(error => {
    console.log(error)
    callback(false)
  })
}

export { deleteEntity }
