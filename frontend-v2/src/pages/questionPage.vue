<template>
  <template v-if="!currentUser.loading">
    <AGQuestionHeader
      class="slide-transition ag-header"
      :class="
        sidebarExpanded ? 'tw-w-[calc(100%-254px)]' : 'tw-w-[calc(100%-50px)]'
      "
      v-model:question="question"
      v-model:tags="tags"
      @save="saveQuestion"
      :showEditor="showEditor"
      @setShowEditor="setShowEditor"
    />

    <div class="ag-main-container">
      <Transition>
        <AGQuestionEditor
          class="tw-border tw-border-l-0 tw-overflow-hidden"
          v-model:question="question"
          @runQuery="(refresh(null, true) || true)"
          v-model:code="code"
          v-if="currentUser.canEditQuestion && showEditor"
        />
      </Transition>

      <VariablePane
        class="tw-mx-6"
        :class="!showEditor ? 'tw-mt-[65px]' : 'tw-mt-3'"
        v-model:variables="variables"
        :code="code"
        v-model:variablesUpdated="variablesUpdated"
      />
      <AGLoader
        :text="initializingMessage"
        v-if="!dataLoaded"
        class="tw-bg-white custom-shadow tw-rounded-2xl tw-min-h-[400px]"
      />
      <div class="tw-my-3 tw-mx-6">
        <div class="tw-h-full tw-w-full tw-flex" v-if="dataLoaded">
          <BaseDataRenderer
            :resultsKey="resultsKey"
            :dataLoaded="dataLoaded"
            v-model:visualizations="visualizations"
            @deleteViz="deleteViz"
            :apiActionKeyQuesLevel="apiActionKeyQuesLevel"
            :apiActionKeyVizLevel="apiActionKeyVizLevel"
            :queryKey="queryKey"
            :questionID="questionID"
            :variables="variables"
            @fetchVizResults="refreshVizResults"
            v-model:loading="loading"
            @updateApiActions="fetchQuestionApiActions"
            @updateViz="(viz) => refresh(null, true)"
            :finalQuery="finalQuery"
            @download="download"
            :startingPage="startingPage"
            :question="question"
            ref="results-view"
          ></BaseDataRenderer>
        </div>
      </div>
      <AGToast v-model:show="toastShow" :type="toastType">{{
        toastMessage
      }}</AGToast>
    </div>
  </template>
  <AGLoader v-else />
</template>

<script>
import AGQuestionEditor from 'components/question/editor.vue';
import AGQuestionHeader from 'components/question/header.vue';
import BaseDataRenderer from 'components/dataRenderers/base.vue';
import AGLoader from 'components/utils/loader.vue';
import AGToast from 'components/utils/toast.vue';
import VariablePane from 'components/question/variables.vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { resultsStore } from 'stores/results';
import { apiActionStore } from 'stores/apiActions';
import { queryStore } from 'stores/query';
import hash from '../helpers/hash';
import apiConfig from '../helpers/apiConfig';
import cloneDeep from 'lodash/cloneDeep';
import { saveQuestion } from 'src/apis/questions';
import { sidebarState } from 'src/stores/sidebarStore';

import {
  fetchQuestionResults,
  fetchQuestionWithShareID,
} from 'src/apis/questions';
import { fetchQuestionApiActions } from 'src/apis/apiActions';
import {
  fetchVizResults,
  makeVisualizationFromResponse,
  downloadVizData,
} from 'src/apis/visualization';
import { fetchDatabase, fetchTable } from 'src/apis/database';

import { sessionStore } from 'src/stores/session';
import { currentUserStore } from 'src/stores/currentUser';
import { variableQuery } from 'src/stores/variableQuery';

import { newVisualization } from 'src/helpers/visualization';
import isEqual from 'lodash/isEqual';

const varStore = variableQuery();
const session = sessionStore();
import { _ } from 'lodash';
import { authMixin } from 'src/mixins/auth';
import LZString from 'lz-string';
import { InitializingMessages } from 'src/helpers/messages';

const currentUser = currentUserStore();
const sidebar = sidebarState();
export default {
  name: 'QuestionPage',
  components: {
    BaseDataRenderer,
    AGLoader,
    AGToast,
    AGQuestionEditor,
    AGQuestionHeader,
    VariablePane,
  },
  mixins: [authMixin],

  watch: {
    sidebarStateVar() {
      this.sidebarExpanded = sidebarState.expanded;
    },
    sql() {
      this.code = this.sql;
    },
    variablesUpdated() {
      this.refresh();
    },
    question: {
      deep: true,
      handler() {
        if (this.question?.human_sql?.database?.db_type === 'api_client') {
          if (!isEqual(this.code, this.makeCodeFromApiAction())) {
            this.code = this.makeCodeFromApiAction();
          }
        }
      },
    },
    questionDatabase: {
      deep: true,
      handler() {
        if (
          !isEqual(
            JSON.stringify(this.questionDatabase),
            session.getDefault('question_database')
          )
        ) {
          session.setDefault(
            'question_database',
            JSON.stringify(this.questionDatabase)
          );
        }
      },
    },

    questionQueryType() {
      if (
        !isEqual(
          this.questionQueryType,
          session.getDefault('question_query_type')
        )
      ) {
        session.setDefault('question_query_type', this.questionQueryType);
      }
    },
    currentUser: {
      deep: true,
      handler() {
        if (
          !this.currentUser.loading &&
          !this.currentUser.canEditQuestion & !this.questionID
        ) {
          this.$router.replace({ path: '/questions' });
        }
      },
    },

    $route(newValue, oldValue) {
      if (oldValue.params.id != newValue.params.id) {
        this.$router.go();
        return;
      }
      this.syncVars(this.$route.query);
    },
  },

  computed: {
    sidebarExpanded() {
      return this.sidebar.expanded;
    },
    sql() {
      return this.question?.sql || this.question?.human_sql?.rawQuery;
    },
    questionApiAction() {
      return this.question?.api_action;
    },
    questionDatabase() {
      return this.question?.human_sql?.database;
    },
    questionQueryType() {
      return this.question?.query_type;
    },
  },

  data() {
    const route = useRoute();
    const query = { ...route.query, token: session.token };
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
      toastMessage: '',
      toastType: '',
      variables: [],
      tags: [],
      currentUser: currentUser,
      databaseLoading: true,
      tableLoading: true,
      code: '',
      variablesUpdated: false,
      initializingMessage:
        InitializingMessages[
          Math.floor(Math.random() * InitializingMessages.length)
        ],
      sidebar: sidebar,
      showEditor: true,
    };
  },
  async created() {
    if (this.payload && !this.payload.empty) {
      this.queryKey = await hash(this.query);
      queryStore().push(this.query, this.queryKey);
      let questionID = this.params.id || this.query.question_id || null;
      this.questionID = questionID;
      this.payload.question_id = questionID;
      if (questionID != null && questionID != 'null') {
        fetchQuestionWithShareID(
          questionID,
          this.$route.query.share_id || '',
          session.token,
          this.setQuestion
        );
        this.fetchQuestionApiActions(questionID);
        this.dataLoaded = false;
      } else if (!this.payload.database) {
        this.syncVars(this.$route.query);
        this.startingPage = this.$route?.query?.data ? false : true;
        this.dataLoaded = true;
      } else {
        this.dataLoaded = true;
        fetchQuestionResults(
          this.payload,
          this.query.token,
          this.setLoadingAndResultsKey
        );
      }
    } else {
      this.resultsKey = 'empty';
      this.dataLoaded = true;
      this.syncVars(this.$route.query);
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage);
  },
  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage);
  },

  methods: {
    setShowEditor() {
      this.showEditor = true;
    },
    lzEncode(json) {
      return LZString.compressToBase64(json);
    },
    lzDecode(string) {
      return LZString.decompressFromBase64(string);
    },
    syncVars(query) {
      this.variables.forEach((v) => {
        v.value = query[varStore.hashed(v.name)];
      });

      if (query?.database_id && query?.table_id) {
        fetchDatabase(query?.database_id, session.token, this.setupDatabase);
        fetchTable(query?.table_id, session.token, this.setupTable);
        return;
      }

      if (!query.data && !this.$route.params.id) {
        this.question = {};
        this.question.api_action = null;

        this.question.query_type =
          this.question?.query_type ||
          session.getDefault('question_query_type');
        if (
          session.getDefault('question_database') &&
          session.getDefault('question_database') != 'undefined'
        ) {
          this.question.human_sql = {};
          this.question.human_sql.database = JSON.parse(
            session.getDefault('question_database')
          );
        }
        this.visualizations = { details: null };
        // this.refresh();
        return;
      }

      // if (!query.data){
      //   this.$router.go()
      // }
      if (query.data != this.encodeQuestionDetails()) {
        const details =
          JSON.parse(this.lzDecode(query.data || this.lzEncode('{}'))) || {};
        const vars = [...(this.variables || []), ...(details.variables || [])];
        this.variables = [
          ...new Map(vars.map((item) => [item?.name, item])).values(),
        ];
        this.question = this.question || {};
        this.question.human_sql = details.human_sql || this.question.human_sql;
        this.question.sql = details.sql || this.question.sql;
        this.question.query_type =
          details.query_type ||
          this.question?.query_type ||
          session.getDefault('question_query_type');
        this.visualizations = details.visualizations || this.visualizations;
        this.question.api_action =
          details.apiAction || this.question.api_action;
        this.variables.forEach((v) => {
          v.value = query[varStore.hashed(v.name)];
        });

        this.refresh();
      }
    },
    setupDatabase(database, loading) {
      this.databaseLoading = loading;
      this.question = this.question || {};
      this.question.human_sql = this.question?.human_sql || {};
      this.question.human_sql.database = database;
      if (!this.databaseLoading && !this.tableLoading) {
        this.refresh();
      }
    },
    setupTable(table, loading) {
      this.tableLoading = loading;
      this.question = this.question || {};
      this.question.human_sql = this.question?.human_sql || {};
      this.question.human_sql.table = table;
      if (!this.databaseLoading && !this.tableLoading) {
        this.refresh();
      }
    },
    // fetchVisualizations(questionID) {
    //   api
    //     .get(
    //       'visualizations' + '?question_id=' + questionID,
    //       apiConfig(this.query.token)
    //     )
    //     .then((response) => {
    //       // this.fetchVizResults(response)
    //       this.updateVisulaization(response);
    //       this.syncVars(this.$route.query);
    //     });
    // },
    setVariables(variables, _loading) {
      this.variables = variables || [];
      this.fetchVisualizations(this.question.id);
    },
    setTags(tags, _loading) {
      this.tags = tags || [];
    },

    reloadQuestion(question) {
      if (question) {
        this.$router.push({ path: '/questions/' + question.id });
      }
      // if (this.$route?.params?.id === this.question.id) {
      //   this.$router.go();
      //   return;
      // }
    },
    setQuestion(question, loading) {
      if (question) {
        this.question = question;
        this.variables = question.variables;
        question.visualizations = question.visualizations.map((viz) => {
          if (viz.query_terms.details) {
            viz.queryTerms = viz.query_terms;
          } else {
            viz.queryTerms = {
              details: viz.query_terms,
            };
          }
          viz.rendererType = viz.renderer_type;
          return viz;
        });
        this.visualizations = { details: { details: question.visualizations } };
        this.tags = question.tags;
        this.refresh();
      }
      if (!loading) {
        this.showQuestionSettingsModal = false;
      }
    },

    setLoadingAndResultsKey(key, query, loading) {
      this.startingPage = false;
      this.loading = loading;
      this.resultsKey = key;
      if (query) {
        this.question.human_sql.rawQuery = query;
      }
      if (!this.loading) {
        this.dataLoaded = true;
      }
    },
    setLoadingAndApiActionKey(key, loading) {
      this.startingPage = false;
      this.loading = loading;
      this.apiActionKeyQuesLevel = key;
    },
    async fetchQuestionApiActions() {
      const questionID = this.questionID;
      fetchQuestionApiActions(
        questionID,
        this.query.token,
        this.apiActionKeyQuesLevel,
        this.setLoadingAndApiActionKey
      );
    },

    fetchVizResults(response, forced) {
      if (response.data.visualizations.length === 0) {
        fetchQuestionResults(
          this.payload,
          this.query.token,
          this.setLoadingAndResultsKey
        );
        return;
      }
      const viz = response.data.visualizations[0];
      this.updateVizResults(viz, forced);
    },

    refreshVizResults(viz) {
      let vizTerms = viz.queryTerms;
      let payload = {};
      if (this.payload) {
        payload = _.cloneDeep(this.payload);
      }
      this.loading = true;
      hash(
        'payload=' +
          JSON.stringify(payload) +
          '&questionID=' +
          (this.query.question_id || this.params.id) +
          '&vizTerms=' +
          JSON.stringify(vizTerms)
      ).then((key) => {
        if (this.resultsStore.getResults(key)) {
          this.loading = false;
          this.resultsKey = key;
          return;
        }
        this.updateVizResults(viz, true, key);
      });
    },

    async updateVizResults(viz, forced, key) {
      this.loading = true;
      this.resultsKey = null;
      let vizID = viz.id;
      let payload = {};
      if (this.payload) {
        payload = _.cloneDeep(this.payload);
      }
      if (forced) {
        payload.forced = true;
      }
      payload.visualization = viz;
      fetchVizResults(
        vizID,
        this.query.question_id || this.params.id,
        payload,
        this.query,
        this.setLoadingAndResultsKey,
        key
      );
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
    encodeQuestionDetails() {
      return this.lzEncode(
        JSON.stringify({
          visualizations: this.visualizations,
          query_type: this.question?.query_type,
          sql: this.question?.sql,
          human_sql: this.question?.human_sql,
          variables: this.variables,
          apiAction: this.question?.api_action,
        })
      );
    },
    refresh(event, updateQP) {
      if (!this.variablesUpdated) {
        this.code =
          this.code ||
          this.question?.sql ||
          this.question?.human_sql?.rawQuery ||
          'empty';
        return;
      }
      this.payload = this.question?.human_sql || {};
      if (
        this.question.api_action &&
        this.question?.human_sql.database?.db_type === 'api_client'
      ) {
        this.question.api_action.headers =
          this.question.api_action.headers || {};
        this.question?.api_action?.dummyHeaders?.forEach((item) => {
          this.question.api_action.headers[item.name] = item.value;
        });
        this.question.sql = 'empty';
        this.payload.sql = 'empty';
        this.payload.api_action = this.question.api_action;
      }

      const keys = Object.keys(this.payload);
      if (keys.length == 1 && keys[0] === 'database') {
        return;
      }
      this.payload.queryType =
        this.question?.query_type === 'sql' ? 'raw' : 'query_builder';
      this.payload.question_id = this.question?.id;
      if (!this.visualizations?.details?.details && this.payload['database']) {
        this.visualizations = {
          details: { details: [_.cloneDeep(newVisualization)] },
        };
        this.visualizations.details.details[0].current = true;
      }
      let currentViz =
        this.visualizations?.details?.details?.filter(
          (viz) => viz && viz.current
        ) || [];
      const firstViz =
        this.visualizations?.details?.details?.length > 0 &&
        currentViz.length == 0
          ? (this.visualizations.details.details[0].current = true) &&
            this.visualizations.details.details[0]
          : null;
      currentViz =
        currentViz && currentViz.length === 1 ? currentViz[0] : firstViz;
      this.payload = this.question?.human_sql || {};
      this.payload.variables = this.variables.map((v) => {
        return {
          name: v.name,
          value: v.value != '' ? v.value || v.default : v.value,
          default_options: [],
          var_type: v.var_type,
        };
      });
      if (updateQP) {
        this.updateQueryParams();
      }
      if (event) {
        this.query = Object.fromEntries(new URLSearchParams(event.data.query));
        this.payload = JSON.parse(this.query.payload);
        this.payload.question_id = this.questionID;
      }

      currentViz && this.updateVizResults(currentViz, true);
      // const ref = document.getElementById('results-view');
      // ref && ref.scrollIntoView();
    },

    updateQueryParams() {
      const qp = {};
      this.variables.forEach((v) => {
        qp[varStore.hashed(v.name)] = v.value;
      });
      const hsqlQp = { data: this.encodeQuestionDetails() };
      const query = { ...qp, ...hsqlQp };
      if (!isEqual(this.$route.query, query)) {
        console.log('pushing');
        this.$router.push({ query: query });
      }
    },
    // receiveMessage(event) {
    //   if (event.data.message == 'save_visualizations') {
    //     this.save(event.data.question_id);
    //     return;
    //   }

    //   if (event.data.message == 'refresh') {
    //     if (!this.loading) {
    //       this.refresh(event);
    //       return;
    //     }
    //   }
    // },

    updateVisulaization(response) {
      if (
        response.data &&
        response.data.visualizations &&
        response.data.visualizations.length >= 1
      ) {
        this.visualizations = {
          towardsBaseRenderer: true,
          details: {
            details: response.data.visualizations.map((viz) => {
              return makeVisualizationFromResponse(viz);
            }),
          },
        };
        return;
      }
      this.visualizations = { details: null };
    },

    deleteViz(index) {
      if (this.visualizations.details.details.length === 1) {
        return;
      }

      const toBeDeleted = this.visualizations.details.details[index];
      if (toBeDeleted.current) {
        const currentIndex = index - 1 < 0 ? index + 1 : index - 1;
        this.visualizations.details.details[currentIndex].current = true;
      }

      if (toBeDeleted.id) {
        api.delete(
          'visualizations/' + toBeDeleted.id,
          apiConfig(this.query.token)
        );
      }
      this.visualizations.details.details.splice(index, 1);
      this.visualizations.towardsBaseRenderer = true;
    },

    showDownloadToast(success, message, _) {
      if (success === null) {
        return;
      }

      this.toastShow = true;
      if (success) {
        this.toastMessage = message;
        this.toastType = 'ok';
        return;
      }
      if (!success) {
        this.toastMessage = message;
        this.toastType = 'critical';
        return;
      }
    },

    makeCodeFromApiAction() {
      return `${this.question?.api_action?.url} ${
        this.question?.api_action?.body
      } ${this.question?.api_action?.dummyHeaders
        ?.map((h) => {
          return `${h.name} ${h.value}`;
        })
        ?.join(' ')}`;
    },

    saveQuestion() {
      const tags = this.tags;
      // const variables = this.variables;
      // // const originalVariables =
      //   this.question?.variables?.data?.map((v) => v.id) || [];
      this.question.tags = this.tags;
      this.question.sql = this.question.human_sql.rawQuery;
      this.question.human_sql.version = 1;
      // delete this.question.variables;
      const query = queryStore().get(this.queryKey);
      if (this.visualizations) {
        if (this.visualizations?.details?.details) {
          this.question.visualizations = this.visualizations.details.details;
        } else if (this.visualizations?.details) {
          this.question.visualizations = this.visualizations.details;
        } else if (this.visualizations) {
          this.question.visualizations = this.visualizations;
        }
      }
      this.question.variables = this.variables;
      saveQuestion(
        this.questionID,
        this.question,
        query.token,
        this.question.id ? this.setQuestion : this.reloadQuestion
      );
    },
    download() {
      let currentViz =
        this.visualizations &&
        this.visualizations.details &&
        this.visualizations.details.details.filter((viz) => viz && viz.current);
      currentViz = currentViz && currentViz.length === 1 ? currentViz[0] : null;

      if (currentViz) {
        let payload = {};
        if (this.payload) {
          payload = _.cloneDeep(this.payload);
        }
        payload.visualization = currentViz;
        downloadVizData(payload, this.query, this.showDownloadToast);
      }
    },
  },
};
</script>
