<template>
  <div>
    <div class="tw-p-2 tw-text-sm" v-if="!questionLevel">
      Pro tip: You can use column names/ question variables as variables. Use
      {{ escapedText }} in name, url, headers and body fields. Using this
      feature in name field replaces the action name by column value
    </div>
    <div
      class="tw-p-2 tw-text-sm"
      v-if="apiAction?.display_settings?.renderForm"
    >
      These additional variables from form are also available for you to use in
      the action.
      <template
        v-for="field in apiAction?.display_settings?.form?.fields"
        :key="field"
      >
        <span
          class="tw-px-2 tw-border tw-bg-secondary tw-mx-1"
          v-if="field.show && field.type === 'Field'"
        >
          {{ wrapInCurly(field.label) }}
        </span>
      </template>
      <span
        class="tw-cursor-pointer tw-text-primary tw-m-2"
        @click="$emit('editForm')"
        >Edit Form</span
      >
    </div>
    <div class="tw-grid tw-grid-cols-12">
      <div class="tw-col-span-4 tw-px-2 tw-mb-2" v-if="!questionLevel">
        <div class="tw-text-sm tw-font-semibold">Name</div>
        <AGInput
          label="Name"
          placeholder="Give it a name"
          class="tw-mb-1"
          v-model:value="apiActionLocal.name"
        />

        <div
          class="tw-py-1 tw-text-red-500 tw-text-sm"
          v-if="errorMessage.name && !questionLevel"
        >
          {{ errorMessage.name }}
        </div>
      </div>

      <div
        class="tw-col-span-1 tw-px-2 tw-mb-2 tw-text-right"
        v-if="!questionLevel"
      >
        <div class="tw-text-sm tw-font-semibold">color</div>
        <div class="tw-mb-1 tw-mt-1">
          <ColorSelect
            v-model:selectedColor="apiActionLocal.color"
            naked="true"
            :additionalColors="additionalColors"
          />
        </div>
      </div>
      <div
        class="tw-col-span-12 tw-px-2 tw-mb-2 tw-ml-[-10px] tw-mt-2"
        v-if="!questionLevel"
      >
        <q-toggle
          v-model="availability"
          color="primary"
          label="Available for current visualization only"
        />
      </div>

      <div
        class="tw-col-span-1 tw-px-2 tw-mb-2 tw-text-right"
        v-if="apiActionLocal.display_settings?.show_as_button && !questionLevel"
      >
        <div class="tw-text-sm tw-font-semibold">Background color</div>
        <div class="tw-mb-1 tw-mt-1">
          <ColorSelect
            v-model:selectedColor="
              apiActionLocal.display_settings.backgroundColor
            "
            naked="true"
            :additionalColors="additionalColors"
          />
        </div>
      </div>

      <div class="tw-col-span-12 tw-px-2 tw-mb-2" v-if="!questionLevel">
        <div class="tw-text-sm tw-font-semibold">Loading state message</div>
        <AGInput
          label="URL"
          placeholder="URL"
          class="tw-mb-1"
          v-model:value="apiActionLocal.loading_message"
        />
      </div>
      <div class="tw-col-span-12 tw-px-2 tw-mb-2">
        <div class="tw-text-sm tw-font-semibold">URL</div>
        <AGInput
          label="URL"
          placeholder="URL"
          class="tw-mb-1"
          v-model:value="apiActionLocal.url"
        />

        <div class="tw-py-1 tw-text-red-500 tw-text-sm" v-if="errorMessage.url">
          {{ errorMessage.url }}
        </div>
      </div>
      <div class="tw-col-span-12 tw-px-2 tw-mb-2">
        <div class="tw-text-sm tw-font-semibold">Method</div>
        <BoxSelect
          :options="methodOptions"
          v-model:selected="apiActionLocal.method"
          class="tw-mb-1 tw-border-b-0"
        />
      </div>
      <div class="tw-col-span-12 tw-px-2 tw-mb-2">
        <div class="tw-text-sm tw-font-semibold">Headers</div>
        <div
          class=""
          v-for="(header, index) in apiActionLocal.dummyHeaders"
          :key="header"
        >
          <div class="tw-grid tw-grid-cols-11">
            <div class="tw-col-span-5 tw-pr-1">
              <AGInput
                label="Name"
                placeholder="Header Key"
                class="tw-mb-1"
                v-model:value="header.name"
              />
            </div>
            <div class="tw-col-span-5 tw-pl-1">
              <AGInput
                label="Name"
                placeholder="Header Value"
                class="tw-mb-1"
                v-model:value="header.value"
              />
            </div>
            <AGButton
              class="tw-border-0 tw-text-primary tw-px-0 tw-text-red-500"
              @clicked="apiActionLocal.dummyHeaders.splice(index, 1)"
            >
              DELETE
            </AGButton>
          </div>
        </div>
        <AGButton
          class="tw-border-0 tw-text-primary tw-px-0"
          @clicked="
            apiActionLocal.dummyHeaders.push({ name: null, value: null })
          "
        >
          <PlusIcon size="14" class="tw-inline" /> Add Header
        </AGButton>
      </div>
      <div
        class="tw-col-span-12 tw-px-2 tw-mb-2"
        v-if="apiActionLocal.method != 'GET'"
      >
        <div class="tw-text-sm tw-font-semibold">Body</div>
        <AGInput
          label="Name"
          placeholder="Body"
          class="tw-mb-1"
          v-model:value="apiActionLocal.body"
          textArea="true"
          rows="10"
        />
      </div>
      <div
        class="tw-col-span-12 tw-px-2 tw-mb-2 tw-ml-[-10px]"
        v-if="apiActionLocal.method === 'GET' && !questionLevel"
      >
        <BoxSelect
          :options="openOptions"
          v-model:selected="apiActionLocal.open_option"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGButton from 'components/base/button.vue';

import BoxSelect from 'components/base/boxSelect.vue';
import ColorSelect from 'components/base/colorSelector.vue';

// import 'ace-builds/src-noconflict/mode-json';
// import 'ace-builds/src-noconflict/mode-html';
// import 'ace-builds/src-noconflict/mode-xml';
// import 'ace-builds/src-noconflict/theme-dracula';

import { PlusIcon } from 'vue-tabler-icons';

import { defaultColors } from 'src/helpers/colorGenerator';

import { cloneDeep } from 'lodash';
import { isEqual } from 'lodash';
import { api } from 'src/boot/axios';

const newHeader = { name: null, value: '' };
const newApiAction = {
  name: null,
  method: 'GET',
  color: defaultColors[0],
  url: null,
  headers: { '': null },
  dummyHeaders: [cloneDeep(newHeader)],
  open_in_new_tab: false,
  only_current_viz: false,
  question_id: null,
  visualization_id: null,
  loading_message: 'Running API Action',
  display_settings: {
    icon: null,
    display: 'name only',
    icon_as: 'prefix',
  },
  open_option: 'open-same-tab',
};
export default {
  name: 'ApiActionLink',
  props: [
    'link',
    'row',
    'columns',
    'queryKey',
    'questionID',
    'visualizationID',
    'apiAction',
    'questionLevel',
  ],
  components: { AGInput, BoxSelect, ColorSelect, AGButton, PlusIcon },
  data() {
    let openOption =
      this.apiAction &&
      !this.apiAction.open_option &&
      this.apiAction.open_in_new_tab
        ? 'open-new-tab'
        : (this.apiAction && this.apiAction.open_option) || 'open-same-tab';
    openOption = this.questionLevel ? 'show-in-modal' : openOption;
    const apiActionLocal = {
      ...cloneDeep(newApiAction),
      ...cloneDeep(this.apiAction),
      ...{ open_option: openOption },
    };

    apiActionLocal.dummyHeaders = this.makeDummyHeaders(apiActionLocal.headers);
    return {
      escapedText: '{{ column_name }}',
      loading: false,
      contentType: 'json',
      displayOptions: ['icon only', 'name only', 'both'].map((v) => {
        return { name: v, value: v };
      }),
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((item) => {
        return { name: item, value: item };
      }),
      openOptions: [
        { name: 'Open in New Tab', value: 'open-new-tab' },
        { name: 'Open in this tab', value: 'open-same-tab' },
        { name: 'Show Results in Modal', value: 'show-in-modal' },
      ],
      apiActionLocal: apiActionLocal,
      additionalColors: ['white', '#6e7687', '#f5f7fb'],
      prefixSuffixOptions: ['prefix', 'suffix'].map((v) => {
        return { name: v, value: v };
      }),
      error: null,
    };
  },

  watch: {
    headers: {
      deep: true,
      handler() {
        this.apiActionLocal.dummyHeaders = this.makeDummyHeaders(this.headers);
      },
    },
    apiActionLocal: {
      deep: true,
      handler() {
        if (this.questionLevel) {
          this.apiActionLocal.action_level = 'question_response';
        }
        if (this.apiActionLocal.question_id === null) {
          this.apiActionLocal.question_id = this.questionID;
        }
        if (!isEqual(this.apiAction, this.apiActionLocal)) {
          this.$emit('update:apiAction', this.apiActionLocal);
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
    headers() {
      return this.apiActionLocal.headers;
    },
    availability: {
      get() {
        return !(this.apiActionLocal.visualization_id === null);
      },
      set(value) {
        if (value) {
          this.apiActionLocal.visualization_id = this.visualizationID;
          return;
        }
        this.apiActionLocal.visualization_id = null;
      },
    },
    errorMessage() {
      if (this.error && this.error.errors) {
        let errorMessages = {};
        this.error.errors.forEach((error) => {
          errorMessages[error.source.pointer.replace('/data/attributes/', '')] =
            error.detail;
        });
        return errorMessages;
      }
      return {};
    },
  },

  methods: {
    wrapInCurly(name) {
      return `{{form:${name}}}`;
    },
    makeDummyHeaders(headers) {
      let dummyHeaders = [];
      Object.entries(headers).forEach((header) => {
        dummyHeaders.push({ name: header[0], value: header[1] });
      });
      return dummyHeaders;
    },
  },
};
</script>
