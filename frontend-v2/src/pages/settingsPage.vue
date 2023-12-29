<template>
  <div v-if="!currentUser.loading">
    <div class="tw-flex tw-mr-6 tw-gap-4">
      <AGSettingsTabs v-model:currentTab="currentTab" class="tw-w-[220px] tw-h-[calc(100vh-33px)] tw-fixed" />
      <component :is="settingsComponents[currentTab]" :key="currentTab" class="tw-mr-6 tw-my-8 tw-ml-[240px]" />
    </div>
  </div>
  <AGLoader v-else />
</template>
<script>
import AGDatabases from 'components/settings/databases.vue';
import AGTeams from 'components/settings/teams.vue';
import AGFrontendConfig from 'components/settings/frontendConfiguration.vue';
import AGReportsConfig from 'components/settings/reportsConfiguration.vue';
import AGPermissions from 'components/settings/permissions.vue';
import AGUsers from 'components/settings/users.vue';
import AGSettingsTabs from 'components/settings/tabs.vue';
import AGOrganizations from 'components/settings/organizations.vue';

import AGOpenAIConfiguration from 'components/settings/openai.vue';
import AGLoader from 'components/utils/loader.vue';

import { authMixin } from 'src/mixins/auth';

import { currentUserStore } from 'src/stores/currentUser';

const currentUser = currentUserStore();
const settingsComponents = {
  databases: AGDatabases,
  teams: AGTeams,
  frontendConfig: AGFrontendConfig,
  reportsConfig: AGReportsConfig,
  permissions: AGPermissions,
  users: AGUsers,
  organizations: AGOrganizations,
  openai: AGOpenAIConfiguration,
};

export default {
  name: 'AGSettingsPage',
  components: { AGSettingsTabs, AGLoader },
  mixins: [authMixin],

  watch: {
    $route() {
      if (this.currentTab != this.$route.query?.currentTab) {
        this.currentTab = this.$route.query?.currentTab || 'databases';
      }
    },
    currentTab() {
      this.$router.push({ query: { currentTab: this.currentTab } });
    },
    currentUser: {
      deep: true,
      handler() {
        if (!this.currentUser.loading && !this.currentUser.isAdmin) {
          this.$router.replace({ path: '/questions' });
        }
      },
    },
  },
  data() {
    return {
      currentTab: this.$route?.query?.currentTab || 'databases',
      settingsComponents: settingsComponents,
      currentUser: currentUser,
    };
  },
};
</script>
