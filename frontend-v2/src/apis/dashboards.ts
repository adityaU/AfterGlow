import { dashboardsStore } from 'src/stores/dashboard'
import { api } from 'boot/axios';
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

import { sessionStore } from 'stores/session'

const dashboards = dashboardsStore();
const fetchDashboard = async function(id, payload, token, callback) {
  callback(null, true)
  const key = await hash('payload=' + JSON.stringify(payload))
  api.get('dashboards/' + id, apiConfig(token)).then((response) => {
    response.data.data.attributes.id = id
    dashboards.push({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, key)
    callback(key, false)
  }).catch(error => {
    dashboards.push(error.response.data, key)
    callback(key, false)
  })

}

const fetchDashboardHTML = async function(id, token, callback) {
  callback(null, true)
  api.get('dashboards/' + id + '/html', apiConfig(token)).then((response) => {
    callback(response.data.html, false)
  }).catch(error => {
    callback(null, false)
  })

}

const fetchDashboards = async function(token, callback) {
  callback(null, true)
  api.get('dashboards/', apiConfig(token)).then((response) => {
    const dashboards = response.data.data.map(d => {
      d.attributes.id = d.id
      return { ...d.attributes, ...d.relationships }
    })
    callback(dashboards, false)
  }).catch(error => {
    callback(null, false)
  })

}

const saveDashboard = async function(id, payload, token, callback) {
  callback(true)
  payload = { data: { type: 'dashboards', attributes: payload } }
  api.put('dashboards/' + id, payload, apiConfig(token)).then((response) => {
    callback(false)
  }).catch(_ => {
    callback(false)
  })
}


const createDashboard = async function(payload, token, callback) {
  callback(null, true)
  payload = { data: { type: 'dashboards', attributes: payload } }
  api.post('dashboards/', payload, apiConfig(token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(_ => {
    callback(null, false)
  })
}

const fetchPossibleVariables = async function(dashboardID, callback) {
  const session = sessionStore()

  api.get('dashboards/' + dashboardID + '/possible_variables', apiConfig(session.token)).then((response) => {
    callback(response.data.variables, false)
  }).catch(error => {
    callback(null, false)
  })

}
const fetchVariables = async function(variableIds, callback) {
  if (variableIds.length > 0) {
    const session = sessionStore()


    api.get('variables?filter=' + JSON.stringify({ id: variableIds.join(",") }), apiConfig(session.token)).then((response) => {
      callback(response.data.data.map(v => {
        return { ...v.attributes, ...{ id: v.id } }
      }), false)
    }).catch(error => {
      callback(null, false)
    })

  }

}

const addVariable = async function(payload, dashboardID, callback) {
  const session = sessionStore()
  payload.dashboard_id = dashboardID
  payload.question_id = null
  callback(null, true)
  payload = { data: { type: 'variables', attributes: payload } }
  api.post('variables/', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(_ => {
    callback(null, false)
  })
}

const deleteVariable = async function(varID, callback) {
  const session = sessionStore()
  callback(false, true)
  api.delete('variables/' + varID, apiConfig(session.token)).then((response) => {
    callback(true, false)
  }).catch(_ => {
    callback(false, false)
  })
}

export { fetchDashboard, fetchDashboards, saveDashboard, createDashboard, fetchDashboardHTML, fetchPossibleVariables, fetchVariables, addVariable, deleteVariable };



