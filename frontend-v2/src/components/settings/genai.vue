<template>
  <div class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-py-2 tw-border">
    <div class="tw-p-2 divide-y tw-px-4">
      <div class="label tw-mt-4 tw-mb-1">Select GenAI SQL Generation Provider</div>

      <AGSelect v-model:selected="genAIProvider.value" :options="providerOptions" placeholder="Select a provider"
        v-if="genAIProvider" />

      <template v-if="genAIProvider?.value == 'NONE'">

        <div class="note tw-mt-4">
          GenAI SQL Generation is disabled for this Afterglow installation. However, Organizations <template
            v-if="usersCanOverrideGenAIConfig.value != 'false'"> and users </template>
          can enable it by providing their own configuration.
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
        <AGInput v-model:value="openAIModelName.value" placeholder="OpenAI Model Name" type="text" debounce="300" />

        <div class="label tw-mt-4 tw-mb-1">OpenAI API URL</div>
        <AGInput v-model:value="openAIAPIURL.value" placeholder="API URL" type="text" debounce="300" />
      </template>

      <template v-if="genAIProvider?.value == 'CLAUDE'">
        <div class="label tw-mt-4 tw-mb-1">Claude API Key</div>
        <AGInput v-model:value="claudeAPIKey.value" placeholder="Claude API Key" type="password" debounce="300" />

        <div class="label tw-mt-4 tw-mb-1">Claude Model Name</div>
        <AGInput v-model:value="claudeModelName.value" placeholder="Claude Model Name" type="text" debounce="300" />

        <div class="label tw-mt-4 tw-mb-1">Claude API URL</div>
        <AGInput v-model:value="claudeAPIURL.value" placeholder="API URL" type="text" debounce="300" />
      </template>

      <template v-if="genAIProvider?.value == 'OLLAMA'">
        <div class="label tw-mt-4 tw-mb-1">Ollama API Key</div>
        <AGInput v-model:value="ollamaAPIKey.value" placeholder="Ollama API Key" type="password" debounce="300" />

        <div class="label tw-mt-4 tw-mb-1">Ollama Model Name</div>
        <AGInput v-model:value="ollamaModelName.value" placeholder="Ollama Model Name" type="text" debounce="300" />

        <div class="label tw-mt-4 tw-mb-1">Ollama API URL</div>
        <AGInput v-model:value="ollamaAPIURL.value" placeholder="API URL" type="text" debounce="300" />
      </template>

      <AGBool v-model:value="usersCanOverrideGenAIConfig.value" label="Users can override OpenAI Key"
        v-if="usersCanOverrideGenAIConfig" />
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGBool from 'components/base/bool.vue';
import AGSelect from 'components/base/select.vue';
import { fetchSettings, saveSettings } from 'src/apis/settings';
export default {
  name: 'AGSettingsOpenAIConfiguration',
  components: { AGInput, AGBool, AGSelect },

  watch: {
    openAIModelName: {
      deep: true,
      handler() {
        if (this.openAIModelName) {
          saveSettings(this.openAIModelName, () => {
            'pass';
          });
        }
      },
    },
    openAIAPIKey: {
      deep: true,
      handler() {
        if (this.openAIAPIKey) {
          saveSettings(this.openAIAPIKey, () => {
            'pass';
          });
        }
      },
    },
    openAIAPIURL: {
      deep: true,
      handler() {
        if (this.openAIAPIURL) {
          saveSettings(this.openAIAPIURL, () => {
            'pass';
          });
        }
      },
    },
    ollamaModelName: {
      deep: true,
      handler() {
        if (this.ollamaModelName) {
          saveSettings(this.ollamaModelName, () => {
            'pass';
          });
        }
      },
    },
    ollamaAPIKey: {
      deep: true,
      handler() {
        if (this.ollamaAPIKey) {
          saveSettings(this.ollamaAPIKey, () => {
            'pass';
          });
        }
      },
    },
    ollamaAPIURL: {
      deep: true,
      handler() {
        if (this.ollamaAPIURL) {
          saveSettings(this.ollamaAPIURL, () => {
            'pass';
          });
        }
      },
    },
    claudeModelName: {
      deep: true,
      handler() {
        if (this.claudeModelName) {
          saveSettings(this.claudeModelName, () => {
            'pass';
          });
        }
      },
    },
    claudeAPIKey: {
      deep: true,
      handler() {
        if (this.claudeAPIKey) {
          saveSettings(this.claudeAPIKey, () => {
            'pass';
          });
        }
      },
    },
    claudeAPIURL: {
      deep: true,
      handler() {
        if (this.claudeAPIURL) {
          saveSettings(this.claudeAPIURL, () => {
            'pass';
          });
        }
      },
    },
    genAIProvider: {
      deep: true,
      handler() {
        if (this.genAIProvider) {
          saveSettings(this.genAIProvider, () => {
            'pass';
          });
        }
      },
    },
    usersCanOverrideGenAIConfig: {
      deep: true,
      handler() {
        if (this.usersCanOverrideGenAIConfig) {
          saveSettings(this.usersCanOverrideGenAIConfig, () => {
            'pass';
          });
        }
      },
    },
  },

  data() {
    return {
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

  mounted() {
    fetchSettings(this.setSettings);
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
      });
    },
  },
};
</script>
