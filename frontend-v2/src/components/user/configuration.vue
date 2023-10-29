<template>
  <div>
    <div class="label tw-mb-1">OpenAI API Key</div>
    <AGInput
      v-model:value="openAIApiKeySetting.value"
      type="password"
      v-if="openAIApiKeySetting"
      placeholder="Set Your OpenAI API Key"
    />
    <div class="note">
      You can generate a new key
      <a
        class="tw-text-primary tw-underline"
        href="https://platform.openai.com/account/api-keys"
        target="_blank"
        >here</a
      >
    </div>
  </div>
</template>

<script>
import AGInput from 'components/base/input.vue';
import { fetchUserSettings, saveUserSettings } from 'src/apis/user';

import { currentUserStore } from 'src/stores/currentUser';

const currentUser = currentUserStore();

export default {
  components: {
    AGInput,
  },

  watch: {
    openAIApiKeySetting: {
      deep: true,
      handler() {
        if (this.openAIApiKeySetting?.id) {
          saveUserSettings(this.openAIApiKeySetting, () => {
            'pass';
          });
        }
      },
    },
  },

  name: 'UserConfig',
  data() {
    return {
      openAIApiKeySetting: null,
      currentUser: currentUser,
    };
  },

  mounted() {
    if (this.currentUser.getDetails.id) {
      fetchUserSettings(this.currentUser.getDetails.id, this.setOpenAIKey);
    }
  },

  methods: {
    setOpenAIKey(response) {
      if (response) {
        response.forEach((setting) => {
          if (setting.name === 'OPENAI_API_KEY') {
            this.openAIApiKeySetting = setting;
          }
        });
      }
    },

    save() {
      saveUserSettings(this.openAIApiKeySetting, () => {
        'pass';
      });
    },
  },
};
</script>
