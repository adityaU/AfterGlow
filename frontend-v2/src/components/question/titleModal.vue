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
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">Give it a Name!</div>
      </template>
      <template #body>
        <div class="tw-p-4">
          <div class="tw-p-2 divide-y tw-flex tw-flex-col tw-gap-2">
            <div class="tw-flex item-3070-columns">
              <div class="label">Title</div>
              <AGInput
                placeholder="What do you wanna call it ? "
                v-model:value="questionLocal.title"
              />
            </div>
            <div class="tw-flex item-3070-columns">
              <div class="label">description</div>
              <AGInput
                placeholder="What does it do? "
                v-model:value="questionLocal.description"
              />
            </div>
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
            @clicked="($emit('save') || true) && $emit('update:open', false)"
          >
            Save
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

import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import { fetchRecipients } from 'src/apis/recipients';
export default {
  name: 'AGTitleModal',
  components: { AGModal, AGButton, AGInput },
  props: ['open', 'question'],

  watch: {
    question: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.questionLocal, this.question)) {
          this.questionLocal = cloneDeep(this.question);
        }
      },
    },

    questionLocal: {
      deep: true,
      handler(newv, oldv) {
        this.$emit('update:question', this.questionLocal);
      },
    },
  },

  data() {
    return {
      emailOptions: [],
      questionLocal: cloneDeep(this.question || {}),
      session: sessionStore(),
    };
  },
};
</script>
