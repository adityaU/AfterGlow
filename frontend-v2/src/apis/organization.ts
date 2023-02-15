


import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'
import {sessionStore} from 'stores/session'

const fetchOrganizations = async function(callback) {
  const session = sessionStore()
  api.get('organizations', apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id } }
    }), false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })


}

const saveOrganization = async function(payload, callback) {
  const session = sessionStore()
  const id = payload.id
  payload = {data: {attributes: payload, type: "organizations", id: id}}
  api.patch('organizations/' + id, payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })


}

const createOrganization = async function(payload, callback) {
  const session = sessionStore()
  payload = {data: {attributes: payload, type: "organizations"}}
  api.post('organizations/', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })


}

const fetchOrgSettings = async function(orgID, callback) {
  const session = sessionStore()
  api.get('organization_settings?organization_id=' + orgID, apiConfig(session.token)).then((response) => {
    callback(response.data.data.map(v => {
      return { ...v.attributes, ...{ id: v.id }, ...v.relationships }
    }), false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

const saveOrgSettings = async function(payload, callback) {
  const session = sessionStore()
  const id = payload.id
  payload.value = (payload.value || payload.value === false) && payload.value.toString()
  payload = {data: {attributes: payload, type: "organization-settings", id: id}}
  api.patch('organization_settings/' + id, payload,  apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
      console.error(error)
      callback(null, false)
    })
}

export {fetchOrganizations, saveOrganization, createOrganization, fetchOrgSettings, saveOrgSettings}
