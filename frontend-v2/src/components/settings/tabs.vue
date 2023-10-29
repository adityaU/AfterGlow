<template>
  <div class="">
    <div class="tw-flex tw-flex-col tw-border tw-rounded-sm tw-shadow-sm tw-border">
      <div
        class="tw-font-semibold tw-border-b tw-p-2 tw-cursor-pointer tw-bg-white last:tw-border-b-0 first:tw-rounded-t-xl last:tw-rounded-b-xl"
        :class="currentTab === tab.val ? 'tw-text-primary' : 'tw-text-default'" v-for="tab in tabs" :key="tab"
        @click="$emit('update:currentTab', tab.val)">
        {{ tab.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AGSettingsTabs',

  props: ['currentTab'],

  data() {
    return {
      tabs: [
        { name: 'Databases', val: 'databases' },
        { name: 'Users', val: 'users' },
        { name: 'Teams', val: 'teams' },
        { name: 'Organizations', val: 'organizations' },
        { name: 'Reports Configuration', val: 'reportsConfig' },
        { name: 'Frontend Configuration', val: 'frontendConfig' },
        { name: 'Permissions', val: 'permissions' },
        { name: 'OpenAI Configuration', val: 'openai' },
      ],
    };
  },
};
</script>
