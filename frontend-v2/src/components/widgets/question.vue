<template>
  <div class="tw-w-full tw-h-full">
    <AGLoader
      text="Fetching Details"
      v-if="loading || apiActionsLoading || quesLoading"
    />
    <div class="tw-flex tw-flex-col tw-w-full tw-h-full" v-else>
      <template v-if="showHeader">
        <div
          class="tw-flex tw-border-b tw-justify-between tw-items-center tw-py-2 tw-px-4"
          :style="headerStyle"
        >
          <div class="tw-text-lg tw-font-semibold" v-if="question">
            {{ question.title }}
          </div>
          <div class="tw-flex tw-items-center tw-whitespace-nowrap tw-gap-2">
            <div class="tw-cursor-pointer">
              <q-menu
                flat="true"
                transition-show="scale"
                transition-hide="scale"
                max-height="400px"
                :offset="[0, 5]"
                class="tw-rounded-2xl tw-border tw-overflow-hidden"
                @show="menuShow"
                @keydown="onKeydown"
              >
                <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
                  <a
                    :href="'/questions/' + id"
                    target="_blank"
                    :tabindex="index + 1"
                    class="tw-py-1 tw-px-2 tw-whitespace-nowrap tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                  >
                    <ArrowBearRightIcon size="16" class="icon-primary" />
                    <span class="">View Details</span>
                  </a>
                  <div
                    @click="refresh"
                    :tabindex="index + 1"
                    class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                  >
                    <RefreshIcon size="16" class="icon-primary" />
                    <span class="">Refresh</span>
                  </div>
                </div>
              </q-menu>
              <Menu2Icon size="16" />
            </div>

            <slot />
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="tw-flex tw-items-center tw-whitespace-nowrap tw-gap-2 tw-absolute tw-p-2 tw-right-1 tw-top-1 tw-z-10 tw-bg-white tw-rounded-2xl tw-border"
          v-if="editMode"
        >
          <div class="tw-cursor-pointer">
            <q-menu
              flat="true"
              transition-show="scale"
              transition-hide="scale"
              max-height="400px"
              :offset="[0, 5]"
              class="tw-rounded-2xl tw-border tw-overflow-hidden"
              @show="menuShow"
              @keydown="onKeydown"
            >
              <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
                <a
                  :href="'/questions/' + id"
                  target="_blank"
                  :tabindex="index + 1"
                  class="tw-py-1 tw-px-2 tw-whitespace-nowrap tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                >
                  <ArrowBearRightIcon size="16" class="icon-primary" />
                  <span class="">View Details</span>
                </a>
                <div
                  @click="refresh"
                  :tabindex="index + 1"
                  class="tw-cursor-pointer tw-whitespace-nowrap tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
                >
                  <RefreshIcon size="16" class="icon-primary" />
                  <span class="">Refresh</span>
                </div>
              </div>
            </q-menu>
            <Menu2Icon size="16" />
          </div>

          <slot />
        </div>
      </template>
      <VizComponent
        :onDashboard="true"
        :results="results"
        :resultsKey="resultskey"
        :queryKey="queryKey"
        :visualization="emptyViz"
        :apiActionsQuesLevel="apiActions"
        :questionID="id"
        :size="settingsPanesize"
        class="tw-h-full tw-overflow-auto"
      />
    </div>
  </div>
</template>

<script>
import { Menu2Icon } from 'vue-tabler-icons';

import { ArrowBearRightIcon, XIcon, RefreshIcon } from 'vue-tabler-icons';
import VizComponent from 'components/visualizations/viz.vue';
import AGLoader from 'components/utils/loader.vue';
import { queryStore } from 'stores/query';
import { resultsStore } from 'stores/results';
import { apiActionStore } from 'stores/apiActions';
import { currentUserStore } from 'stores/currentUser';

import { newVisualization } from 'src/helpers/visualization';
import { getQueryAndPayload } from 'src/helpers/dashboard';

import { fetchQuestionResults, fetchQuestion } from 'src/apis/questions';
import { fetchQuestionApiActions } from 'src/apis/apiActions';
import { fetchVariables } from 'src/apis/dashboards';

import cloneDeep from 'lodash/cloneDeep';

const results = resultsStore();
const query = queryStore();
const apiActions = apiActionStore();
const currentUser = currentUserStore();

export default {
  name: 'AGQues',
  props: ['id', 'queryKey', 'editMode', 'showHeader', 'headerStyle'],
  components: {
    VizComponent,
    Menu2Icon,
    AGLoader,
    ArrowBearRightIcon,
    RefreshIcon,
  },
  data() {
    return {
      resultsKey: null,
      loading: true,
      quesLoading: false,
      apiActionsLoading: false,
      query: null,
      emptyViz: cloneDeep(newVisualization),
      results: null,
      apiActions: [],
      apiActionsKey: null,
      question: null,
      payload: {},
      currentUser: currentUser,
      variables: [],
    };
  },

  watch: {
    resultsKey() {
      this.fetchResults();
    },
    apiActionsKey() {
      this.fetchAPIActions();
    },
  },

  mounted() {
    window.addEventListener('message', this.receiveMessage);
    this.refresh();
  },

  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage);
  },

  methods: {
    fetchResultsKey() {
      fetchQuestionResults(
        this.payload,
        this.query.token,
        this.setLoadingAndResultsKey
      );
    },
    fetchAPIActionsKey() {
      fetchQuestionApiActions(
        this.id,
        this.query.token,
        this.apiActionsKey,
        this.setApiActionKey
      );
    },
    fetchQuestion() {
      fetchQuestion(this.id, this.query.token, this.setQuestion);
    },

    fetchResults() {
      this.results = results.getResults(this.resultsKey);
    },

    fetchAPIActions() {
      this.apiActions = apiActions.get(this.apiActionsKey);
    },

    setQuestion(data, loading) {
      this.question = data;
      this.quesLoading = loading;
      if (data) {
        const variableIDs = data.variables.data.map((v) => v.id);
        fetchVariables(variableIDs, (vars, _) => {
          this.variables = vars;
        });
      }
    },
    setApiActionKey(key, loading) {
      this.apiActionsLoading = loading;
      this.apiActionsKey = key;
    },
    setLoadingAndResultsKey(key, loading) {
      this.loading = loading;
      this.resultsKey = key;
    },
    refresh() {
      const response = getQueryAndPayload(this.queryKey, this.payload);
      this.query = response.queryParams;
      this.payload = response.payload;
      this.payload = Object.assign({}, { question_id: this.id }, this.payload);
      this.fetchResultsKey();
      this.fetchAPIActionsKey();
      this.fetchQuestion();
    },
    receiveMessage(event) {
      if (event.data.message != 'ag_refresh_dashboard') {
        return;
      }
      const eventPayload = JSON.parse(event.data.payload);
      this.payload = Object.assign({}, this.payload, eventPayload);

      if (!eventPayload.changed) {
        this.refresh();
        return;
      }
      const changed = new Set(this.payload.changed);
      const hasFilters = this.variables.filter((v) => {
        return changed.has(v.name);
      });
      if (hasFilters.length > 0) {
        this.refresh();
      }
    },
  },
};
</script>
