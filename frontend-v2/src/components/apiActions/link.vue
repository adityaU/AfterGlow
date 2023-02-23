<style scoped>
.btn {
  color: var(--color);
}

.btn:hover {
  opacity: 0.9;
}
</style>
<template>
  <div
    :style="buttonStyle"
    class="tw-rounded-sm tw-cursor-pointer tw-flex tw-items-center tw-gap-1 btn tw-font-semibold"
    @click="clicked()"
  >
    <AGTableCellFormatter
      :parentStyle="parentStyle"
      @update:parentStyle="(val) => $emit('update:parentStyle', val)"
      :formattingSettings="link.formattingSettings"
      dataType="text"
      :value="format(link.value)"
      :displayName="link.displayName"
    />
    <!--   <div v-html="iconHtmlWithCorrectSize" v-if="showIconPrefix && link.details.display_settings.icon" > -->
    <!--   </div> -->
    <!--   <div v-if="showText" class="tw-uppercase"> -->
    <!--   {{ format(link.value) }} -->
    <!--   </div> -->
    <!--   <div v-html="iconHtmlWithCorrectSize" v-if="showIconSuffix && link.details.display_settings.icon" > -->
    <!--   </div> -->
  </div>
  <AGModal
    v-model:show="open"
    :loading="loading"
    :size="loading ? 'small' : 'large'"
    :loadingMessage="link.details.loading_message"
  >
    <template #header>
      <div class="tw-p-2 tw-text-2xl">Response</div>
    </template>
    <template #body>
      <v-ace-editor
        :value="response.response_body"
        @init="editorInit"
        :lang="contentType"
        theme="dracula"
        readonly
        min-lines="2"
        max-lines="35"
      />
    </template>
    <template #footer> </template>
  </AGModal>

  <!-- <div v-if="open" class="tw-flex tw-inset-0 tw-z-50 tw-absolute tw-bg-default/80"> -->
  <!--   <div  -->
  <!--     class="tw-flex tw-inset-[5%] tw-z-50 tw-absolute tw-border tw-rounded-sm tw-shadow-sm tw-bg-white"> -->
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

import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'ApiActionLink',
  props: ['link', 'queryKey', 'variables', 'showForm'],
  components: { AGModal, AGTableCellFormatter },
  data() {
    return { open: false, loading: false, contentType: 'json' };
  },

  computed: {
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
            this.link.details.display_settings.backgroundColor === 'white'
              ? '#e5e7eb'
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

    sendRequest() {
      this.open = false;

      const query = queryStore().get(this.queryKey);
      let variables = this.variables;

      const actionPayload = {
        variables: variables,
        api_action: this.link.details,
      };
      let url = 'api_actions/send_request';
      if (this.link.details.id) {
        url = 'api_actions/' + this.link.details.id + '/send_request';
      }
      this.loading = true;
      this.open = true;
      api
        .post(url, actionPayload, apiConfig(query.token))
        .then((response) => {
          if (response.data.redirect_url) {
            if (response.data.status === 301) {
              window.parent.window.open(response.data.redirect_url, '_blank');
            } else {
              if (response.data.redirect_url.match(/^http/)) {
                window.parent.window.open(response.data.redirect_url, '_self');
              } else {
                if (
                  response.data.redirect_url.match(/^\//) &&
                  !this.inIframe()
                ) {
                  this.$router.push(response.data.redirect_url);
                } else {
                  window.parent.window.open(
                    response.data.redirect_url,
                    '_self'
                  );
                }
              }
            }
            // this.loading = false
            this.open = false;
            return;
          }
          if (response.data.response_headers) {
            if (response.data.response_headers['Content-Type'].match('html')) {
              this.contentType = 'html';
            }
            if (response.data.response_headers['Content-Type'].match('json')) {
              this.contentType = 'json';
            }
            if (response.data.response_headers['Content-Type'].match('xml')) {
              this.contentType = 'xml';
            }
          }
          this.loading = false;
          this.response = response.data;
        })
        .catch((error) => {
          this.loading = false;
          this.response = error.data;
        });
    },
  },
};
</script>
