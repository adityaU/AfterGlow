<template>
  <div class="tw-w-full">
    <AGLoader text="Fetching Details" v-if="loading" />
    <div class="tw-h-full tw-w-full" v-if="!loading">

    <div class="tw-grid tw-h-[40px] tw-border-b tw-w-full tw-grid-cols-12">
      <div class="tw-my-auto tw-text-lg tw-font-semibold tw-pl-4 tw-col-span-11" v-if="question">{{ question.title }}
      </div>
      <div class="tw-col-span-1 tw-m-auto tw-mr-3 tw-text-right">

        <div class="tw-cursor-pointer tw-inline">
          <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]"
            class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
            <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
              <a :href="'/questions/' + id" target="_blank" :tabindex="index + 1"
                class="tw-py-1 tw-px-2 tw-whitespace-nowrap tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                <ArrowBearRightIcon size="16" class="icon-primary tw-mr-2" />
                <span class="">View Details</span>
              </a>
              <div  @click="refresh" :tabindex="index + 1"
                class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                <RefreshIcon size="16" class="icon-primary tw-mr-2" />
                <span class="">Refresh</span>
              </div>
              <div @click="$emit('update:showRemoveFromDashboardModal', true)" :tabindex="index + 1" v-if="currentUser.canDeleteDashboard"
                class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                <XIcon size="16" class="icon-primary tw-mr-2" />
                <span class="">Remove from Dashboard</span>
              </div>
            </div>

          </q-menu>
          <Menu2Icon size=14 class="tw-inline" />

        </div>

        <ArrowsMoveIcon size=14 class="grid-drag tw-cursor-move tw-inline tw-ml-2" v-if="editMode"/>
      </div>
    </div>
    <VizComponent :results="results" :resultsKey="resultskey" :queryKey="queryKey" :visualization="emptyViz"
      :apiActionsQuesLevel="apiActions" :questionID="id" :size="settingsPanesize" class="tw-h-[calc(100%-40px)]" />
    </div>
  </div>
</template>

<script>
import { Menu2Icon } from 'vue-tabler-icons';

import {ArrowsMoveIcon, ArrowBearRightIcon, XIcon, RefreshIcon} from 'vue-tabler-icons';
import VizComponent from 'components/visualizations/viz.vue';
import AGLoader from 'components/utils/loader.vue';
import { queryStore } from 'stores/query'
import { resultsStore } from 'stores/results'
import { apiActionStore } from 'stores/apiActions'
import {currentUserStore} from 'stores/currentUser'

import { newVisualization } from 'src/helpers/visualization';
import {getQueryAndPayload} from 'src/helpers/dashboard'

import { fetchQuestionResults, fetchQuestion } from 'src/apis/questions'
import { fetchQuestionApiActions } from 'src/apis/apiActions'

import cloneDeep from 'lodash/cloneDeep';

const results = resultsStore()
const query = queryStore()
const apiActions = apiActionStore()
const currentUser = currentUserStore();


export default {
  name: 'AGQues',
  props: ['id', 'queryKey', 'editMode', 'showRemoveFromDashboardModal'],
  components: { VizComponent, Menu2Icon, AGLoader, ArrowsMoveIcon, ArrowBearRightIcon, XIcon, RefreshIcon },
  data() {
    return {
      resultsKey: null,
      loading: true,
      query: null,
      emptyViz: cloneDeep(newVisualization),
      results: null,
      apiActions: [],
      apiActionsKey: null,
      question: null,
      payload: {},
      currentUser: currentUser
    }
  },

  watch: {
    resultsKey() {
      this.fetchResults()
    },
    apiActionsKey() {
      this.fetchAPIActions()
    }
  },

  mounted() {
    window.addEventListener('message', this.receiveMessage)
    this.refresh()
  },

  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage)
  },

  methods: {
    fetchResultsKey() {
      fetchQuestionResults(this.payload, this.query.token, this.setLoadingAndResultsKey)
    },
    fetchAPIActionsKey() {
      fetchQuestionApiActions(this.id, this.query.token, this.apiActionsKey, this.setApiActionKey)

    },
    fetchQuestion() {
      fetchQuestion(this.id, this.query.token, this.setQuestion)
    },

    fetchResults() {
      this.results = results.getResults(this.resultsKey)
    },

    fetchAPIActions() {
      this.apiActions = apiActions.get(this.apiActionsKey)
    },

    setQuestion(data, loading) {
      this.question = data
      this.loading = loading
    },
    setApiActionKey(key, loading) {
      this.loading = loading
      this.apiActionsKey = key
    },
    setLoadingAndResultsKey(key, loading) {
      this.loading = loading
      this.resultsKey = key
    },
    refresh() {
      const response  = getQueryAndPayload(this.queryKey, this.payload)
      this.query = response.queryParams
      this.payload = response.payload
      this.payload = Object.assign({}, {question_id: this.id}, this.payload)
      this.fetchResultsKey()
      this.fetchAPIActionsKey()
      this.fetchQuestion()
    },
    receiveMessage(event){
      if (event.data.message == 'ag_refresh_dashboard') {
        this.payload = Object.assign({}, this.payload, JSON.parse(event.data.payload))
        this.refresh()
      }
    }
  }
}
</script>
