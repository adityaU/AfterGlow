import { apiActionStore } from 'stores/apiActions'
import hash from 'src/helpers/hash'
import { apiV2 } from 'boot/axios'
import apiConfig from 'src/helpers/apiConfig'
const apiAction = apiActionStore()
const fetchQuestionApiActions = async function(questionID, token, oldKey, callback) {
  callback(null, true)
  const key = await hash("questionID=" + questionID + "&key=" + oldKey)
  const url = "api_actions?question_id=" + questionID
  apiV2.get(url, apiConfig(token)).then((response) => {
    apiAction.push(response.data.data, key)
    callback(key, false)
  })
}

export { fetchQuestionApiActions }
