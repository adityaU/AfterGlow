import { api } from 'boot/axios'
import { resultsStore } from 'stores/results'
import apiConfig from 'src/helpers/apiConfig'
import hash from 'src/helpers/hash'

const results = resultsStore()
const fetchVizResults = async function(vizID, questionID, payload, query, callback, key) {
  callback(null, "",  true)
  const url = vizID ? 'visualizations/' + vizID + '/results' : 'visualizations/results'
  key = key ? key : await hash("payload=" + JSON.stringify(payload) + "&questionID=" + questionID + "&vizID=" + vizID)
  api.post(url, payload, apiConfig(query.token)).then((response) => {
    results.pushResults(response.data.data, key)
    callback(key, response.data.query, false)
  }).catch((error) => {
      console.log(error)
      if (error.response.status > 500) {

        if (!error.data.error) {
          error.data.error = {message: "Server is Unavailable at the moment"}
        }
        error.response.data.error.hideFromViewer = true
      }
      results.pushResults(error.response.data.error, key)
      callback(key, error.response.data.query, false)
    })
}

const fetchViz = function(vizID, query, callback) {
  callback(null, true)
  api.get('/visualizations/' + vizID, apiConfig(query.token)).then((response) => {
    callback(makeVisualizationFromResponse(response.data.visualization), false)
  }).catch((error) => {
      console.log(error)
      callback({}, false)
    })
}

const downloadVizData = function(payload, query, callback) {
  callback(null, true)
  api.post('/visualizations/create_csv', payload, apiConfig(query.token)).then((response) => {
    callback(true, false)
  }).catch((_) => {
      console.log(error)
      callback(false, false)
    })
}



const makeVisualizationFromResponse = function(viz) {
  return {
    id: viz.id,
    name: viz.name,
    settings: viz.settings,
    rendererType: viz.renderer_type,
    queryTerms: viz.query_terms,
    questionID: viz.question_id
  }

}


export { fetchVizResults, makeVisualizationFromResponse, fetchViz, downloadVizData }
