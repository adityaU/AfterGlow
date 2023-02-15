<template>
  <AGWithLoginHeader />
  <AGQuestionHeader v-model:question="question" v-model:tags="tags" @save="saveQuestion" />

  <VariablePane class="tw-mt-3 tw-mx-6" v-model:variables="variables" :code="code" />
  <div class="tw-my-1 tw-mx-6">
    <AGQuestionEditor class="tw-mb-3 tw-border" v-model:question="question" @runQuery="refresh(null, true)" v-model:code="code" v-if="currentUser.canEditQuestion" />
    <AGLoader text="Initializing" v-if="!dataLoaded" class="tw-bg-white tw-shadow-sm tw-rounded-sm tw-min-h-[400px]" />
    <div class="tw-h-full tw-w-full tw-flex" v-if="dataLoaded">
      <BaseDataRenderer  :resultsKey="resultsKey" :dataLoaded="dataLoaded"
        v-model:visualizations="visualizations" @deleteViz="deleteViz" :apiActionKeyQuesLevel="apiActionKeyQuesLevel"
        :apiActionKeyVizLevel="apiActionKeyVizLevel" :queryKey="queryKey" :questionID="questionID"
        @fetchVizResults="refreshVizResults" v-model:loading="loading" @updateApiActions="fetchQuestionApiActions"
        @updateViz="(viz) => refresh(null, true)" :finalQuery="finalQuery" @download='download' 
        :startingPage="startingPage" :question="question" ref="results-view" ></BaseDataRenderer>
    </div>
    <AGToast v-model:show="toastShow" :type="toastType">{{ toastMessage }}</AGToast>
    <AGFooter />
  </div>
</template>

<script >
import AGQuestionEditor from 'components/question/editor.vue'
import AGQuestionHeader from 'components/question/header.vue'
import AGWithLoginHeader from 'components/header/withLogin.vue'
import BaseDataRenderer from 'components/dataRenderers/base.vue';
import AGLoader from 'components/utils/loader.vue'
import AGToast from 'components/utils/toast.vue';
import VariablePane from 'components/question/variables.vue' 
import AGFooter from 'components/footer/static.vue'
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { resultsStore } from 'stores/results'
import { apiActionStore } from 'stores/apiActions'
import { queryStore } from 'stores/query'
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'
import cloneDeep from 'lodash/cloneDeep'
import { saveQuestion } from 'src/apis/questions';

import { fetchQuestionResults, fetchQuestion, fetchQuestionWithShareID } from 'src/apis/questions'
import { fetchQuestionApiActions } from 'src/apis/apiActions'
import { fetchVizResults, makeVisualizationFromResponse, downloadVizData } from 'src/apis/visualization'
import {fetchVariables, saveVariable, deleteVariable} from 'src/apis/dashboards'
import { addVariable } from 'src/apis/questions';
import { fetchTagsByIDs } from 'src/apis/tags';
import { fetchDatabase, fetchTable } from 'src/apis/database';

import {sessionStore} from 'src/stores/session'
import { currentUserStore } from 'src/stores/currentUser';
import {variableQuery} from 'src/stores/variableQuery'

import {newVisualization} from 'src/helpers/visualization'
import isEqual from 'lodash/isEqual'

const varStore = variableQuery()
const session = sessionStore()
import { _ } from 'lodash'
import { authMixin } from 'src/mixins/auth'
import LZString from 'lz-string'

const currentUser = currentUserStore()
export default {
  name: 'QuestionPage',
  components: { BaseDataRenderer, AGLoader, AGToast,
    AGWithLoginHeader, AGQuestionEditor, AGQuestionHeader, VariablePane, AGFooter
  },
  mixins: [authMixin],

  watch: {
    currentUser: {
      deep: true,
      handler(){
        if (!this.currentUser.canEditQuestion & !this.questionID){
          this.$router.replace({path: "/questions"})
        }
      }
    },

    $route( newValue, oldValue){
      if (oldValue.params.id != newValue.params.id){
        this.$router.go()
        return
      }
      this.syncVars(this.$route.query)

    }
  },

  data() {
    const route = useRoute();
    const query = {...route.query, token: session.token}
    const results = resultsStore();
    return {
      question: null,
      resultsKey: null,
      dataLoaded: false,
      visualizations: { details: null },
      loading: false,
      query: query,
      params: route.params,
      payload: JSON.parse(query?.payload || '{}'),
      resultsStore: results,
      apiActionStore: apiActionStore(),
      queryKey: null,
      questionID: null,
      toastShow: false,
      startingPage: false,
      toastMessage: "",
      toastType: "",
      variables: [],
      code: "",
      tags: [],
      currentUser: currentUser,
      databaseLoading: true,
      tableLoading: true
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
        fetchQuestionWithShareID(questionID, this.$route.query.share_id || "", session.token, this.setQuestion)
        this.fetchQuestionApiActions(questionID)
        this.dataLoaded = false
      } else if (!this.payload.database) {
        this.syncVars(this.$route.query)
        this.startingPage = this.$route?.query?.data ? false :  true
        this.dataLoaded = true
      } else {
        this.dataLoaded = true
        fetchQuestionResults(this.payload, this.query.token, this.setLoadingAndResultsKey)
      }
    } else {
      this.resultsKey = 'empty'
      this.dataLoaded = true
      this.syncVars(this.$route.query)
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage)
  },
  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage)
  },


  methods: {
    lzEncode(json){
      return LZString.compressToBase64(json)
    },
    lzDecode(string){
      return LZString.decompressFromBase64(string)
    },
    syncVars(query){
      this.variables.forEach(v => {
        v.value = query[varStore.hashed(v.name)]
      })

      if (query?.database_id && query?.table_id){
        fetchDatabase(query?.database_id, session.token, this.setupDatabase)
        fetchTable(query?.table_id, session.token, this.setupTable)
        return
      }

      if (!query.data && !this.$route.params.id){
        this.question = {}
        this.visualizations =  { details: null }
        this.refresh()
        return 
      }


      // if (!query.data){
      //   this.$router.go()
      // }
      if (query.data != this.encodeQuestionDetails()){
        const details = JSON.parse(this.lzDecode(query.data || this.lzEncode("{}"))) || {}
        this.question = this.question || {}
        this.question.human_sql = details.human_sql || this.question.human_sql
        this.question.sql = details.sql || this.question.sql
        this.question.query_type = details.query_type || this.question.query_type
        this.visualizations = details.visualizations || this.visualizations
        this.refresh()
      }
    },
    setupDatabase(database, loading){
      this.databaseLoading = loading
      this.question = this.question || {}
      this.question.human_sql = this.question?.human_sql || {}
      this.question.human_sql.database = database
      if (!this.databaseLoading && !this.tableLoading){
        this.refresh()
      }

    },
    setupTable(table, loading){
      this.tableLoading = loading
      this.question = this.question || {}
      this.question.human_sql = this.question?.human_sql || {}
      this.question.human_sql.table = table
      if (!this.databaseLoading && !this.tableLoading){
        this.refresh()
      }
    },
    fetchVisualizations(questionID){
      api.get('visualizations' + "?question_id=" + questionID, apiConfig(this.query.token)).then((response) => {
        // this.fetchVizResults(response)
        this.updateVisulaization(response)
        this.syncVars(this.$route.query)
      })
    },
    setVariables(variables, _loading){
      this.variables = variables || []
      this.fetchVisualizations(this.question.id)
    },
    setTags(tags, _loading){
      this.tags = tags || []
    },
    setQuestionAndVariables(newVariables, oldVariablesIDs){
      return (question, loading) => {
        this.setQuestion(question, loading)
        if (question){
          const newVariablesIDs = newVariables.map(v=> v.id)

          const syncVarOv = oldVariablesIDs.map(() => false)
          const syncVarNv = newVariables.map(() => false)
          const syncNoVar = []
          oldVariablesIDs.forEach((ov, i) => {
            const index = newVariablesIDs.indexOf(ov)
            if (index < 0){
              deleteVariable(ov, (_, loading)=> {
                if (!loading){
                  syncVarOv[i] = true
                  this.reloadQuestion(syncVarOv, syncVarNv, syncNoVar)
                }
              })
            }else{
              saveVariable(newVariables[index], (_, loading)=> {
                if (!loading){
                  syncVarOv[i] = true
                  this.reloadQuestion(syncVarOv, syncVarNv, syncNoVar)
                }
              })
            }
          })

          newVariablesIDs.forEach((nv, i) => {
            const index = oldVariablesIDs.indexOf(nv)
            if (index < 0){
              addVariable(newVariables[i], question.id, (_, loading)=> {
                if (!loading){
                  syncVarNv[i] = true
                  this.reloadQuestion(syncVarOv, syncVarNv, syncNoVar)

                }
              })
            }else{
              syncVarNv[i] = true
              this.reloadQuestion(syncVarOv, syncVarNv, syncNoVar)
            }
          })

          this.reloadQuestion(syncVarOv, syncVarNv, syncNoVar)


        }

      }
    },

    reloadQuestion(syncVarOv, syncVarNv){
      if (syncVarNv.indexOf(false) < 0 && syncVarOv.indexOf(false) < 0){
        this.save(this.question.id, ()=> {
          if (this.$route?.params?.id === this.question.id) {
            this.$router.go()
          }

          this.$router.push({"path": "/questions/" + this.question.id})
        })
      }
    },
    setQuestion(question, loading) {
      if (question){
        const existingQuestionID = cloneDeep(this.question?.id)
        this.question = question
        const varIDs = question?.variables?.data?.map(v => v.id) || []
        if (varIDs.length > 0){
          fetchVariables(varIDs, this.setVariables)
        }else{
          this.fetchVisualizations(this.question.id)
        }

        const tagIDs = question?.tags?.data?.map(v => v.id) || []
        if (tagIDs.length > 0){
          fetchTagsByIDs(tagIDs, this.setTags)
        }
      }
      if (!loading) {
        this.showQuestionSettingsModal = false
      }


    },

    setLoadingAndResultsKey(key, query, loading) {
      this.startingPage = false
      this.loading = loading
      this.resultsKey = key
      if (query) {
        this.question.human_sql.rawQuery = query
      }
      if (!this.loading){
        this.dataLoaded = true
      }
    },
    setLoadingAndApiActionKey(key, loading) {
      this.startingPage = false
      this.loading = loading
      this.apiActionKeyQuesLevel = key
    },
    async fetchQuestionApiActions() {
      const questionID = this.questionID
      fetchQuestionApiActions(questionID, this.query.token, this.apiActionKeyQuesLevel, this.setLoadingAndApiActionKey)
    },

    fetchVizResults(response, forced) {
      if (response.data.visualizations.length === 0) {
        fetchQuestionResults(this.payload, this.query.token, this.setLoadingAndResultsKey)
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
      this.loading = true
      hash("payload=" + JSON.stringify(payload) + "&questionID=" + (this.query.question_id || this.params.id) + "&vizTerms=" + JSON.stringify(vizTerms)).then((key) => {
        if (this.resultsStore.getResults(key)) {
          this.loading = false
          this.resultsKey = key
          return
        }
        this.updateVizResults(viz, true, key)
      })
    },


    async updateVizResults(viz, forced, key) {
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
      fetchVizResults(vizID, this.query.question_id || this.params.id, payload, this.query, this.setLoadingAndResultsKey, key)

    },


    // async fetchQuestionResults() {
    //   fetchQuestionResults(this.payload, this.query.token, this.setLoadingAndResultsKey)
    //   // this.loading = true
    //   // this.resultsKey = null
    //   // let key = await hash(JSON.stringify(this.payload))
    //   // api.post('visualizations/results', this.payload, apiConfig(this.query.token)).then((response) => {
    //   //   this.resultsStore.pushResults(response.data.data, key)
    //   //   this.loading = false
    //   //   this.resultsKey = key
    //   // }).catch((error) => {
    //   //   this.resultsStore.pushResults(error.response.data.error, key)
    //   //   this.resultsKey = key
    //   //   this.loading = false
    //   // })
    //   //
    // },
    encodeQuestionDetails(){
      return this.lzEncode(JSON.stringify({visualizations: this.visualizations, query_type: this.question?.query_type, sql: this.question?.sql, human_sql: this.question?.human_sql}))
    },
    refresh(event, updateQP){
      const ref = document.getElementById('results-view')
      this.payload = this.question?.human_sql || {}
      this.payload.queryType = (this.question?.query_type === 'sql') ? 'raw' : 'query_builder'
      this.payload.question_id = this.question?.id
      if (!this.visualizations?.details?.details && this.payload["database"]){
        this.visualizations = {details: {details:[ _.cloneDeep(newVisualization)]}}  
        this.visualizations.details.details[0].current = true
      }
      let currentViz = this.visualizations?.details?.details?.filter(viz => viz && viz.current) || []
      const firstViz = (this.visualizations?.details?.details?.length > 0 &&  currentViz.length == 0) ? ((this.visualizations.details.details[0].current = true) &&  this.visualizations.details.details[0]) : null
      currentViz = currentViz && currentViz.length === 1 ? currentViz[0] : firstViz 
      this.payload = this.question?.human_sql || {}
      this.payload.variables = this.variables.map(v => {
        return {name: v.name, value: v.value || v.default, default_options: [], var_type: v.var_type}
      })
      if (updateQP){
        const qp = {}
        this.payload.variables.forEach(v => {
          qp[varStore.hashed(v.name)] = v.value 
        })
        const hsqlQp = {data: this.encodeQuestionDetails()}
        const query = {...qp , ...hsqlQp}
        if (!isEqual(this.$route.query , query) ) {
          console.log("pushing")
          this.$router.push({ query: query})
        }
      }
      if (event){
        this.query = Object.fromEntries(new URLSearchParams(event.data.query))
        this.payload = JSON.parse(this.query.payload)
        this.payload.question_id = this.questionID
      }
      currentViz && this.updateVizResults(currentViz, true)
      ref && ref.scrollIntoView()
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

    save(question_id, f) {
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
          f && f()
        }).catch(() => {
            this.visualizations = { details: null }
            this.dataLoaded = true
          })
      }
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

    saveQuestion() {
      const tags = this.tags
      const variables = this.variables 
      const originalVariables = this.question?.variables?.data?.map(v => v.id) ||  []
      this.question.tags_ids = tags.map(t => t.id)
      this.question.sql = this.question.human_sql.rawQuery 
      this.question.human_sql.version = 1
      delete this.question.variables
      const query = queryStore().get(this.queryKey)
      saveQuestion(this.questionID, this.question, query.token, this.setQuestionAndVariables(this.variables,  originalVariables))
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
