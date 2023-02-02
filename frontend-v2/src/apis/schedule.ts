
import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'

const saveDashboardSchedule = async function(id, payload, token, callback) {
  callback(null, true)
  api.post('dashboards/' + id + '/schedule', payload, apiConfig(token)).then((response) => {
    callback(response.data.schedule, false)
  }).catch(() => {
    callback([], false)
  })

}

const fetchDashboardSchedule = async function(id, token, callback) {
  callback(null, true)
  api.get('dashboards/' + id + '/schedule', apiConfig(token)).then((response) => {
    callback(response.data.schedule, false)
  }).catch(() => {
    callback([], false)
  })

}
export { saveDashboardSchedule, fetchDashboardSchedule } 
