import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'
import { sessionStore } from 'stores/session'
import cloneDeep from 'lodash/cloneDeep'


const fetchDatabases = async function(token: any, callback: (arg0: null, arg1: boolean) => void) {
  callback(null, true)
  api.get('/databases?type=json', apiConfig(token)).then((response) => {
    callback(response.data.data, false)
  })
}

const saveDatabase = async function(payload, callback) {
  const session = sessionStore()
  const id = cloneDeep(payload.id)
  payload = { data: { attributes: payload, id: id, type: "databases" } }
  api.patch('databases/' + id, payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const createDatabase = async function(payload, callback) {
  const session = sessionStore()
  payload = { data: { attributes: payload, type: "databases" } }
  api.post('databases/', payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const fetchDatabase = async function(id, token, callback) {
  callback(null, true)
  api.get('/databases/' + id, apiConfig(token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback(response.data.data.attributes, false)
  })
}

const fetchDatabaseWithConfig = async function(id, token, callback) {
  callback(null, true)
  api.get('/databases?id=' + id + '&include_config=true', apiConfig(token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback(response.data.data.attributes, false)
  })
}

const fetchTable = async function(id, token, callback) {
  callback(null, true)
  api.get('/tables/' + id, apiConfig(token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback(response.data.data.attributes, false)
  })
}

const searchTables = async function(id, query, onlyTables, token, callback) {
  callback(null, true)
  api.get('/search_tables?database_id=' + id + "&q=" + query + "&only_tables=" + onlyTables + "&type=json", apiConfig(token)).then((response) => {
    callback(response.data.data, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}


const getColumns = async function(tableID, token, callback) {
  callback(null, true)
  api.get('/search_tables/' + tableID + "?type=json", apiConfig(token)).then((response) => {
    callback(response.data.data, false)
  })
}

const saveColumn = async function(payload, callback) {
  const session = sessionStore()
  const id = cloneDeep(payload.id)
  payload = { data: { attributes: payload, id: id, type: "columns" } }
  api.patch('columns/' + id, payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

const saveTable = async function(payload, callback) {
  const session = sessionStore()
  const id = cloneDeep(payload.id)
  payload = { data: { attributes: payload, id: id, type: "tables" } }
  api.patch('tables/' + id, payload, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}


const syncDatabase = async function(id, callback) {
  const session = sessionStore()
  api.put('databases/' + id + '/sync', {}, apiConfig(session.token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback({ ...response.data.data.attributes, ...(response.data.data.relationships || {}) }, false)
  }).catch(error => {
    console.error(error)
    callback(null, false)
  })
}

export { searchTables, getColumns, fetchDatabases, fetchTable, fetchDatabase, createDatabase, saveDatabase, fetchDatabaseWithConfig, saveColumn, saveTable, syncDatabase }
