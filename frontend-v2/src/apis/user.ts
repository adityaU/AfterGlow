
import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'
import {sessionStore} from 'stores/session'
const fetchUsersByIDs = async function(ids, callback) {
  if (ids === [""] || ids.length === 0){
    return
  } 
  const session = sessionStore()
  ids = ids.filter((v, i, a) => a.indexOf(v) === i) 
  api.get('users?filter[id]=' + ids.join(","), apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id } }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })


}

const fetchUsers = async function(callback) {
  const session = sessionStore()
  api.get('users', apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })


}

const deactivateUser = async function(id, callback) {
  const session = sessionStore()
  api.post('users/' + id + '/deactivate', {},  apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const activateUser = async function(id, callback) {
  const session = sessionStore()
  api.post('users/' + id + '/activate', {},  apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const saveUser = async function(payload, callback) {
  const session = sessionStore()
  const id = payload.id
  payload = {data: {attributes: payload, type: "users"}}
  api.put('users/' + id, payload,  apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const saveUserWithPS = async function(payload, ps, callback) {
  const session = sessionStore()
  const id = payload.id
  payload = {data: {attributes: payload, relationships: {permission_sets: {data: [{id: ps.id, type: 'permission_set'}]}}, type: "users"}}
api.put('users/' + id, payload,  apiConfig(session.token)).then((response) => {
  response.data.data.attributes.id = response.data.data.id
  callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
}).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const fetchUserSettings = async function(userID, callback) {
  const session = sessionStore()
  api.get('user_settings?user_id=' + userID, apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const saveUserSettings = async function(payload, callback) {
  const session = sessionStore()
  const id = payload.id
  payload.value = (payload.value || payload.value === false) && payload.value.toString()
  payload = {data: {attributes: payload, type: "user-settings", id: id}}
  api.patch('user_settings/' + id, payload,  apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const fetchPermissionSets = async function(callback) {
  const session = sessionStore()
  api.get('permission_sets', apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const createBulkUsers = async function(emails, psID, callback) {
  const session = sessionStore()
  const payload = {emails: emails, ps_id: psID}
  api.post('create_bulk_users', payload,  apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}


export {fetchUsersByIDs, fetchUsers, saveUser, deactivateUser, activateUser, fetchUserSettings, saveUserSettings, fetchPermissionSets, saveUserWithPS, createBulkUsers}
