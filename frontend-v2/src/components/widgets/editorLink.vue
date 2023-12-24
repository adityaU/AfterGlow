<template>
  <AGModal
    size="small"
    :show="open"
    @update:show="(val) => $emit('update:show', val)"
    :loading="loading"
    :loadingMessage="loadingMessage"
  >
    <template #header>
      <div class="tw-p-2 tw-text-2xl tw-font-semibold">Set Link</div>
    </template>
    <template #body>
      <div class="tw-p-4">
        <AGInput
          label="URL"
          :value="linkUrl"
          @inputed="(val) => $emit('update:linkUrl', val)"
        />
        <AGBool
          label="Open in New Tab"
          :value="openNewTab"
          @update:value="(v) => $emit('update:openNewTab', v)"
        />
      </div>
    </template>
    <template #footer>
      <div class="tw-grid tw-grid-cols-12">
        <div class="tw-col-start-11 tw-col-span-2 tw-p-2 tw-text-right">
          <AGButton
            class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2"
            @clicked="$emit('update:open', false)"
          >
            Cancel
          </AGButton>

          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary tw-ml-2 tw-p-2"
            @clicked="
              ($emit('update:open', false) || true) && $emit('updateLink')
            "
          >
            Save
          </AGButton>
        </div>
      </div>
    </template>
  </AGModal>
</template>

<script>
import { queryStore } from 'stores/query';
import { api } from 'boot/axios';
import apiConfig from 'src/helpers/apiConfig';
import AGModal from 'components/utils/modal.vue';
import AGBool from 'components/base/bool.vue';
import AGButton from 'components/base/button.vue';
import AGInput from 'components/base/agInput.vue';

export default {
  name: 'AGEditorLink',
  props: ['apiActionID', 'queryKey', 'open', 'linkUrl', 'openNewTab'],
  components: { AGModal, AGButton, AGInput, AGBool },
  data() {
    return {
      loading: false,
    };
  },
};
</script>
