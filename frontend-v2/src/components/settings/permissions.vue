<template>
  <div class="tw-flex tw-flex-col tw-mx-3 tw-gap-1 tw-w-full">
    <div
      class="tw-border tw-flex tw-items-center tw-py-2 tw-px-4 tw-gap-2 tw-bg-white tw-rounded-sm"
      v-for="permission in permissions"
      :key="permission"
    >
      <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
        <div class="tw-leading-3 tw-font-semibold">{{ permission.name }}</div>
        <div class="note tw-leading-2">
          {{ permission?.permissions?.join(', ') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AGSettingsPermissionss',

  data() {
    return {
      permissions: [
        {
          name: 'Admin',
          permissions: [
            'Dashboard.show',
            'Question.show',
            'Dashboard.edit',
            'Dashboard.create',
            'Dashboard.delete',
            'Question.edit',
            'Question.create',
            'Question.delete',
            'Settings.all',
          ],
        },
        {
          name: 'Creator',
          permissions: [
            'Dashboard.show',
            'Question.show',
            'Dashboard.edit',
            'Dashboard.create',
            'Dashboard.delete',
            'Question.edit',
            'Question.create',
            'Question.delete',
          ],
        },
        {
          name: 'Viewer',
          permissions: ['Dashboard.show', 'Question.show'],
        },
      ],
    };
  },
};
</script>
