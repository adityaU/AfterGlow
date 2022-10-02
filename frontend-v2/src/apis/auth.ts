
import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'

const verifyToken = async function(token, onSuccess, onError){
  api.post('/verify-token/', {token: token}, apiConfig(token)).then((response)=> {
    onSuccess(response.data)
  }).catch(_ => {
    onError()
  })
}

export {verifyToken}
