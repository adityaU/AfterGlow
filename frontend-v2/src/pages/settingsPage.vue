<template>
  <div>
    <WithLoginHeader />
    <div class="tw-flex tw-mx-6 tw-my-3">
      <AGSettingsTabs v-model:currentTab="currentTab" class="tw-w-[20%] " />
      <component :is="settingsComponents[currentTab]" :key="currentTab" />
    </div>
  </div>
</template>
<script>

import AGDatabases from 'components/settings/databases.vue'
import AGTeams from 'components/settings/teams.vue'
import AGFrontendConfig from 'components/settings/frontendConfiguration.vue'
import AGReportsConfig from 'components/settings/reportsConfiguration.vue'
import AGPermissions from 'components/settings/permissions.vue'
import AGUsers from 'components/settings/users.vue'
import AGSettingsTabs from 'components/settings/tabs.vue'
import AGOrganizations from 'components/settings/organizations.vue'
import WithLoginHeader from 'components/header/withLogin.vue'

import {authMixin} from 'src/mixins/auth'

import {currentUserStore} from 'src/stores/currentUser'


const currentUser = currentUserStore()
const settingsComponents = {
  databases: AGDatabases,
  teams: AGTeams,
  frontendConfig: AGFrontendConfig,
  reportsConfig: AGReportsConfig, 
  permissions: AGPermissions,
  users: AGUsers,
  organizations: AGOrganizations
}


export default {
  name: "AGSettingsPage",
  components: {AGSettingsTabs, WithLoginHeader},
  mixins: [authMixin],

  watch:{

    $route(){
      this.currentTab = this.$route.query?.currentTab || 'databases'
    },
    currentTab(){
      this.$router.push({query: {currentTab: this.currentTab}})
    },
    currentUser: {
      deep: true,
      handler(){

        if (!this.currentUser.isAdmin){
          this.$router.replace({path: "/questions"})
        }
      }
    }
  },
  data(){
    return {
      currentTab: this.$route?.query?.currentTab || "databases",
      settingsComponents: settingsComponents,
      currentUser: currentUser,
    }
  }
}
</script>
