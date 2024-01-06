<template>
  <teleport to="body">
    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)">
      <template #header>
        <div class="tw-py-2 tw-px-4 tw-text-2xl tw-font-semibold">
          <template v-if="databaseLocal.id"> Edit Database </template>
          <template v-else> Create Database </template>
        </div>
      </template>
      <template #body>
        <div class="tw-px-4 tw-py-2">
          <div class="tw-p-2 divide-y">
            <div class="label">Database Type</div>
            <AGSelect v-model:selected="databaseLocal.db_type" :options="databaseTypeOptions"
              description="Select Database type" hideSearch="true" />
            <div class="note">
              Please make sure you provide readonly credentials to Afterglow.
              Afterglow does not differentiate between read and write queries.
            </div>

            <div class="label">Name</div>
            <AGInput v-model:value="databaseLocal.name" placeholder="What do you call it?" />
            <template v-if="databaseLocal.db_type === 'clickhouse'">
              <div class="label tw-mt-2">Scheme</div>
              <AGSelect v-model:selected="databaseLocal.config.scheme" :options="schemeOptions"
                description="Select a scheme. default:  http://" hideSearch="true" />
            </template>

            <div class="label tw-mt-2">Host Url</div>
            <AGInput v-model:value="databaseLocal.config.host_url" placeholder="localhost" />

            <div class="label tw-mt-2">Host Port</div>
            <AGInput v-model:value="databaseLocal.config.host_port" placeholder="5432" type="number" />

            <div class="label tw-mt-2">Database Name</div>
            <AGInput v-model:value="databaseLocal.config.db_name" placeholder="dbname" />

            <div class="label tw-mt-2">Database Username</div>
            <AGInput v-model:value="databaseLocal.config.username" placeholder="dbusername" />

            <div class="label tw-mt-2">Database Password</div>
            <AGInput v-model:value="databaseLocal.config.password" placeholder="password" type="password" />

            <div class="label tw-mt-2">Connection Pool Size</div>
            <AGInput v-model:value="databaseLocal.config.pool_size" placeholder="default: 10" />

            <div class="label tw-mt-2">
              Connection Checkout Timeout in Seconds
            </div>
            <AGInput v-model:value="databaseLocal.config.checkout_timeout" placeholder="default: 45" />

            <div class="label tw-mt-2">Query Timeout in Seconds</div>
            <AGInput v-model:value="databaseLocal.config.query_timeout" placeholder="default: 60" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-px-4 tw-py-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')">
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="allRequiredSatisfied ? '' : 'disabled'" @clicked="save() || true">
            {{ this.databaseLocal.id ? 'Save' : 'Create' }}
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
import AGSelect from 'components/base/select.vue';
import isEqual from 'lodash/isEqual';

import {
  createDatabase,
  saveDatabase,
  fetchDatabaseWithConfig,
} from 'src/apis/database';
import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';
import { data } from 'browserslist';

export default {
  name: 'AGDatabaseModal',
  components: { AGModal, AGButton, AGInput, AGSelect },
  props: ['open', 'databaseID'],

  watch: {
    open() {
      if (this.open) {
      }
    },
  },

  mounted() {
    if (this.databaseID) {
      fetchDatabaseWithConfig(
        this.databaseID,
        this.session.token,
        this.setDatabase
      );
    }
  },

  computed: {
    allRequiredSatisfied() {
      return (
        this.databaseLocal.db_type &&
        this.databaseLocal.name &&
        this.databaseLocal.config.host_url &&
        this.databaseLocal.config.host_port &&
        this.databaseLocal.config.username &&
        this.databaseLocal.config.db_name
      );
    },
  },

  data() {
    return {
      databaseLocal: { config: {} },
      session: sessionStore(),
      schemeOptions: ['http://', 'https://'],
      databaseTypeOptions: [
        'postgres',
        'mysql',
        'redshift',
        'influxdb',
        'redis',
        'clickhouse',
        'mongo',
      ],
    };
  },

  methods: {
    setDatabase(database, loading) {
      if (database) {
        this.databaseLocal = database;
      }
    },
    save() {
      if (this.databaseLocal.id) {
        if (this.databaseLocal.db_type === 'clickhouse') {
          this.databaseLocal.config.scheme =
            this.databaseLocal.config.scheme || 'http://';
        }

        saveDatabase(this.databaseLocal, (_t, loading) => {
          if (!loading) {
            this.$emit('refresh');
            this.$emit('update:open', false);
          }
        });
        return;
      }
      createDatabase(this.databaseLocal, (_t, loading) => {
        if (!loading) {
          this.$emit('refresh');
          this.$emit('update:open', false);
        }
      });
    },
  },
};
</script>
