

import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'
import {sessionStore} from 'stores/session'
import cloneDeep from 'lodash/cloneDeep'

const fetchTeams = async function(callback) {
  const session = sessionStore()
  api.get('teams', apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const saveTeam = async function(payload, callback) {
  const session = sessionStore()
  const id = cloneDeep(payload.id)
  payload = {data: {attributes: payload, id: id,  type: "teams"}}
  api.patch('teams/' + id, payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const createTeam = async function(payload, callback) {
  const session = sessionStore()
  payload = {data: {attributes: payload, type: "teams"}}
  api.post('teams/', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const removeDatabase = async function(teamID, dbID, callback) {
  const session = sessionStore()
  const payload = {database_id: dbID}
  api.post('teams/' + teamID + '/remove_database', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}


const addDatabase = async function(teamID, dbID, callback) {
  const session = sessionStore()
  const payload = {database_id: dbID}
  api.post('teams/' + teamID + '/add_database', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const removeUser = async function(teamID, userID, callback) {
  const session = sessionStore()
  const payload = {user_id: userID}
  api.post('teams/' + teamID + '/remove_user', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}


const addUser = async function(teamID, userID, callback) {
  const session = sessionStore()
  const payload = {user_id: userID}
  api.post('teams/' + teamID + '/add_user', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}
export {fetchTeams, saveTeam, createTeam, addDatabase, removeDatabase, addUser, removeUser}
