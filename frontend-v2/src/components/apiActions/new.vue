<template>
  <Teleport to="body">
    <div
      class="tw-text-indigo-700 tw-text-teal-700 tw-text-red-700 tw-text-yellow-700 tw-hidden"
    ></div>
    <AGModal
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
      :loading="loading"
      size="small"
      :loadingMessage="loadingMessage"
    >
      <template #header>
        <div
          class="tw-p-2 tw-text-2xl tw-font-semibold"
          v-if="!apiActionLocal.id"
        >
          Create API Action
        </div>
        <div
          class="tw-p-2 tw-text-2xl tw-font-semibold"
          v-if="apiActionLocal.id"
        >
          Edit API Action
        </div>
      </template>
      <template #body>
        <div class="tw-p-4">
          <AGApiActionForm
            :link="link"
            :row="row"
            :columns="columns"
            :queryKey="queryKey"
            :questionID="questionID"
            :visualizationID="visualizationID"
            @editForm="$emit('editForm')"
            v-model:apiAction="apiActionLocal"
          />
        </div>
      </template>
      <template #footer>
        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-start-11 tw-col-span-2 tw-p-2 tw-text-right">
            <AGButton
              class="tw-text-default hover:tw-bg-secondary tw-mr-2"
              @clicked="$emit('update:open', false)"
            >
              Cancel
            </AGButton>

            <AGButton
              class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary tw-ml-2"
              @clicked="save"
              v-if="apiActionLocal.id"
            >
              Save
            </AGButton>
            <AGButton
              class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary"
              @clicked="save"
              v-if="!apiActionLocal.id"
            >
              Create
            </AGButton>
          </div>
        </div>
      </template>
    </AGModal>

    <!-- <div v-if="open" class="tw-flex tw-inset-0 tw-z-50 tw-absolute tw-bg-default/80"> -->
    <!--   <div  -->
    <!--     class="tw-flex tw-inset-[5%] tw-z-50 tw-absolute tw-border tw-rounded-2xl  tw-bg-white"> -->
    <!--     <div class="" v-if="!loading"> -->
    <!--       <div class="header tw-p-2 tw-border-b tw-text-2xl tw-"> -->
    <!--         Action Response -->
    <!--       </div> -->
    <!--       <div class="tw-p-2 tw-border-b tw-overflow-auto"> -->
    <!---->
    <!--         {{ response.response_body }} -->
    <!---->
    <!--       </div> -->
    <!--       <div class="tw-p-2 tw-border-t tw-inset-b-0 tw-absolute tw-w-100%"> -->
    <!---->
    <!--       </div> -->
    <!---->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </div> -->
  </Teleport>
</template>

<script>
import { queryStore } from 'stores/query';
import { api } from 'boot/axios';
import apiConfig from 'src/helpers/apiConfig';
import AGButton from 'components/base/button.vue';

import AGModal from 'components/utils/modal.vue';
import AGApiActionForm from 'components/apiActions/newFlat.vue';

// import 'ace-builds/src-noconflict/mode-json';
// import 'ace-builds/src-noconflict/mode-html';
// import 'ace-builds/src-noconflict/mode-xml';
// import 'ace-builds/src-noconflict/theme-dracula';

import { cloneDeep } from 'lodash';
import { createApiAction, updateApiAction } from 'src/apis/apiActions';
import Editor from '../question/editor.vue';

export default {
  name: 'ApiActionLink',
  props: [
    'link',
    'row',
    'columns',
    'queryKey',
    'open',
    'questionID',
    'visualizationID',
    'apiAction',
  ],
  components: { AGModal, AGButton, AGApiActionForm },
  data() {
    const openOption =
      this.apiAction &&
      !this.apiAction.open_option &&
      this.apiAction.open_in_new_tab
        ? 'open-new-tab'
        : (this.apiAction && this.apiAction.open_option) || 'open-same-tab';
    return {
      escapedText: '{{ column_name }}',
      loading: false,
      contentType: 'json',
      apiActionLocal: cloneDeep(this.apiAction),
    };
  },

  watch: {
    apiActionLocal: {
      deep: true,
      handler() {
        if (this.apiActionLocal.question_id === null) {
          this.apiActionLocal.question_id = this.questionID;
        }
      },
    },
  },

  computed: {
    loadingMessage() {
      if (this.apiActionLocal && this.apiActionLocal.id) {
        return 'Saving API Action';
      }
      return 'Creating API Action';
    },
  },

  methods: {
    wrapInCurly(name) {
      return `{{form:${name}}}`;
    },
    saveCallback(isSuccess, loading, data) {
      this.loading = loading;
      if (isSuccess) {
        this.$emit('update:apiAction');
        this.$emit('update:open', false);
      } else {
        this.error = data;
      }
    },
    save() {
      const query = queryStore().get(this.queryKey);
      this.apiActionLocal.headers = {};
      this.apiActionLocal.dummyHeaders &&
        this.apiActionLocal.dummyHeaders.forEach((item) => {
          this.apiActionLocal.headers[item.name] = item.value;
        });
      this.loading = true;
      if (this.apiActionLocal.id) {
        updateApiAction(this.apiActionLocal, query.token, this.saveCallback);
        return;
      }
      createApiAction(this.apiActionLocal, query.token, this.saveCallback);
    },
  },
};
</script>
