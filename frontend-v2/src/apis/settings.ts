
import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'
import {sessionStore} from 'stores/session'

const fetchSettings = async function(callback) {
  const session = sessionStore()
  api.get('settings', apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const saveSettings = async function(payload, callback) {
  const session = sessionStore()
  const id = payload.id
  payload.value = (payload.value || payload.value === false) && payload.value.toString()
  payload = {data: {attributes: payload, type: "settings", id: id}}
  api.patch('settings/' + id, payload,  apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

export {fetchSettings, saveSettings}
