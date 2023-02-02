import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'


const fetchDatabases = async function(token, callback) {
  callback(null, true)
  api.get('/databases?type=json', apiConfig(token)).then((response) => {
    callback(response.data.data, false)
  })
}

const searchTables = async function(id, query, onlyTables, token, callback) {
  callback(null, true)
  api.get('/search_tables?database_id=' + id + "&q=" + query + "&only_tables=" + onlyTables + "&type=json", apiConfig(token)).then((response) => {
    callback(response.data.data, false)
  })
}


const getColumns = async function(tableID, token, callback) {
  callback(null, true)
  api.get('/search_tables/' + tableID + "?type=json", apiConfig(token)).then((response) => {
    callback(response.data.data, false)
  })
}

export { searchTables, getColumns, fetchDatabases }
