import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'

const fetchRecipients = async function(query, token, callback) {
  api.get('recipients?query=' + query, apiConfig(token)).then((response) => {
    callback(response.data.recipients, false)
  }).catch(error => {
    console.log(error)
    callback([], false)
  })

}

export { fetchRecipients } 
