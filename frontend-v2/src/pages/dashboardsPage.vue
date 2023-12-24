<template>
  <template v-if="!currentUser.loading">
    <AllDashboardsHeader />

    <div class="tw-flex tw-items-center tw-justify-center tw-p-4">
      <AGInput
        v-model:value="query"
        placeholder="Search Dashboard"
        class="tw-w-[500px]"
        debounce="500"
      />
    </div>
    <AGLoader v-if="loading" />

    <div
      class="tw-grid tw-grid-cols-4 tw-mx-6 tw-my-3 tw-gap-2 tw-flex-wrap tw-justify-center"
    >
      <div
        class="tw-flex tw-bg-white tw-p-2 tw-border tw-items-center tw-w-full tw-rounded-2xl"
        v-for="dashboard in dashboards"
        :key="dashboard"
      >
        <LayoutBoardIcon size="48" class="icon-primary tw-p-2 tw-shrink-0" />
        <div class="tw-flex tw-flex-col tw-w-full tw-flex-1">
          <router-link
            class="tw-font-semibold tw-text-primary tw-text-xl tw-whitespace-nowrap tw-overflow-ellipsis tw-overflow-hidden tw-max-w-[80%]"
            :to="'/dashboards/' + dashboard.id"
            >{{ dashboard.title }}</router-link
          >
          <div class="note">{{ dashboard.description }}</div>
        </div>
      </div>
    </div>
  </template>
  <AGLoader v-else />
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import AllDashboardsHeader from 'components/dashboard/allDashbaordsHeader.vue';
import AGInput from 'components/base/input.vue';

import { LayoutBoardIcon } from 'vue-tabler-icons';
import { fetchDashboards, searchDashboards } from 'src/apis/dashboards';

import { authMixin } from 'src/mixins/auth';

import { sessionStore } from 'stores/session';
import { currentUserStore } from 'stores/currentUser';

const session = sessionStore();
const currentUser = currentUserStore();
export default {
  name: 'AGDashboardsPage',
  components: {
    AGLoader,
    LayoutBoardIcon,
    AllDashboardsHeader,
    AGInput,
  },
  mixins: [authMixin],
  watch: {
    query() {
      searchDashboards(this.query, (dashboards, loading) => {
        this.dashboards = dashboards;
        this.loading = loading;
      });
    },
  },
  mounted() {
    fetchDashboards(session.token, (dashboards, loading) => {
      this.dashboards = dashboards;
      this.loading = loading;
    });
  },

  data() {
    return {
      dashboards: [],
      loading: false,
      currentUser: currentUser,
      query: '',
    };
  },
};
</script>
