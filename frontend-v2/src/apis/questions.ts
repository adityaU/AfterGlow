import {resultsStore} from 'src/stores/results'
import { api } from 'boot/axios';
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

const results = resultsStore()
const fetchQuestionResults =  async function(payload, token, callback ) {
      callback(null, true)
      const key = await hash(JSON.stringify(payload))
      api.post('visualizations/results', payload, apiConfig(token)).then((response) => {
        results.pushResults(response.data.data, key)
        callback(key, false)
      }).catch((error) => {
        if (error.response.status === 500){
                results.pushResults({message: "Something went wrong. Please check the query"}, key)
                callback(key, false)
                return
        }
        results.pushResults(error.response.data.error, key)
        callback(key, false)
      })

    }

const fetchQuestion =  async function(id, token, callback ) {
      callback(null, true)
      api.get('questions/' + id, apiConfig(token)).then((response) => {
        callback(response.data.data.attributes, false)
      })
    }

const saveQuestion = async function(id, payload, token, callback){

      callback(null, true)
      payload = {data: {type: 'questions', attributes: payload}}
      api.put('questions/' + id, payload, apiConfig(token)).then((response) => {
         response.data.data.attributes.id = response.data.data.id
         callback(response.data.data.attributes, false)
      }).catch(_ => {
        callback(null, false)
      })
}

export {fetchQuestionResults, fetchQuestion, saveQuestion};
