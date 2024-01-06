<template>
  <teleport to="body">
    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)">
      <template #header>
        <div class="tw-px-4 tw-py-2 tw-text-2xl tw-font-semibold">Create Users</div>
      </template>
      <template #body>
        <div class="tw-px-4 tw-py-2 divide-y">
          <div class="label">Access Level</div>
          <div class="input-border tw-px-2 tw-py-1" v-if="permissionSets">
            {{ permissionSet?.name || 'Select Access level' }}

            <q-menu flat="true" transition-show="scale" transition-hide="scale" max-height="800px"
              class="tw-rounded-2xl tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown" fit>
              <SelectOptions :options="permissionSets" v-model:selected="permissionSet" :menuShow="menuShow"
                displayKey="name" areOptionObjects="true" hideOnClick="true" hideSearch="true" />
            </q-menu>
          </div>
          <div class="label tw-mt-4">Emails</div>
          <AGInput v-model:value="newUserEmails" textArea="true" placeholder="Enter comma separated emails" />

          <div class="note">
            Users for all these email ids will be created only if -
          </div>
          <div class="note">
            1. User does not exist already with same email ID. Access level will
            not change for existing users
          </div>
          <div class="note">
            2. Email domain is included in organization list or allowed via
            environment variables.
          </div>
          <div class="note">All other email ids are ignored.</div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-px-4 tw-py-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')">
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="newUserEmails && permissionSet ? '' : 'disabled'" @clicked="save() || true">
            Create
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>
</template>
<script>
import AGModal from 'components/utils/modal.vue';
import AGButton from 'components/base/button.vue';
import AGInput from 'components/base/input.vue';
import SelectOptions from 'components/base/selectOptions.vue';

import { fetchPermissionSets, createBulkUsers } from 'src/apis/user';

export default {
  name: 'AGCreateUsers',
  components: { AGModal, AGButton, AGInput, SelectOptions },
  props: ['open'],

  data() {
    return {
      newUserEmails: '',
      permissionSet: null,
      permissionSets: [],
    };
  },

  mounted() {
    fetchPermissionSets(this.setPermissionSets);
  },

  methods: {
    setPermissionSets(ps, _loading) {
      this.permissionSets = ps;
    },
    save() {
      const emails = this.newUserEmails.split(',').map((e) => e.trim());
      createBulkUsers(emails, +this.permissionSet?.id, (_t, loading) => {
        if (!loading) {
          this.$emit('refresh');
          this.$emit('update:open', false);
        }
      });
    },
  },
};
</script>
