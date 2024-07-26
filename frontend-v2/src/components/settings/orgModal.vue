<template>
  <teleport to="body">
    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)">
      <template #header>
        <div class="tw-px-4 tw-py-2 tw-text-2xl tw-font-semibold">
          Org Settings
        </div>
      </template>
      <template #body>
        <div class="tw-p-4">
          <div class="tw-p-2 divide-y">
            <div class="label">Name</div>
            <AGInput v-model:value="orgLocal.name" placeholder="What do you call it?" debounce="300" />

            <div class="label tw-mt-2">Google Domain</div>
            <AGInput v-model:value="orgLocal.google_domain" placeholder="google domain" debounce="300"
              :disabled="orgLocal.id ? true : false" />
          </div>
          <div class="tw-p-2 divide-y tw-mt-2" v-if="orgLocal.id">
            <div class="tw-font-semibold tw-text-lg">Settings</div>

            <div class="label">Maximum Number of Rows in Exports/Reports</div>
            <AGInput v-model:value="downloadLimitSettings.value" v-if="downloadLimitSettings"
              placeholder="How many rows can members download?" type="number" debounce="300" />
            <div class="note">
              This limit overrides Global Limit. It can be overriden by User
              level. Empty means no limit.
            </div>

            <div class="label tw-mt-2">Maximum Number of Rows on frontend</div>
            <AGInput v-model:value="frontendLimitSettings.value" v-if="frontendLimitSettings"
              placeholder="How many rows can members see on frontend ?" type="number" debounce="300" />
            <div class="note">
              Limit more than 2000 is ignored. This limit overrides Global Limit
              for frontend.
            </div>

            <AGBool v-model:value="canDownloadSetting.value" v-if="canDownloadSetting" label="Can Download Reports"
              class="label tw-mt-2" />
            <div class="note">
              Use this option to disable downloads for this organization. This
              overrides the Global Value. This is overriden by User Level Value.
            </div>

            <AGHorizontalDivider class="tw-my-2" />

            <div class="tw-p-2 divide-y">
              <div class="label tw-mt-4 tw-mb-1">Select GenAI SQL Generation Provider</div>

              <AGSelect v-model:selected="genAIProvider.value" :options="providerOptions" placeholder="Select a provider"
                v-if="genAIProvider" />

              <template v-if="genAIProvider?.value == 'NONE'">

                <div class="note tw-mt-4">
                  GenAI SQL Generation is disabled for this Afterglow installation. However, <template
                    v-if="usersCanOverrideGenAIConfig.value != 'false'"> Editors and Admins
                    can enable it by providing their own configuration.</template>
                </div>

              </template>

              <template v-if="genAIProvider?.value != 'NONE'">
                <div class="note tw-mt-4">
                  This will enable integration for generating SQL from text.
                </div>
              </template>

              <template v-if="genAIProvider?.value == 'OPENAI'">
                <div class="label tw-mt-4 tw-mb-1">OpenAI API Key</div>
                <AGInput v-model:value="openAIAPIKey.value" placeholder="OpenAI API Key" type="password" debounce="300" />

                <div class="label tw-mt-4 tw-mb-1">OpenAI Model Name</div>
                <AGInput v-model:value="openAIModelName.value" placeholder="OpenAI Model Name" type="text"
                  debounce="300" />

                <div class="label tw-mt-4 tw-mb-1">OpenAI API URL</div>
                <AGInput v-model:value="openAIAPIURL.value" placeholder="API URL" type="text" debounce="300" />
              </template>

              <template v-if="genAIProvider?.value == 'CLAUDE'">
                <div class="label tw-mt-4 tw-mb-1">Claude API Key</div>
                <AGInput v-model:value="claudeAPIKey.value" placeholder="Claude API Key" type="password" debounce="300" />

                <div class="label tw-mt-4 tw-mb-1">Claude Model Name</div>
                <AGInput v-model:value="claudeModelName.value" placeholder="Claude Model Name" type="text"
                  debounce="300" />

                <div class="label tw-mt-4 tw-mb-1">Claude API URL</div>
                <AGInput v-model:value="claudeAPIURL.value" placeholder="API URL" type="text" debounce="300" />
              </template>

              <template v-if="genAIProvider?.value == 'OLLAMA'">
                <div class="label tw-mt-4 tw-mb-1">Ollama API Key</div>
                <AGInput v-model:value="ollamaAPIKey.value" placeholder="Ollama API Key" type="password" debounce="300" />

                <div class="label tw-mt-4 tw-mb-1">Ollama Model Name</div>
                <AGInput v-model:value="ollamaModelName.value" placeholder="Ollama Model Name" type="text"
                  debounce="300" />

                <div class="label tw-mt-4 tw-mb-1">Ollama API URL</div>
                <AGInput v-model:value="ollamaAPIURL.value" placeholder="API URL" type="text" debounce="300" />
              </template>

              <AGBool v-model:value="usersCanOverrideGenAIConfig.value" label="Users can override OpenAI Key"
                v-if="usersCanOverrideGenAIConfig" />

              <div class="note tw-mt-4">
                Enabling this will allow individual editors and admins to use
                their own openAI key. Useful when you are using free version of
                openAI.
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')">
            {{ this.orgLocal.id ? 'Done' : 'Cancel' }}
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="orgLocal.name ? '' : 'disabled'" @clicked="save() || true" v-if="!this.orgLocal.id">
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
import AGBool from 'components/base/bool.vue';
import AGSelect from 'components/base/select.vue';
import isEqual from 'lodash/isEqual';
import AGHorizontalDivider from 'components/utils/horizontalDividerWithText.vue';
import {
  createOrganization,
  saveOrganization,
  fetchOrgSettings,
  saveOrgSettings,
} from 'src/apis/organization';
import { fetchUsers } from 'src/apis/user';
import { fetchDatabases } from 'src/apis/database';
import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';


export default {
  name: 'AGShareOrg',
  components: { AGModal, AGButton, AGInput, AGBool, AGHorizontalDivider, AGSelect },
  props: ['open', 'org'],

  watch: {

    openAIModelName: {
      deep: true,
      handler() {
        if (this.openAIModelName) {
          saveOrgSettings(this.openAIModelName, () => {
            'pass';
          });
        }
      },
    },
    openAIAPIKey: {
      deep: true,
      handler() {
        if (this.openAIAPIKey) {
          saveOrgSettings(this.openAIAPIKey, () => {
            'pass';
          });
        }
      },
    },
    openAIAPIURL: {
      deep: true,
      handler() {
        if (this.openAIAPIURL) {
          saveOrgSettings(this.openAIAPIURL, () => {
            'pass';
          });
        }
      },
    },
    ollamaModelName: {
      deep: true,
      handler() {
        if (this.ollamaModelName) {
          saveOrgSettings(this.ollamaModelName, () => {
            'pass';
          });
        }
      },
    },
    ollamaAPIKey: {
      deep: true,
      handler() {
        if (this.ollamaAPIKey) {
          saveOrgSettings(this.ollamaAPIKey, () => {
            'pass';
          });
        }
      },
    },
    ollamaAPIURL: {
      deep: true,
      handler() {
        if (this.ollamaAPIURL) {
          saveOrgSettings(this.ollamaAPIURL, () => {
            'pass';
          });
        }
      },
    },
    claudeModelName: {
      deep: true,
      handler() {
        if (this.claudeModelName) {
          saveOrgSettings(this.claudeModelName, () => {
            'pass';
          });
        }
      },
    },
    claudeAPIKey: {
      deep: true,
      handler() {
        if (this.claudeAPIKey) {
          saveOrgSettings(this.claudeAPIKey, () => {
            'pass';
          });
        }
      },
    },
    claudeAPIURL: {
      deep: true,
      handler() {
        if (this.claudeAPIURL) {
          saveOrgSettings(this.claudeAPIURL, () => {
            'pass';
          });
        }
      },
    },
    genAIProvider: {
      deep: true,
      handler() {
        if (this.genAIProvider) {
          saveOrgSettings(this.genAIProvider, () => {
            'pass';
          });
        }
      },
    },
    usersCanOverrideGenAIConfig: {
      deep: true,
      handler() {
        if (this.usersCanOverrideGenAIConfig) {
          saveOrgSettings(this.usersCanOverrideGenAIConfig, () => {
            'pass';
          });
        }
      },
    },
    downloadLimitSettings: {
      deep: true,
      handler() {
        if (this.downloadLimitSettings?.id) {
          saveOrgSettings(this.downloadLimitSettings, () => {
            'pass';
          });
        }
      },
    },
    canDownloadSetting: {
      deep: true,
      handler() {
        if (this.canDownloadSetting?.id) {
          saveOrgSettings(this.canDownloadSetting, () => {
            'pass';
          });
        }
      },
    },
    frontendLimitSettings: {
      deep: true,
      handler() {
        if (this.frontendLimitSettings?.id) {
          saveOrgSettings(this.frontendLimitSettings, () => {
            'pass';
          });
        }
      },
    },
    orgLocal: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.org, this.orgLocal)) {
          if (this.orgLocal.id) {
            saveOrganization(this.orgLocal, (_t, loading) => {
              'pass';
            });
          }
          this.$emit('update:org', this.orgLocal);
        }
      },
    },
    org: {
      deep: true,
      handler() {
        if (!isEqual(this.org, this.orgLocal)) {
          this.orgLocal = cloneDeep(this.org || {});
        }
      },
    },
  },

  computed: {},

  mounted() {
    if (!this.orgLocal.id) {
      return;
    }
    fetchOrgSettings(this.orgLocal.id, this.setSettings);
  },

  data() {
    return {
      orgLocal: cloneDeep(this.org || {}),
      id: cloneDeep(this.org?.id) || null,
      session: sessionStore(),
      downloadLimitSettings: null,
      frontendLimitSettings: null,
      canDownloadSetting: null,
      openAIAPIURL: null,
      openAIAPIKey: null,
      openAIModelName: null,

      claudeAPIKey: null,
      claudeAPIURL: null,
      claudeModelName: null,

      ollamaAPIKey: null,
      ollamaAPIURL: null,
      ollamaModelName: null,

      genAIProvider: null,

      providerOptions: ["OPENAI", "CLAUDE", "OLLAMA", "NONE"],


      usersCanOverrideGenAIConfig: null,
    };
  },

  methods: {
    setSettings(settings, _loading) {
      settings?.forEach((s) => {

        if (s.name === 'OPENAI_API_KEY') {
          this.openAIAPIKey = s;
        }
        if (s.name === 'OPENAI_MODEL_NAME') {
          this.openAIModelName = s;
        }
        if (s.name === 'OPENAI_API_URL') {
          this.openAIAPIURL = s;
        }

        if (s.name === 'CLAUDE_API_KEY') {
          this.claudeAPIKey = s;
        }
        if (s.name === 'CLAUDE_MODEL_NAME') {
          this.claudeModelName = s;
        }
        if (s.name === 'CLAUDE_API_URL') {
          this.claudeAPIURL = s;
        }

        if (s.name === 'OLLAMA_API_KEY') {
          this.ollamaAPIKey = s;
        }
        if (s.name === 'OLLAMA_MODEL_NAME') {
          this.ollamaModelName = s;
        }
        if (s.name === 'OLLAMA_API_URL') {
          this.ollamaAPIURL = s;
        }

        if (s.name === 'GEN_AI_PROVIDER') {
          this.genAIProvider = s;
        }
        if (s.name === 'USERS_CAN_OVERRIDE_GENAI_CONFIG') {
          this.usersCanOverrideGenAIConfig = s;
        }
        if (s.name === 'MAX_DOWNLOAD_LIMIT') {
          this.downloadLimitSettings = s;
        }

        if (s.name === 'MAX_FRONTEND_LIMIT') {
          this.frontendLimitSettings = s;
        }
        if (s.name === 'DOWNLOAD_ALLOWED') {
          this.canDownloadSetting = s;
        }
        if (s.name === 'USERS_CAN_OVERRIDE_OPENAI_KEY') {
          this.usersCanOverrideOpenAIKey = s;
        }
      });
    },

    save() {
      if (this.orgLocal.id) {
        return;
      }
      createOrganization(this.orgLocal, (_t, loading) => {
        if (!loading) {
          this.$emit('refresh');
          this.$emit('update:open', false);
        }
      });
    },
  },
};
</script>
