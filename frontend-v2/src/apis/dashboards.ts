import {dashboardsStore} from 'src/stores/dashboard'
import { api } from 'boot/axios';
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

const dashboards = dashboardsStore();
const fetchDashboard = async function(id, payload, token, callback){
  callback(null, true)
  const key = await hash('payload=' + JSON.stringify(payload))
  api.get('dashboards/' + id , apiConfig(token)).then((response) => {
    response.data.data.attributes.id = id
    dashboards.push(response.data.data.attributes, key)
    callback(key, false)
  }).catch(error => {
    dashboards.push(error.response.data, key)
    callback(key, false)
  })

}

const fetchDashboards = async function(token, callback){
  callback(null, true)
  api.get('dashboards/' , apiConfig(token)).then((response) => {
    const dashboards = response.data.data.map(d => {
      d.attributes.id = d.id
      return d.attributes
    })
    callback(dashboards, false)
  }).catch(error => {
    callback(null, false)
  })

}

const saveDashboard = async function(id, payload, token, callback){
  callback(true)
  payload = {data : {type: 'dashboards', attributes: payload}}
  api.put('dashboards/' + id , payload, apiConfig(token)).then((response) => {
    callback(false)
  }).catch(_ => {
    callback(false)
  })
}


const createDashboard = async function(payload, token, callback){
  callback(null, true)
  payload = {data : {type: 'dashboards', attributes: payload}}
  api.post('dashboards/' , payload, apiConfig(token)).then((response) => {
    response.data.data.attributes.id = response.data.data.id
    callback(response.data.data.attributes, false)
  }).catch(_ => {
    callback(null, false)
  })
}
export {fetchDashboard, fetchDashboards, saveDashboard, createDashboard};



