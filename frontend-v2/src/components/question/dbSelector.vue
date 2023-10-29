<template>
  <div>
    <div class="tw-flex tw-cursor-pointer">
      <div class="tw-border tw-border-primary tw-px-4 !tw-py-1 tw-text-primary tw-font-semibold tw-shadow-inner tw-border-2" :class="selectedDatabaseLocal?.name ? 'tw-rounded-l-full' : 'tw-rounded-full'
        ">
        Data Source
      </div>
      <div
        class="tw-border tw-border-primary tw-bg-primary tw-text-white tw-px-4 !tw-py-1 tw-rounded-r-full tw-shadow-inner tw-border-2"
        v-if="selectedDatabaseLocal?.name">
        {{ selectedDatabaseLocal?.name }}
      </div>
      <q-menu flat="true" transition-show="scale" transition-hide="scale" max-height="800px"
        class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
        <SelectOptions :options="databases" v-model:selected="selectedDatabaseLocal" :menuShow="menuShow" iconLetter="D"
          displayKey="name" areOptionObjects="true" hideOnClick="true" />
      </q-menu>
    </div>
  </div>
</template>
<script>
import SelectOptions from 'components/base/selectOptions.vue';
import { sessionStore } from 'stores/session';

import isEqual from 'lodash/isEqual';

const session = sessionStore();
import { fetchDatabases } from 'src/apis/database';
export default {
  name: 'AGDatabaseSelector',
  props: ['selectedDatabase'],
  components: { SelectOptions },
  watch: {
    selectedDatabase(oldV, newV) {
      if (!isEqual(this.selectedDatabase, this.selectedDatabaseLocal)) {
        this.selectedDatabaseLocal = this.selectedDatabase;
      }
    },
    selectedDatabaseLocal(oldV, newV) {
      if (!isEqual(this.selectedDatabase, this.selectedDatabaseLocal)) {
        this.$emit('update:selectedDatabase', this.selectedDatabaseLocal);
      }
    },
  },

  mounted() {
    fetchDatabases(session.token, this.setUpDatabases);
  },

  data() {
    return {
      databases: [],
      selectedDatabaseLocal: this.selectedDatabase,
    };
  },

  methods: {
    setUpDatabases(databases, _loading) {
      if (databases) {
        databases = databases.map((d) => {
          return {
            db_type: d.db_type,
            id: d.id,
            name: d.name,
            unique_identifier: d.unique_identifier,
          };
        });
        this.databases = databases || [];
      }
    },
  },
};
</script>
