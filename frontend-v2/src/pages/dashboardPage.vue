<template>
  <WithLoginHeader />
  <DashboardHeader v-model:dashboardModel="dashboard" v-model:editModeModel="editMode"
    v-model:showScheduleReport="showScheduleReport" 
    @save="saveCount += 1" 
    @toggleVariablePane="toggleVariablePaneCount += 1"
    @addNote="addNoteCount +=1"
    @fullScreen="fullScreenCount += 1" :key="dashboardID" />
  <div class="tw-h-full">

    <AGLoader text="Fetching Dashboard" v-if="loading" />
    <AGDashboardGrid class="tw-p-4" v-model:dashboardModel="dashboard" :dashboardKey="dashboardKey" :queryKey="queryKey" v-if="!loading" 
      :editModeModel="editMode"
      :saveCount="saveCount"
      :dashboardID="dashboardID" 
      :fullScreenCount="fullScreenCount"
      :toggleVariablePaneCount="toggleVariablePaneCount"
      :addNoteCount="addNoteCount"
      :showScheduleReport="showScheduleReport" :key="reloadOn" />

  </div>
  <AGFooter />

</template>

<script>
import AGDashboardGrid from 'components/dashboard/grid.vue'

import AGLoader from 'components/utils/loader.vue'
import WithLoginHeader from 'components/header/withLogin.vue'
import DashboardHeader from 'components/dashboard/header.vue'
import AGFooter from 'components/footer/static.vue'

import { useRoute } from 'vue-router';
import hash from 'src/helpers/hash'
import { queryStore } from 'src/stores/query'
import { fetchDashboard } from 'src/apis/dashboards'
import { authMixin } from 'src/mixins/auth';

import { sessionStore } from 'stores/session'
import {variableQuery} from 'stores/variableQuery'

const session = sessionStore()
const varStore = variableQuery()
export default {
  name: 'dashboardPage',
  components: { AGDashboardGrid, AGLoader, WithLoginHeader, DashboardHeader, AGFooter },
  mixins: [authMixin],
  watch: {
    $route( newValue, oldValue){
      if (oldValue.params.id != newValue.params.id){
        this.reloadPage()
        return
      }
      this.makeQuery()
      varStore.sync(this.query)
      this.reloadKey += 1
    }

  },
  computed: {
    reloadOn(){
      return {reloadKey: this.reloadKey, dashboardID: this.dashboardID}
    }
  },
  data() {
    return this.resetData()
  },
  async created() {
    this.reCreate()
  },

  methods: {
    reloadPage(){
      Object.assign(this.$data, this.resetData())
      this.reCreate()
    },
    async reCreate(){

      this.queryKey = await hash(this.query)
      queryStore().push(this.query, this.queryKey)

      varStore.sync(this.query)

      let dashboardID = this.params.id || null
      if (dashboardID) {
        this.dashboardID = dashboardID
        fetchDashboard(dashboardID, {shareID: this.$route.query.share_id}, this.query.token || session.token, this.setResultsKeyAndLoading)
      }
    },
    resetData(){
      const query = this.$route.query
      const params = this.$route.params
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
        reloadKey: 0,
      }
    },
    setResultsKeyAndLoading(key, loading) {
      this.loading = loading,
      this.dashboardKey = key
    },
    makeQuery() {
      let q = {}
      var params = new URLSearchParams(window.location.search)
      for (let p of params) {
        q[p[0]] = p[1] 
      }
      this.query = q
    }
  }
}
</script>
