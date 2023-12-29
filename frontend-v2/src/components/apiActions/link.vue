<style scoped>
.btn {
  color: var(--color);
}

.btn:hover {
  opacity: 0.9;
}
</style>
<template>
  <div :style="buttonStyle" class="tw-cursor-pointer tw-flex tw-items-center tw-gap-1 btn tw-font-semibold"
    :class="fullWidth ? 'tw-w-full tw-items-center tw-justify-center' : ''" @click="clicked()">
    <AGTableCellFormatter :parentStyle="parentStyle" @update:parentStyle="(val) => $emit('update:parentStyle', val)"
      :formattingSettings="link.formattingSettings" dataType="text" :value="format(link.value)"
      :displayName="link.displayName" :class="fullWidth ? 'tw-flex-1 tw-justify-center tw-items-center' : ''" />
    <!--   <div v-html="iconHtmlWithCorrectSize" v-if="showIconPrefix && link.details.display_settings.icon" > -->
    <!--   </div> -->
    <!--   <div v-if="showText" class="tw-uppercase"> -->
    <!--   {{ format(link.value) }} -->
    <!--   </div> -->
    <!--   <div v-html="iconHtmlWithCorrectSize" v-if="showIconSuffix && link.details.display_settings.icon" > -->
    <!--   </div> -->
  </div>
  <AGModal v-model:show="open" :loading="loading" :size="loading ? 'small' : 'large'"
    :loadingMessage="link.details.loading_message">
    <template #header>
      <div class="tw-flex tw-w-full tw-items-center tw-pr-4">
        <div class="tw-p-2 tw-text-2xl tw-flex-1">Response</div>
        <div class="">
          <div :class="statusClass" class="tw-px-4 tw-py-0.5 tw-rounded-full">
            {{ response.status_code }}
          </div>
        </div>
      </div>
    </template>
    <template #body>
      <div class="tw-h-[300px]">
        <MonacoEditor theme="AGDraculaTheme" :value="response.response_body" :language="contentType"
          :options="{ languageWorkers: ['sql', 'json', 'html', 'xml'] }" @editorWillMount="editorWillMount"
          @editorDidMount="editorDidMount" @change="change" />
      </div>
    </template>
    <template #footer> </template>
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
</template>

<script>
import { queryStore } from 'stores/query';
import { api } from 'boot/axios';
import apiConfig from 'src/helpers/apiConfig';

import AGModal from 'components/utils/modal.vue';
import AGTableCellFormatter from 'components/widgets/tableWidgets/dataFormatting/widget.vue';
import MonacoEditor from 'monaco-editor-vue3';

import { AGDraculaTheme } from 'src/helpers/monacoTheme';
import { setSQLFormatter } from 'src/helpers/formatters';
import { shallowRef } from 'vue';

import { sendRequest } from 'src/apis/apiActions';

import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'ApiActionLink',
  props: ['link', 'queryKey', 'variables', 'showForm', 'fullWidth'],
  components: { AGModal, AGTableCellFormatter, MonacoEditor },
  data() {
    return {
      open: false,
      loading: false,
      contentType: 'json',
      editorInstance: null,
    };
  },

  computed: {
    statusClass() {
      if (
        this.response?.status_code >= 200 &&
        this.response?.status_code < 300
      ) {
        return 'tw-bg-green-700 tw-text-white';
      }
      if (
        this.response?.status_code >= 300 &&
        this.response?.status_code < 400
      ) {
        return 'tw-bg-blue-700 tw-text-white';
      }
      if (this.response?.status_code >= 400) {
        return 'tw-bg-red-700 tw-text-white';
      }

      return 'tw-bg-grey-700 tw-text-white';
    },
    showIconPrefix() {
      if (!(this.link.details && this.link.details.display_settings)) {
        return false;
      }
      if (
        ['icon only', 'both'].indexOf(
          this.link.details.display_settings.display
        ) >= 0 &&
        this.link.details.display_settings.icon_as != 'suffix'
      ) {
        return true;
      }
      return false;
    },

    showIconSuffix() {
      if (!(this.link.details && this.link.details.display_settings)) {
        return false;
      }
      if (
        ['icon only', 'both'].indexOf(
          this.link.details.display_settings.display
        ) >= 0 &&
        this.link.details.display_settings.icon_as === 'suffix'
      ) {
        return true;
      }
      return false;
    },

    showText() {
      if (!(this.link.details && this.link.details.display_settings)) {
        return true;
      }
      if (this.link.details.display_settings.display === 'icon only') {
        return false;
      }
      return true;
    },

    buttonStyle() {
      if (!(this.link.details && this.link.details.display_settings)) {
        return {
          '--background-color': null,
          '--color': this.link.details.color,
          '--padding': '0px 0px',
        };
      }
      if (this.link.details.display_settings.show_as_button) {
        return {
          '--background-color':
            this.link.details.display_settings.backgroundColor,
          '--color': this.link.details.color,
          '--border-color':
            this.link.details.display_settings.backgroundColor ===
              'rgb(var(--color-white))'
              ? 'var(--color-tertiary)'
              : this.link.details.display_settings.backgroundColor,
          '--padding': '0.5rem 1rem',
        };
      }
      return {
        '--background-color': null,
        '--color': this.link.details.color,
      };
    },

    iconHtmlWithCorrectSize() {
      if (!(this.link.details && this.link.details.display_settings)) {
        return null;
      }
      let html = this.link.details.display_settings.icon;
      if (!html) {
        return null;
      }
      html = html.replace(/width="\w*\d+\w*"/, 'width="16px"');
      html = html.replace(/height="\w*\d+\w*"/, 'height="16px"');
      return html;
    },
  },

  methods: {
    format(name) {
      this.variables.forEach((v) => {
        const r = new RegExp(`{{ *${v.name} *}}`, 'g');
        name = name.replace(r, v.value);
      });
      return name;
    },
    clicked() {
      if (this?.link?.details?.display_settings?.renderForm) {
        this.$emit('update:showForm', true);
        return;
      }
      this.sendRequest();
    },

    inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    },

    editorDidMount(editor) {
      this.editorInstance = shallowRef(editor);
      setTimeout(() => {
        this.editorInstance.updateOptions({
          readOnly: false,
          minimap: { enabled: false },
        });
        this.editorInstance.getAction('editor.action.formatDocument').run();
        setTimeout(() => {
          this.editorInstance.updateOptions({ readOnly: true });
        }, 500);
      }, 500);
    },
    editorWillMount(monaco) {
      // monaco.editor.defineTheme('AGDraculaTheme', AGDraculaTheme);
      // setSQLFormatter(monaco);
    },

    sendRequestCallback(isSuccess, data, loading) {
      this.loading = false;
      if (!isSuccess) {
        this.response = data;
        return;
      }
      if (data.redirect_url) {
        if (data.status === 301) {
          window.parent.window.open(data.redirect_url, '_blank');
        } else {
          if (data.redirect_url.match(/^http/)) {
            window.parent.window.open(data.redirect_url, '_self');
          } else {
            if (data.redirect_url.match(/^\//) && !this.inIframe()) {
              this.$router.push(data.redirect_url);
            } else {
              window.parent.window.open(data.redirect_url, '_self');
            }
          }
        }
        // this.loading = false
        this.open = false;
        return;
      }
      if (data.response_headers) {
        if (
          data.response_headers['Content-Type']?.match('html') ||
          data.response_headers['content-type']?.match('html')
        ) {
          this.contentType = 'html';
        }
        if (
          data.response_headers['Content-Type']?.match('json') ||
          data.response_headers['content-type']?.match('json')
        ) {
          this.contentType = 'json';
        }
        if (
          data.response_headers['Content-Type']?.match('xml') ||
          data.response_headers['content-type']?.match('xml')
        ) {
          this.contentType = 'xml';
        }
      }
      this.loading = false;
      this.response = data;
    },

    sendRequest() {
      this.open = false;

      const query = queryStore().get(this.queryKey);
      let variables = this.variables;

      const actionPayload = {
        variables: variables,
        api_action: this.link.details,
      };
      this.loading = true;
      this.open = true;
      sendRequest(
        this.link?.details?.id,
        actionPayload,
        query.token,
        this.sendRequestCallback
      );
    },
  },
};
</script>
