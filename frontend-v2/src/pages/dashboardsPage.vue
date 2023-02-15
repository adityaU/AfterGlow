<template>
  <WithLoginHeader />
  <AllDashboardsHeader />
  <AGLoader v-if="loading" />

  <div class="tw-grid tw-grid-cols-5 tw-mx-6 tw-my-3 tw-gap-2 tw-flex-wrap tw-justify-center">
    <div class="tw-flex tw-bg-white tw-p-2 tw-border tw-items-center tw-w-full" v-for="dashboard in dashboards" :key="dashboard" >
      
      <LayoutBoardIcon size=48 class="icon-primary tw-p-2 tw-shrink-0" />
      <div class="tw-flex tw-flex-col tw-w-full tw-flex-1">
      <router-link class="tw-font-semibold tw-text-primary tw-text-xl tw-whitespace-nowrap tw-overflow-ellipsis tw-overflow-hidden tw-max-w-[80%]" :to="'/dashboards/'+ dashboard.id">{{dashboard.title}}</router-link>
        <div class="note"> {{dashboard.description}}</div>
      </div>
    </div>
  </div>

    <AGFooter />
</template>

<script>
import WithLoginHeader from 'components/header/withLogin.vue'
import AGLoader from 'components/utils/loader.vue'
import AGFooter from 'components/footer/static.vue'
import AllDashboardsHeader from 'components/dashboard/allDashbaordsHeader.vue'

import {LayoutBoardIcon} from 'vue-tabler-icons'
import {fetchDashboards} from 'src/apis/dashboards'

import { authMixin } from 'src/mixins/auth'

import {sessionStore} from 'stores/session'

const session = sessionStore()
export default {
  name: "AGDashboardsPage",
  components: {WithLoginHeader, AGLoader, LayoutBoardIcon, AGFooter, AllDashboardsHeader},
  mixins: [authMixin],
  mounted(){
    fetchDashboards(session.token, (dashboards, loading) => {
    this.dashboards = dashboards
    this.loading = loading
    })
  },

  data(){
    return {
      dashboards: [],
      loading: false
    }
  }
}
</script>
