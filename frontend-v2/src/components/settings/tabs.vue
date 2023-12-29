<template>
  <div class="">
    <div class="tw-flex tw-flex-col tw-border tw-h-full tw-bg-white">
      <div
        class="tw-font-semibold tw-border-b tw-p-2 tw-cursor-pointer last:tw-border-b-0 hover:tw-text-white hover:tw-bg-primary"
        :class="currentTab === tab.val ? 'tw-text-primary' : 'tw-text-default'" v-for="tab in tabs" :key="tab"
        @click="$emit('update:currentTab', tab.val)">
        <div class="tw-flex tw-gap-2 tw-items-center">
          <component :is="tab.icon" />
          {{ tab.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DatabaseIcon, UserIcon, UsersIcon, AffiliateIcon, MailCogIcon, TableOptionsIcon, LockAccessIcon, RobotIcon } from 'vue-tabler-icons';
export default {
  name: 'AGSettingsTabs',

  props: ['currentTab'],

  data() {
    return {
      tabs: [
        { name: 'Databases', val: 'databases', icon: DatabaseIcon },
        { name: 'Users', val: 'users', icon: UserIcon },
        { name: 'Teams', val: 'teams', icon: UsersIcon },
        { name: 'Organizations', val: 'organizations', icon: AffiliateIcon },
        { name: 'Reports Configuration', val: 'reportsConfig', icon: MailCogIcon },
        { name: 'Frontend Configuration', val: 'frontendConfig', icon: TableOptionsIcon },
        { name: 'Permissions', val: 'permissions', icon: LockAccessIcon },
        { name: 'OpenAI Configuration', val: 'openai', icon: RobotIcon },
      ],
    };
  },
};
</script>
