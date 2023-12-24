<template>
  <teleport to="body">
    <AGModal
      class="!tw-fixed"
      size="small"
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
    >
      <template #header>
        <div class="tw-px-4 tw-py-2 tw-text-2xl tw-font-semibold">
          Org Settings
        </div>
      </template>
      <template #body>
        <div class="tw-p-4">
          <div class="tw-p-2 divide-y">
            <div class="label">Name</div>
            <AGInput
              v-model:value="orgLocal.name"
              placeholder="What do you call it?"
              debounce="300"
            />

            <div class="label tw-mt-2">Google Domain</div>
            <AGInput
              v-model:value="orgLocal.google_domain"
              placeholder="google domain"
              debounce="300"
              :disabled="orgLocal.id ? true : false"
            />
          </div>
          <div class="tw-p-2 divide-y tw-mt-2" v-if="orgLocal.id">
            <div class="tw-font-semibold tw-text-lg">Settings</div>

            <div class="label">Maximum Number of Rows in Exports/Reports</div>
            <AGInput
              v-model:value="downloadLimitSettings.value"
              v-if="downloadLimitSettings"
              placeholder="How many rows can members download?"
              type="number"
              debounce="300"
            />
            <div class="note">
              This limit overrides Global Limit. It can be overriden by User
              level. Empty means no limit.
            </div>

            <div class="label tw-mt-2">Maximum Number of Rows on frontend</div>
            <AGInput
              v-model:value="frontendLimitSettings.value"
              v-if="frontendLimitSettings"
              placeholder="How many rows can members see on frontend ?"
              type="number"
              debounce="300"
            />
            <div class="note">
              Limit more than 2000 is ignored. This limit overrides Global Limit
              for frontend.
            </div>

            <AGBool
              v-model:value="canDownloadSetting.value"
              v-if="canDownloadSetting"
              label="Can Download Reports"
              class="label tw-mt-2"
            />
            <div class="note">
              Use this option to disable downloads for this organization. This
              overrides the Global Value. This is overriden by User Level Value.
            </div>

            <AGHorizontalDivider class="tw-my-2" />

            <div class="label">OpenAI API Key</div>
            <AGInput
              v-model:value="openAIAPIKey.value"
              placeholder="OpenAI API Key"
              debounce="300"
              v-if="openAIAPIKey"
            />

            <div class="label">OpenAI Model Name</div>
            <AGInput
              v-model:value="openAIModelName.value"
              placeholder="OpenAI Model Name"
              debounce="300"
              v-if="openAIModelName"
            />
            <div class="note">
              You can experiment with different models listed
              <a
                class="tw-text-primary tw-underline"
                href="https://platform.openai.com/docs/models/gpt-3"
                target="_blank"
              >
                here
              </a>
            </div>

            <AGBool
              v-model:value="usersCanOverrideOpenAIKey.value"
              v-if="usersCanOverrideOpenAIKey"
              label="Can Users use their own key?"
              class="label tw-mt-2"
            />
            <div class="note">
              Enabling this will allow individual editors and admins to use
              their own openAI key. Useful when you are using free version of
              openAI. This can be overriden at organization level.
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton
            class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')"
          >
            {{ this.orgLocal.id ? 'Done' : 'Cancel' }}
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="orgLocal.name ? '' : 'disabled'"
            @clicked="save() || true"
            v-if="!this.orgLocal.id"
          >
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
  components: { AGModal, AGButton, AGInput, AGBool, AGHorizontalDivider },
  props: ['open', 'org'],

  watch: {
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
    openAIAPIKey: {
      deep: true,
      handler() {
        if (this.openAIAPIKey?.id) {
          saveOrgSettings(this.openAIAPIKey, () => {
            'pass';
          });
        }
      },
    },

    usersCanOverrideOpenAIKey: {
      deep: true,
      handler() {
        if (this.usersCanOverrideOpenAIKey?.id) {
          saveOrgSettings(this.usersCanOverrideOpenAIKey, () => {
            'pass';
          });
        }
      },
    },
    openAIModelName: {
      deep: true,
      handler() {
        if (this.openAIModelName?.id) {
          saveOrgSettings(this.openAIModelName, () => {
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
      openAIAPIKey: null,
      openAIModelName: null,
      usersCanOverrideOpenAIKey: null,
    };
  },

  methods: {
    setSettings(settings, _loading) {
      settings?.forEach((s) => {
        if (s.name === 'MAX_DOWNLOAD_LIMIT') {
          this.downloadLimitSettings = s;
        }

        if (s.name === 'MAX_FRONTEND_LIMIT') {
          this.frontendLimitSettings = s;
        }
        if (s.name === 'DOWNLOAD_ALLOWED') {
          this.canDownloadSetting = s;
        }
        if (s.name === 'OPENAI_API_KEY') {
          this.openAIAPIKey = s;
        }
        if (s.name === 'USERS_CAN_OVERRIDE_OPENAI_KEY') {
          this.usersCanOverrideOpenAIKey = s;
        }
        if (s.name === 'OPENAI_MODEL_NAME') {
          this.openAIModelName = s;
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
