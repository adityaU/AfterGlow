import { api } from 'boot/axios';

const login = async function(email, password, callback) {
  callback(null, true)
  const payload = { email: email, password: password }
  api.post('login/', payload, {}).then((response) => {
    callback(response.data, false)
  }).catch((error) => {
    callback(error, false)
  })
}

const loginWithGoogle = async function(callback) {
  callback(null, true)
  api.get('auth/google', {}).then((response) => {
    callback(response.data, false)
  }).catch((error) => {
    callback(error, false)
  })
}

const loginCallback = async function(code, provider, callback) {
  callback(null, true)
  const payload = {code: code, provider: provider}
  api.post('callback/google', payload, {}).then((response) => {
    callback(response.data, false)
  }).catch((error) => {
    callback(error, false)
  })
}


export {login, loginWithGoogle, loginCallback}
