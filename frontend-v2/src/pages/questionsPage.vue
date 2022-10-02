<template>
  <!-- -->
  <AGLoader text="Crunching Data" v-if="!dataLoaded" class="tw-bg-white tw-shadow-sm tw-rounded-sm" />
  <div class="tw-h-full tw-w-full tw-flex" v-if="dataLoaded">
    <BaseDataRenderer ref="root" :resultsKey="resultsKey" :dataLoaded="dataLoaded"
      v-model:visualizations="visualizations" @deleteViz="deleteViz" :apiActionKeyQuesLevel="apiActionKeyQuesLevel"
      :apiActionKeyVizLevel="apiActionKeyVizLevel" :queryKey="queryKey" :questionID="questionID"
      @fetchVizResults="refreshVizResults" :loading="loading" @updateApiActions="fetchQuestionApiActions"
      @updateViz="(viz) => emitToParent(viz, true)" :finalQuery="finalQuery" @download='download'></BaseDataRenderer>
  </div>
  <AGToast v-model:show="toastShow" :type="toastType">{{ toastMessage }}</AGToast>
</template>

<script >
import BaseDataRenderer from 'components/dataRenderers/base.vue';
import AGLoader from 'components/utils/loader.vue'
import AGToast from 'components/utils/toast.vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { resultsStore } from 'stores/results'
import { apiActionStore } from 'stores/apiActions'
import { queryStore } from 'stores/query'
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

import { fetchQuestionResults } from 'src/apis/questions'
import { fetchQuestionApiActions } from 'src/apis/apiActions'
import { fetchVizResults, makeVisualizationFromResponse, downloadVizData } from 'src/apis/visualization'

import { _ } from 'lodash'
import { authMixin } from 'src/mixins/auth'


const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
export default {
  name: 'QuestionPage',
  components: { BaseDataRenderer, AGLoader, AGToast },
  mixins: [authMixin],

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
      toastShow: false,
      toastMessage: "",
      toastType: ""

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
      } else {
        fetchQuestionResults(this.payload, this.query.token, this.setLoadingAndResultsKey)
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
    setLoadingAndResultsKey(key, loading) {
      this.loading = loading
      this.resultsKey = key
    },
    setLoadingAndApiActionKey(key, loading) {
      this.loading = loading
      this.apiActionKeyQuesLevel = key
    },
    async fetchQuestionApiActions() {
      const questionID = this.questionID
      fetchQuestionApiActions(questionID, this.query.token, this.apiActionKeyQuesLevel, this.setLoadingAndApiActionKey)
    },

    fetchVizResults(response, forced) {
      if (response.data.visualizations.length === 0) {
        this.fetchQuestionResults()
        return
      }
      const viz = response.data.visualizations[0]
      this.updateVizResults(viz, forced)
    },

    refreshVizResults(viz) {
      let vizTerms = viz.queryTerms
      let payload = {}
      if (this.payload) {
        payload = _.cloneDeep(this.payload)
      }
      payload.visualization = viz
      hash("payload=" + JSON.stringify(payload) + "&questionID=" + this.query.question_id || this.params.id + "&vizTerms=" + vizTerms).then((key) => {
        if (this.resultsStore.getResults(key)) {
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
      let payload = {}
      if (this.payload) {
        payload = _.cloneDeep(this.payload)
      }
      if (forced) {
        payload.forced = true
      }
      payload.visualization = viz
      fetchVizResults(vizID, this.query.question_id || this.params.id, payload, this.query, this.setLoadingAndResultsKey)

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
    refresh(event){
          let currentViz = this.visualizations && this.visualizations.details && this.visualizations.details.details.filter(viz => viz && viz.current)
          currentViz = currentViz && currentViz.length === 1 ? currentViz[0] : null
          if (event){
              this.query = Object.fromEntries(new URLSearchParams(event.data.query))
              this.payload = JSON.parse(this.query.payload)
              this.payload.question_id = this.questionID
          }
          currentViz && this.updateVizResults(currentViz, true)
    },
    receiveMessage(event) {
      if (event.data.message == 'save_visualizations') {
        this.save(event.data.question_id)
        return
      }

      if (event.data.message == 'refresh') {
        if (!this.loading) {
          this.refresh(event)
          return
        }
      }

    },

    updateVisulaization(response) {

      if (response.data && response.data.visualizations && response.data.visualizations.length >= 1) {
        this.visualizations = {
          towardsBaseRenderer: true, details: {
            details: response.data.visualizations.map((viz) => {
              return makeVisualizationFromResponse(viz)
            })
          }
        }
        return
      }
      this.visualizations = { details: null }
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
    },

    emitToParent() {
      const el = window.parent.$('#ag_get_results button')
      if (el.length) {
        el.trigger('click')
        return
      }
      this.refresh()
    },
    showDownloadToast(download, _) {
      if (download === null) {
        return
      }

      this.toastShow = true
      if (download) {
        this.toastMessage = "We are creating a csv for you. You'll get an email shortly with the details."
        this.toastType = "ok"
        return
      }
      if (!download) {
        this.toastMessage = "we were not able to create csv. Csv flow has some issues. please contact administrator"
        this.toastType = "critical"
        return
      }
    },
    download() {
      let currentViz = this.visualizations && this.visualizations.details && this.visualizations.details.details.filter(viz => viz && viz.current)
      currentViz = currentViz && currentViz.length === 1 ? currentViz[0] : null

      if (currentViz) {
        let payload = {}
        if (this.payload) {
          payload = _.cloneDeep(this.payload)
        }
        payload.visualization = currentViz
        downloadVizData(payload, this.query, this.showDownloadToast)

      }
    }
  }
}
</script>
