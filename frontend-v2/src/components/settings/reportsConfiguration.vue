<template>
  <div
    class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-py-2 tw-border"
  >
    <div class="tw-p-2 divide-y tw-px-4">
      <div class="tw-font-semibold tw-text-lg">Email Configuration</div>
      <div class="label tw-mt-4">Email Server</div>
      <AGInput
        v-model:value="emailServerHost.value"
        v-if="emailServerHost"
        placeholder="Email server host URL"
        debounce="300"
      />

      <div class="label tw-mt-4">Email Server Port</div>
      <AGInput
        v-model:value="emailServerPort.value"
        v-if="emailServerPort"
        placeholder="Email Server Post, e.g - 587"
        type="number"
        debounce="300"
      />

      <div class="label tw-mt-4">Email Server Username</div>
      <AGInput
        v-model:value="emailServerUserName.value"
        v-if="emailServerUserName"
        placeholder="Email server username"
        type="password"
        debounce="300"
      />

      <div class="label tw-mt-4">Email Server Password</div>
      <AGInput
        v-model:value="emailServerPassword.value"
        v-if="emailServerPassword"
        placeholder="Email server password"
        type="password"
        debounce="300"
      />

      <div class="label tw-mt-4">Email Sender ID</div>
      <AGInput
        v-model:value="senderEmailID.value"
        v-if="senderEmailID"
        placeholder="Sender ID - e.g.- reports@org.com"
        debounce="300"
      />

      <div class="label tw-mt-4">Email Server Hostname</div>
      <AGInput
        v-model:value="emailServerHostName.value"
        v-if="emailServerHostName"
        placeholder="e.g.- org.com"
        debounce="300"
      />
      <div class="note tw-mt-4">
        We only provide support for email communication through TLS for enhanced
        security. :)
      </div>
    </div>

    <div class="tw-p-2 divide-y tw-mt-4 tw-border-t tw-px-4">
      <div class="tw-font-semibold tw-text-lg">AWS Configuration</div>

      <div class="label tw-mt-4">AWS ACCESS KEY ID</div>
      <AGInput
        v-model:value="awsKeyID.value"
        v-if="awsKeyID"
        placeholder=""
        debounce="300"
        type="password"
      />

      <div class="label tw-mt-4">AWS SECRET ACCESS KEY</div>
      <AGInput
        v-model:value="awsSecret.value"
        v-if="awsSecret"
        placeholder=""
        debounce="300"
        type="password"
      />

      <div class="label tw-mt-4">AWS REGION</div>
      <AGInput
        v-model:value="awsRegion.value"
        v-if="awsRegion"
        placeholder="e.g - ap-south-1"
        debounce="300"
      />

      <div class="label tw-mt-4">S3 Bucket</div>
      <AGInput
        v-model:value="s3Bucket.value"
        v-if="s3Bucket"
        placeholder=""
        debounce="300"
      />
      <div class="item-3070-columns tw-flex">
        <div class="label tw-mt-4">Use Private Bucket</div>
        <div class="tw-flex tw-items-center">
          <AGBool
            v-model:value="usePrivateBucket.value"
            v-if="usePrivateBucket"
            debounce="300"
          />
        </div>
      </div>
      <div class="note">
        To maintain the privacy of the S3 bucket, activate this option.
        Remember, you will need to manually update the S3 bucket policy.
      </div>

      <div class="label tw-mt-4" v-if="usePrivateBucket?.value">
        Signed S3 Url Timeout
      </div>
      <AGInput
        v-model:value="signedS3UrlTimeout.value"
        v-if="signedS3UrlTimeout && usePrivateBucket.value"
        placeholder="default - 600"
        debounce="300"
      />
    </div>

    <div class="tw-p-2 divide-y tw-mt-4 tw-border-t tw-px-4">
      <div class="tw-font-semibold tw-text-lg">Settings</div>

      <div class="label tw-mt-4">Maximum Number of Rows in Exports/Reports</div>
      <AGInput
        v-model:value="downloadLimit.value"
        v-if="downloadLimit"
        placeholder="How many rows can users download?"
        type="number"
        debounce="300"
      />
      <div class="note">
        This can be superseded by either Organization or User level
        restrictions. If left blank, it implies there is no limit.
      </div>

      <div class="item-3070-columns tw-flex">
        <div class="label tw-mt-4">Can Download Reports</div>
        <div class="tw-flex tw-items-center">
          <AGBool
            v-model:value="canDownloadReport.value"
            v-if="canDownloadReport"
          />
        </div>
      </div>
      <div class="note">
        Choose this setting to prevent downloads in this Afterglow Installation.
        However, it can be superseded by Organization and User Level settings.
      </div>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGBool from 'components/base/bool.vue';
import { fetchSettings, saveSettings } from 'src/apis/settings';
export default {
  name: 'AGSettingsFrontendConfiguration',
  components: { AGInput, AGBool },

  watch: {
    emailServerHost: {
      deep: true,
      handler() {
        if (this.emailServerHost) {
          saveSettings(this.emailServerHost, () => {
            'pass';
          });
        }
      },
    },
    emailServerHostName: {
      deep: true,
      handler() {
        if (this.emailServerHostName) {
          saveSettings(this.emailServerHostName, () => {
            'pass';
          });
        }
      },
    },
    emailServerPort: {
      deep: true,
      handler() {
        if (this.emailServerPort) {
          saveSettings(this.emailServerPort, () => {
            'pass';
          });
        }
      },
    },
    emailServerUserName: {
      deep: true,
      handler() {
        if (this.emailServerUserName) {
          saveSettings(this.emailServerUserName, () => {
            'pass';
          });
        }
      },
    },
    emailServerPassword: {
      deep: true,
      handler() {
        if (this.emailServerPassword) {
          saveSettings(this.emailServerPassword, () => {
            'pass';
          });
        }
      },
    },
    senderEmailID: {
      deep: true,
      handler() {
        if (this.senderEmailID) {
          saveSettings(this.senderEmailID, () => {
            'pass';
          });
        }
      },
    },
    awsKeyID: {
      deep: true,
      handler() {
        if (this.awsKeyID) {
          saveSettings(this.awsKeyID, () => {
            'pass';
          });
        }
      },
    },
    awsSecret: {
      deep: true,
      handler() {
        if (this.awsSecret) {
          saveSettings(this.awsSecret, () => {
            'pass';
          });
        }
      },
    },
    awsRegion: {
      deep: true,
      handler() {
        if (this.awsRegion) {
          saveSettings(this.awsRegion, () => {
            'pass';
          });
        }
      },
    },
    s3Bucket: {
      deep: true,
      handler() {
        if (this.s3Bucket) {
          saveSettings(this.s3Bucket, () => {
            'pass';
          });
        }
      },
    },
    usePrivateBucket: {
      deep: true,
      handler() {
        if (this.usePrivateBucket) {
          saveSettings(this.usePrivateBucket, () => {
            'pass';
          });
        }
      },
    },
    signedS3UrlTimeout: {
      deep: true,
      handler() {
        if (this.signedS3UrlTimeout) {
          saveSettings(this.signedS3UrlTimeout, () => {
            'pass';
          });
        }
      },
    },
    downloadLimit: {
      deep: true,
      handler() {
        if (this.downloadLimit) {
          saveSettings(this.downloadLimit, () => {
            'pass';
          });
        }
      },
    },
    canDownloadReport: {
      deep: true,
      handler() {
        if (this.canDownloadReport) {
          saveSettings(this.canDownloadReport, () => {
            'pass';
          });
        }
      },
    },
  },

  data() {
    return {
      emailServerHost: null,
      emailServerHostName: null,
      emailServerPort: null,
      emailServerUserName: null,
      emailServerPassword: null,
      senderEmailID: null,
      awsKeyID: null,
      awsSecret: null,
      awsRegion: null,
      s3Bucket: null,
      usePrivateBucket: null,
      signedS3UrlTimeout: null,
      downloadLimit: null,
      canDownloadReport: null,
    };
  },

  mounted() {
    fetchSettings(this.setSettings);
  },
  methods: {
    setSettings(settings, _loading) {
      settings?.forEach((s) => {
        if (s.name === 'MAX_DOWNLOAD_LIMIT') {
          this.downloadLimit = s;
        }
        if (s.name === 'DOWNLOAD_ALLOWED') {
          this.canDownloadReport = s;
        }
        if (s.name === 'S3_SIGNED_URL_TIMEOUT') {
          this.signedS3UrlTimeout = s;
        }
        if (s.name === 'EMAIL_SERVER') {
          this.emailServerHost = s;
        }
        if (s.name === 'EMAIL_PORT') {
          this.emailServerPort = s;
        }
        if (s.name === 'EMAIL_USERNAME') {
          this.emailServerUserName = s;
        }
        if (s.name === 'EMAIL_PASSWORD') {
          this.emailServerPassword = s;
        }
        if (s.name === 'SENDER_EMAIL_ID') {
          this.senderEmailID = s;
        }
        if (s.name === 'EMAIL_SERVER_HOSTNAME') {
          this.emailServerHostName = s;
        }
        if (s.name === 'S3_BUCKET') {
          this.s3Bucket = s;
        }
        if (s.name === 'AWS_ACCESS_KEY_ID') {
          this.awsKeyID = s;
        }
        if (s.name === 'AWS_SECRET_ACCESS_KEY') {
          this.awsSecret = s;
        }
        if (s.name === 'AWS_REGION') {
          this.awsRegion = s;
        }
        if (s.name === 'USE_SIGNED_S3_URLS_IN_MAILS') {
          this.usePrivateBucket = s;
        }
        if (s.name === 'USE_SIGNED_S3_URLS_IN_MAILS') {
          this.usePrivateBucket = s;
        }
      });
    },
  },
};
</script>
