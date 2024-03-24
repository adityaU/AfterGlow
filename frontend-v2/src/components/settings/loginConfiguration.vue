
<template>
  <div class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-py-2 tw-border">
    <div class="tw-p-2 divide-y tw-px-4">
      <div class="label tw-mt-4">Enable Google Login</div>
      <AGBool v-model:value="googleLoginEnabled.value" v-if="googleLoginEnabled" />
      <div class="note">
        This enables Google Login for all users. You'll have to configure client key and secret below.
      </div>

      <template v-if="googleLoginEnabled?.value == 'true'">
        <div class="label tw-mt-4">Google Client Key</div>
        <AGInput v-model:value="googleClientKey.value" v-if="googleClientKey" placeholder="Google Client Key"
          type="password" debounce="300" />
        <div class="label tw-mt-4">Google Client Secret</div>
        <AGInput v-model:value="googleClientSecret.value" v-if="googleClientSecret" placeholder="Google Client Secret"
          type="password" debounce="300" />
      </template>
    </div>

    <div class="tw-p-2 divide-y tw-px-4">
      <div class="label tw-mt-4">Enable SAML Login</div>
      <AGBool v-model:value="samlLoginEnabled.value" v-if="samlLoginEnabled" />
      <div class="note">
        This enables SAML Login for all users. You'll have to configure IDP Metadata XML below.
      </div>

      <template v-if="samlLoginEnabled?.value == 'true'">
        <div class="label tw-mt-4">SAML ENTITY ID</div>
        <AGInput v-model:value="samlEntityID.value" v-if="samlEntityID" placeholder="SAML ENTITY ID" debounce="300" />
        <div class="label tw-mt-4">SAML METADATA XML</div>
        <AGInput v-model:value="samlIDPMetadataXML.value" v-if="samlIDPMetadataXML" placeholder="SAML METADATA XML"
          type="password" textArea="true" debounce="300" />
        <AGButton class="tw-mt-4 tw-bg-primary tw-text-tertiary" @click="copySPMetadata">Copy SP Metadata</AGButton>
      </template>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGBool from 'components/base/bool.vue';
import AGButton from 'components/base/button.vue';
import { fetchSettings, saveSettings } from 'src/apis/settings';
import { fetchSamlMetadata } from 'src/apis/saml';
export default {
  name: 'AGSettingsOpenAIConfiguration',
  components: { AGInput, AGBool, AGButton },

  watch: {
    googleLoginEnabled: {
      deep: true,
      handler() {
        if (this.googleLoginEnabled) {
          saveSettings(this.googleLoginEnabled, () => {
            'pass';
          });
        }
      },
    },
    googleClientKey: {
      deep: true,
      handler() {
        if (this.googleClientKey) {
          saveSettings(this.googleClientKey, () => {
            'pass';
          });
        }
      },
    },
    googleClientSecret: {
      deep: true,
      handler() {
        if (this.googleClientSecret) {
          saveSettings(this.googleClientSecret, () => {
            'pass';
          });
        }
      },
    },
    samlLoginEnabled: {
      deep: true,
      handler() {
        if (this.samlLoginEnabled) {
          saveSettings(this.samlLoginEnabled, () => {
            'pass';
          });
        }
      },
    },
    samlIDPMetadataXML: {
      deep: true,
      handler() {
        if (this.samlIDPMetadataXML) {
          saveSettings(this.samlIDPMetadataXML, () => {
            'pass';
          });
        }
      },
    },
    samlEntityID: {
      deep: true,
      handler() {
        if (this.samlEntityID) {
          saveSettings(this.samlEntityID, () => {
            'pass';
          });
        }
      },
    },


  },

  data() {
    return {
      googleLoginEnabled: null,
      googleClientKey: null,
      googleClientSecret: null,
      samlLoginEnabled: null,
      samlIDPMetadataXML: null,
      samlEntityID: null,

    };
  },

  mounted() {
    fetchSettings(this.setSettings);
  },
  methods: {
    copySPMetadata() {
      fetchSamlMetadata((metadata) => {
        navigator.clipboard.writeText(metadata);
      });
    },
    setSettings(settings, _loading) {
      settings?.forEach((s) => {
        if (s.name === 'GOOGLE_LOGIN_ENABLED') {
          this.googleLoginEnabled = s;
        }
        if (s.name === 'GOOGLE_CLIENT_KEY') {
          this.googleClientKey = s;
        }
        if (s.name === 'GOOGLE_CLIENT_SECRET') {
          this.googleClientSecret = s;
        }
        if (s.name === 'SAML_LOGIN_ENABLED') {
          this.samlLoginEnabled = s;
        }
        if (s.name === 'SAML_IDP_METADATA_XML') {
          this.samlIDPMetadataXML = s;
        }
        if (s.name === 'SAML_ENTITY_ID') {
          this.samlEntityID = s;
        }
      });
    },
  },
};
</script>
