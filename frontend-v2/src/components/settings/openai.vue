<template>
  <div
    class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-py-2 tw-border"
  >
    <div class="tw-p-2 divide-y tw-px-4">
      <div class="label tw-mt-4">Enable Open AI SQL Generation</div>
      <AGBool v-model:value="openAIEnabled.value" v-if="openAIEnabled" />
      <div class="note">
        This will enable openAI integration for generating SQL from text.
      </div>

      <template v-if="openAIEnabled?.value == 'true'">
        <div class="label tw-mt-4">OpenAI Api Key</div>
        <AGInput
          v-model:value="globalOpenAIKey.value"
          v-if="globalOpenAIKey"
          placeholder="Global OpenAI Api Key"
          type="password"
          debounce="300"
        />
        <div class="note">
          Unless overriden at organization or user level, this key will be used
          to call openAI APIs
        </div>
        <div class="label tw-mt-4">OpenAI Model Name</div>
        <AGInput
          v-model:value="openAIModelName.value"
          v-if="openAIModelName"
          placeholder="Open AI model Name"
          type="text"
          debounce="300"
        />
      </template>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGBool from 'components/base/bool.vue';
import { fetchSettings, saveSettings } from 'src/apis/settings';
export default {
  name: 'AGSettingsOpenAIConfiguration',
  components: { AGInput, AGBool },

  watch: {
    openAIEnabled: {
      deep: true,
      handler() {
        if (this.openAIEnabled) {
          saveSettings(this.openAIEnabled, () => {
            'pass';
          });
        }
      },
    },
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
    globalOpenAIKey: {
      deep: true,
      handler() {
        if (this.globalOpenAIKey) {
          saveSettings(this.globalOpenAIKey, () => {
            'pass';
          });
        }
      },
    },
    usersCanOverrideOpenAIKey: {
      deep: true,
      handler() {
        if (this.usersCanOverrideOpenAIKey) {
          saveSettings(this.usersCanOverrideOpenAIKey, () => {
            'pass';
          });
        }
      },
    },
  },

  data() {
    return {
      openAIEnabled: null,
      globalOpenAIKey: null,
      openAIModelName: null,
      usersCanOverrideOpenAIKey: null,
    };
  },

  mounted() {
    fetchSettings(this.setSettings);
  },
  methods: {
    setSettings(settings, _loading) {
      settings?.forEach((s) => {
        if (s.name === 'OPENAI_ENABLED') {
          this.openAIEnabled = s;
        }
        if (s.name === 'OPENAI_API_KEY') {
          this.globalOpenAIKey = s;
        }
        if (s.name === 'USERS_CAN_OVERRIDE_OPENAI_KEY') {
          this.usersCanOverrideOpenAIKey = s;
        }
        if (s.name === 'OPENAI_MODEL_NAME') {
          this.openAIModelName = s;
        }
      });
    },
  },
};
</script>
