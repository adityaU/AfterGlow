<template>
  <div class="tw-h-full">

    <AGLoader text="Fetching Dashboard" v-if="loading" />
    <AGDashboardGrid :dashboardKey="dashboardKey" :queryKey="queryKey" v-if="!loading" />
  </div>

</template>

<script>
import AGDashboardGrid from 'components/dashboard/grid.vue'

import AGLoader from 'components/utils/loader.vue'

import { useRoute } from 'vue-router';
import hash from 'src/helpers/hash'
import { queryStore } from 'src/stores/query'
import { fetchDashboard } from 'src/apis/dashboards'
import { authMixin } from 'src/mixins/auth';
export default {
  name: 'dashboardPage',
  components: { AGDashboardGrid, AGLoader },
  mixins: [authMixin],
  data() {
    const route = useRoute();
    const query = route.query
    const params = route.params
    return {
      query: query,
      queryKey: null,
      params: params,
      loading: true,
      dashboardKey: null
    }
  },
  async created() {
    this.queryKey = await hash(this.query)
    queryStore().push(this.query, this.queryKey)
    let dashboardID = this.params.id || null
    if (dashboardID) {
      fetchDashboard(dashboardID, {}, this.query.token, this.setResultsKeyAndLoading)
    }
    //   let questionID = this.params.id || this.query.question_id || null
    //   this.questionID = questionID
    //   this.payload.question_id = questionID
    //   if (questionID != null && questionID != 'null') {
    //     this.fetchQuestionApiActions(questionID)
    //     api.get('visualizations' + "?question_id=" + questionID, apiConfig(this.query.token)).then((response) => {
    //       this.fetchVizResults(response)
    //       this.updateVisulaization(response)
    //     })
    //   } else if (this.payload.database === null) {
    //     this.dataLoaded = true
    //     this.resultsKey = null
    //   }else{
    //     this.fetchQuestionResults()
    //   }
    //   this.dataLoaded = true
    // } else {
    //   this.resultsKey = 'empty'
    //   this.dataLoaded = true
    // }
  },

  methods: {
    setResultsKeyAndLoading(key, loading) {
      this.loading = loading,
        this.dashboardKey = key
    }
  }
}
</script>
