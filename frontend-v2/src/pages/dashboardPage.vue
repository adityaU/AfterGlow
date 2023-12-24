<template>
  <template v-if="!currentUser.loading">
    <DashboardHeader
      class="ag-header a-transition"
      :class="
        sidebarExpanded ? 'tw-w-[calc(100%-254px)]' : 'tw-w-[calc(100%-50px)]'
      "
      v-model:dashboardModel="dashboard"
      v-model:editModeModel="editMode"
      v-model:showScheduleReport="showScheduleReport"
      @save="saveCount += 1"
      @toggleVariablePane="toggleVariablePaneCount += 1"
      @addNote="addNoteCount += 1"
      @addTabs="addTabsCount += 1"
      @fullScreen="fullScreenCount += 1"
      @addWidget="(data) => (addWidgetData = data) || true"
      :key="dashboardID"
    />
    <div
      class="tw-h-full ag-main-container m-transition"
      :class="editMode ? 'tw-mt-[100px]' : 'tw-mt-[45px]'"
    >
      <AGLoader text="Fetching Dashboard" v-if="loading" />
      <AGDashboardGrid
        class="tw-p-4"
        v-model:dashboardModel="dashboard"
        :dashboardKey="dashboardKey"
        :queryKey="queryKey"
        v-if="!loading"
        :editModeModel="editMode"
        :saveCount="saveCount"
        :dashboardID="dashboardID"
        :fullScreenCount="fullScreenCount"
        :toggleVariablePaneCount="toggleVariablePaneCount"
        :addNoteCount="addNoteCount"
        :addTabsCount="addTabsCount"
        v-model:showScheduleReport="showScheduleReport"
        :addWidgetData="addWidgetData"
        :key="reloadOn"
      />
    </div>
  </template>
  <AGLoader v-else />
</template>

<script>
import AGDashboardGrid from 'components/dashboard/grid.vue';

import AGLoader from 'components/utils/loader.vue';
import DashboardHeader from 'components/dashboard/header.vue';

import { useRoute } from 'vue-router';
import hash from 'src/helpers/hash';
import { queryStore } from 'src/stores/query';
import { fetchDashboard } from 'src/apis/dashboards';
import { authMixin } from 'src/mixins/auth';

import { sessionStore } from 'stores/session';
import { variableQuery } from 'stores/variableQuery';

import { sidebarState } from 'src/stores/sidebarStore';

import { currentUserStore } from 'stores/currentUser';

const sidebar = sidebarState();
const session = sessionStore();
const varStore = variableQuery();
const currentUser = currentUserStore();
export default {
  name: 'dashboardPage',
  components: {
    AGDashboardGrid,
    AGLoader,
    DashboardHeader,
  },
  mixins: [authMixin],
  watch: {
    sidebarStateVar() {
      this.sidebarExpanded = sidebarState.expanded;
    },
    $route(newValue, oldValue) {
      if (oldValue.params.id != newValue.params.id) {
        this.reloadPage();
        return;
      }
      this.makeQuery();
      varStore.sync(this.query);
      this.reloadKey += 1;
    },
  },
  computed: {
    sidebarExpanded() {
      return this.sidebar.expanded;
    },
    reloadOn() {
      return { reloadKey: this.reloadKey, dashboardID: this.dashboardID };
    },
  },
  data() {
    return this.resetData();
  },
  async created() {
    this.reCreate();
  },

  methods: {
    reloadPage() {
      Object.assign(this.$data, this.resetData());
      this.reCreate();
    },
    async reCreate() {
      this.queryKey = await hash(this.query);
      queryStore().push(this.query, this.queryKey);

      varStore.sync(this.query);

      let dashboardID = this.params.id || null;
      if (dashboardID) {
        this.dashboardID = dashboardID;
        fetchDashboard(
          dashboardID,
          { shareID: this.$route.query.share_id },
          this.query.token || session.token,
          this.setResultsKeyAndLoading
        );
      }
    },
    resetData() {
      const query = this.$route.query;
      const params = this.$route.params;
      return {
        query: query,
        queryKey: null,
        params: params,
        loading: true,
        dashboard: null,
        dashboardKey: null,
        dashboardID: null,
        showScheduleReport: false,
        editMode: false,
        saveCount: 0,
        fullScreenCount: 0,
        toggleVariablePaneCount: 0,
        addNoteCount: 0,
        addTabsCount: 0,
        reloadKey: 0,
        sidebar: sidebar,
        addWidgetData: null,
        currentUser: currentUser,
      };
    },
    setResultsKeyAndLoading(key, loading) {
      (this.loading = loading), (this.dashboardKey = key);
    },
    makeQuery() {
      let q = {};
      var params = new URLSearchParams(window.location.search);
      for (let p of params) {
        q[p[0]] = p[1];
      }
      this.query = q;
    },
  },
};
</script>
