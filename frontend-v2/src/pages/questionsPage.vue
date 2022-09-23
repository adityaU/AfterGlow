<template>
  <!-- -->
  <AGLoader text="Crunching Data" v-if="!dataLoaded" class="tw-bg-white tw-shadow-sm tw-rounded-sm" />
  <div class="tw-h-full tw-w-full tw-flex" v-if="dataLoaded">
    <BaseDataRenderer ref="root" :resultsKey="resultsKey" :dataLoaded="dataLoaded"
      v-model:visualizations="visualizations" @deleteViz="deleteViz"
      :apiActionKeyQuesLevel="apiActionKeyQuesLevel"
      :apiActionKeyVizLevel="apiActionKeyVizLevel"
      :queryKey="queryKey" :questionID="questionID"
      @fetchVizResults="refreshVizResults" :loading="loading"
      @updateApiActions="fetchQuestionApiActions"
      @updateViz="(viz) => updateVizResults(viz, true)" :finalQuery="finalQuery"></BaseDataRenderer>
  </div>
</template>

<script >
import BaseDataRenderer from 'components/dataRenderers/base.vue';
import AGLoader from 'components/utils/loader.vue'
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { resultsStore } from 'stores/results'
import { apiActionStore } from 'stores/apiActions'
import { queryStore } from 'stores/query'
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

import { _ } from 'lodash'


export default {
  name: 'QuestionPage',
  components: { BaseDataRenderer, AGLoader },

  data() {
    const route = useRoute();
    const query = route.query
    const results = resultsStore();
    return {
      resultsKey: null,
      dataLoaded: false,
      visualizations: { details: null },
      loading: false,
      query: query,
      params: route.params,
      payload: JSON.parse(query.payload),
      resultsStore: results,
      apiActionStore: apiActionStore(),
      queryKey: null,
      questionID: null,

    }
  },
  async created() {
    if (this.payload && !this.payload.empty) {
      this.queryKey = await hash(this.query)
      queryStore().push(this.query, this.queryKey)
      let questionID = this.params.id || this.query.question_id || null
      this.questionID = questionID
      this.payload.question_id = questionID
      if (questionID != null && questionID != 'null') {
        this.fetchQuestionApiActions(questionID)
        api.get('visualizations' + "?question_id=" + questionID, apiConfig(this.query.token)).then((response) => {
          this.fetchVizResults(response)
          this.updateVisulaization(response)
        })
      } else if (this.payload.database === null) {
        this.dataLoaded = true
        this.resultsKey = null
      }else{
        this.fetchQuestionResults()
      }
      this.dataLoaded = true
    } else {
      this.resultsKey = 'empty'
      this.dataLoaded = true
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage)
  },
  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage)
  },

  methods: {
    async fetchQuestionApiActions(){
    this.loading = true
      const questionID = this.questionID
      let key = await hash("questionID=" + questionID + "&key=" + this.apiActionKeyQuesLevel)
      const url = "api_actions?question_id=" + questionID 
      api.get(url, apiConfig(this.query.token)).then((response) => {
        this.apiActionStore.push(response.data.api_actions, key)
        this.apiActionKeyQuesLevel = key
        this.loading = false
      })
    },
    fetchVizResults(response, forced) {
      if (response.data.visualizations.length === 0) {
        this.fetchQuestionResults()
        return
      }
      const viz = response.data.visualizations[0]
      this.updateVizResults(viz, forced)
    },

    refreshVizResults(viz){ 
      let vizTerms = viz.queryTerms
      let payload = {}
      if (this.payload) {
        payload = _.cloneDeep(this.payload)
      }
      payload.visualization = viz
      hash("payload=" + JSON.stringify(payload) + "&questionID=" + this.query.question_id || this.params.id + "&vizTerms=" + vizTerms).then((key) => {
        if (this.resultsStore.getResults(key)){
          this.resultsKey = key
          return
        }
        this.updateVizResults(viz)
      })
    },


    async updateVizResults(viz, forced) {
      this.loading = true
      this.resultsKey = null
      let vizID = viz.id
      const url = vizID ? 'visualizations/' + vizID + '/results' : 'visualizations/results'
      let payload = {}
      if (this.payload) {
        payload = _.cloneDeep(this.payload)
      }
      if (forced) {
        payload.forced = true
      }
      payload.visualization = viz
      let key = await hash("payload=" + JSON.stringify(payload) + "&questionID=" + this.query.question_id || this.params.id + "&vizID=" + vizID)
      api.post(url , payload, apiConfig(this.query.token)).then((response) => {
        this.resultsStore.pushResults(response.data.data, key)
        this.resultsKey = key
        this.loading = false
      }).catch((error) => {
        this.resultsStore.pushResults(error.response.data.error, key)
        this.resultsKey = key
        this.loading = false
      })
    },


    async fetchQuestionResults() {
      this.loading = true
      this.resultsKey = null
      let key = await hash(JSON.stringify(this.payload))
      api.post('visualizations/results', this.payload, apiConfig(this.query.token)).then((response) => {
        this.resultsStore.pushResults(response.data.data, key)
        this.loading = false
        this.resultsKey = key
      }).catch((error) => {
        this.resultsStore.pushResults(error.response.data.error, key)
        this.resultsKey = key
        this.loading = false
      })

    },
    receiveMessage(event) {
      if (event.data.message == 'save_visualizations') {
        this.save(event.data.question_id)
        return 
      }

      if (event.data.message == 'refresh') {
        let currentViz = this.visualizations && this.visualizations.details && this.visualizations.details.details.filter(viz => viz && viz.current)
        currentViz = currentViz && currentViz.length === 1 ? currentViz[0] : null
        currentViz && this.updateVizResults(currentViz, true)
        return 
      }

    },

    updateVisulaization(response) {

      if (response.data && response.data.visualizations && response.data.visualizations.length >= 1) {
        this.visualizations = {
          towardsBaseRenderer: true, details: {
            details: response.data.visualizations.map((viz) => {
              return {
                id: viz.id,
                name: viz.name,
                settings: viz.settings,
                rendererType: viz.renderer_type,
                queryTerms: viz.query_terms
              }
            })
          }
        }
        return
      }
      this.visualizations = {details: null} 
    },

    deleteViz(index) {
      if (this.visualizations.details.details.length === 1) {
        return
      }

      const toBeDeleted = this.visualizations.details.details[index]
      if (toBeDeleted.id) {
        api.delete('visualizations/' + toBeDeleted.id, apiConfig(this.query.token))
      }

      this.visualizations.details.details.splice(index, 1)
      this.visualizations.towardsBaseRenderer = true
    },

    save(question_id) {
      if (!question_id) {
        return
      }
      this.dataLoaded = false
      const url = 'visualizations'
      const payload = { question_id: question_id, visualizations: this.visualizations && this.visualizations.details && this.visualizations.details.details }
      if (payload.visualizations) {

        api.post(url, payload, apiConfig(this.query.token)).then((response) => {
          this.updateVisulaization(response)
          this.dataLoaded = true
        }).catch((error) => {
          this.visualizations = { details: null }
          this.dataLoaded = true
        })
      }
    }
  }
}
</script>
