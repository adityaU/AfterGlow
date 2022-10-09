<template>
  <div class="tw-flex tw-h-full">
    <AGLoader text="Fetching Details" v-if="loading" class="tw-flex-[1_1_100%]" />
    <div class="tw-flex tw-flex-col tw-w-full tw-h-full" v-if="!loading">

      <div class="tw-flex tw-border-b tw-justify-between tw-items-center tw-py-2 tw-px-4">
        <div class="tw-text-lg tw-font-semibold" v-if="question && viz">{{ question && question.title }} - {{ viz.name }}
        </div>
        <div class="tw-text-right tw-whitespace-nowrap">

          <div class="tw-cursor-pointer tw-inline">
            <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]"
              class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
              <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
                <a :href="'/questions/' + viz.questionID" target="_blank" :tabindex="index + 1"
                  class="tw-py-1 tw-px-2 tw-whitespace-nowrap tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                  <ArrowBearRightIcon size="16" class="icon-primary tw-mr-2" />
                  <span class="">View Details</span>
                </a>
                <div @click="refresh" :tabindex="index + 1"
                  class="tw-cursor-pointer tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                  <RefreshIcon size="16" class="icon-primary tw-mr-2" />
                  <span class="">Refresh</span>
                </div>
                <div @click="$emit('update:showRemoveFromDashboardModal', true)" :tabindex="index + 1"
                  v-if="currentUser.canDeleteDashboard"
                  class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0">
                  <XIcon size="16" class="icon-primary tw-mr-2" />
                  <span class="">Remove from Dashboard</span>
                </div>
              </div>

            </q-menu>
            <Menu2Icon size=14 class="tw-inline" />

          </div>

          <ArrowsMoveIcon size=14 class="grid-drag tw-cursor-move tw-inline tw-ml-2" v-if="editMode" />
        </div>
      </div>
      <VizComponent onDashboard=true :results="results" :resultsKey="resultskey" :queryKey="queryKey"
        :visualization="viz" :apiActionsQuesLevel="apiActions" :questionID="viz.questionID" :size="size"
        class=" tw-w-full tw-h-full tw-overflow-auto" />
    </div>
    <!-- <AGVizSettings settings= -->
  </div>
</template>

<script>
import { Menu2Icon } from 'vue-tabler-icons';

import { ArrowsMoveIcon, ArrowBearRightIcon, XIcon, RefreshIcon } from 'vue-tabler-icons';
import VizComponent from 'components/visualizations/viz.vue';
import AGLoader from 'components/utils/loader.vue';
import { resultsStore } from 'stores/results'
import { apiActionStore } from 'stores/apiActions'
import { currentUserStore } from 'src/stores/currentUser';

import { newVisualization } from 'src/helpers/visualization';
import { getQueryAndPayload } from 'src/helpers/dashboard'

import { fetchVizResults, fetchViz } from 'src/apis/visualization'
import { fetchQuestionApiActions } from 'src/apis/apiActions'
import { fetchQuestion } from 'src/apis/questions';

import cloneDeep from 'lodash/cloneDeep';


const results = resultsStore()
const apiActions = apiActionStore()

const currentUser = currentUserStore();
export default {
  name: 'AGWidgetViz',
  props: ['id', 'queryKey', 'editMode', 'size', 'showRemoveFromDashboardModal'],
  components: { VizComponent, Menu2Icon, AGLoader, ArrowsMoveIcon, ArrowBearRightIcon, XIcon, RefreshIcon },
  data() {
    return {
      resultsKey: null,
      loading: true,
      query: null,
      viz: cloneDeep(newVisualization),
      results: null,
      apiActions: [],
      apiActionsKey: null,
      question: null,
      payload: {},
      currentUser: currentUser,
    }
  },

  watch: {
    size() {
      console.log(this.size)
    },
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
      fetchVizResults(this.id, null, this.payload, this.query, this.setLoadingAndResultsKey)
    },
    fetchAPIActionsKey(id) {
      fetchQuestionApiActions(id, this.query.token, this.apiActionsKey, this.setApiActionKey)

    },
    fetchViz() {
      fetchViz(this.id, this.query, this.setViz)
    },

    fetchResults() {
      this.results = results.getResults(this.resultsKey)
    },

    fetchAPIActions() {
      this.apiActions = apiActions.get(this.apiActionsKey)
    },

    setViz(data, loading) {
      this.viz = data
      this.loading = loading
      if (data && data.questionID) {
        this.fetchAPIActionsKey(data.questionID)
        fetchQuestion(data.questionID, this.query.token, this.setQuestion)
      }
    },
    setQuestion(question, loading) {
      this.question = question
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
      const response = getQueryAndPayload(this.queryKey, this.payload)
      this.query = response.queryParams
      this.payload = response.payload
      this.fetchResultsKey()
      this.fetchViz()
    },
    receiveMessage(event) {
      if (event.data.message == 'ag_refresh_dashboard') {
        this.payload = Object.assign({}, this.payload, JSON.parse(event.data.payload))
        this.refresh()
      }
    }
  }
}
</script>
