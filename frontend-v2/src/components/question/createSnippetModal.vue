<template>
  <teleport to="body">
    <AGModal
      class="!tw-fixed"
      size="small"
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
      :loading="loading"
      :loadingMessage="loadingMessage"
    >
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">Create Snippet</div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y tw-flex tw-flex-col tw-gap-2">
          <div class="label">Name</div>
          <AGInput
            placeholder="Snippet Name"
            v-model:value="name"
            :class="
              errors.name ? 'tw-border-red-700 tw-border tw-rounded-sm' : ''
            "
          />
          <div class="note tw-text-red-700" v-if="errors.name">
            Name {{ errors.name?.join(', ') }}
          </div>
          <div class="label">Snippet</div>
          <AGInput
            placeholder="where created.at = {{created_at}} "
            v-model:value="textLocal"
            textArea="true"
          />
          <AGBool v-model:value="expandOnSelect" label="Expand when used" />
          <div class="note">
            This snippet will be available for use for all queries on current
            database. All Editors/ Admins on Afterglow will be able to use it.
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton
            class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="$emit('update:open', false)"
          >
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="
              !(this.name && this.textLocal && this.databaseID)
                ? 'disabled'
                : ''
            "
            @clicked="save() || true"
          >
            {{ this.id ? 'Save' : 'Create' }}
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
import AGBool from 'components/base/bool.vue';

import { createSnippet } from 'src/apis/snippet';

import { sessionStore } from 'stores/session';

export default {
  name: 'AGTitleModal',
  components: { AGModal, AGButton, AGInput, AGBool },
  props: ['open', 'databaseID', 'text'],

  watch: {
    text() {
      if (this.text != this.textLocal) {
        this.textLocal = this.text;
      }
    },
  },

  data() {
    return {
      name: null,
      textLocal: this.text,
      expandOnSelect: false,
      errors: {},
      session: sessionStore(),
    };
  },
  methods: {
    emitSnippet(response) {
      if (response.status === 400) {
        this.errors = response.data.error;
        return;
      }
      if (response) {
        this.$emit('update:open', false);
        this.$emit('newSnippet', response);
      }
    },
    save() {
      if (!(this.name && this.textLocal && this.databaseID)) {
        return;
      }
      const payload = {
        name: this.name,
        text: this.textLocal,
        expand_on_select: this.expandOnSelect,
        database_id: this.databaseID,
      };
      createSnippet(payload, this.emitSnippet);
    },
  },
};
</script>
