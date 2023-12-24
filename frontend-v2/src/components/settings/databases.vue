<template>
  <div class="tw-flex tw-flex-col tw-w-full">
    <div class="tw-flex tw-items-center tw-justify-center tw-p-4" >
      <AGInput
        v-model:value="query"
        placeholder="Search Databases"
        class="tw-w-[500px]"
        debounce="500"
      />
    </div>
    <div
      class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase tw-text-right tw-py-2"
      v-if="databases?.length > 0"
      @click="openDatabaseNewModal = true"
    >
      + Add New Database
    </div>
    <div class="tw-flex tw-flex-col tw-mx-3 tw-gap-1 tw-w-full">

      <AGLoader class="tw-my-6" text="Fetching Databases" v-if="loading" />
      <div
        class="tw-bg-white tw-border tw-flex tw-items-center tw-py-2 tw-px-4 tw-gap-2 tw-rounded-2xl"
        v-for="db in databases"
        :key="db"
      >
        <DatabaseIcon size="32" class="icon-primary" />
        <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
          <div class="tw-leading-3 tw-font-semibold">{{ db.name }}</div>
          <div class="note tw-leading-2">type: {{ db.db_type }}</div>
        </div>
        <div class="tw-flex tw-gap-2">
          <div
            class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase"
            @click="
              ((editingDatabase = db) || true) && (openDatabaseEditModal = true)
            "
          >
            Edit
          </div>
          <div
            class="tw-cursor-pointer tw-font-semibold tw-text-red-700 tw-uppercase"
            @click="
              ((deletingDatabase = db) || true) &&
                (openDeleteDatabaseModal = true)
            "
          >
            Delete
          </div>
        </div>

        <div
          class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-white tw-p-4 tw-rounded-2xl tw-border"
          v-if="databases?.length === 0"
        >
          <div class="">You do not have any Databases yet.</div>
          <div
            class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase"
            @click="openDatabaseNewModal = true"
          >
            + Add New Database
          </div>
        </div>
      </div>

      <AGDatabaseModal
        v-model:open="openDatabaseEditModal"
        @refresh="fetchDatabases()"
        :databaseID="editingDatabase.id"
        v-if="editingDatabase"
        :key="editingDatabase"
      />
      <AGDatabaseModal
        v-model:open="openDatabaseNewModal"
        @refresh="fetchDatabases()"
      />
      <AGDeleteEntityModal
        v-model:open="openDeleteDatabaseModal"
        entityName="database"
        :entityID="deletingDatabase.id"
        @deleted="fetchDatabases"
        v-if="deletingDatabase"
      />
    </div>
  </div>
</template>
<script>
import { sessionStore } from 'stores/session';
import AGInput from 'components/base/input.vue';

import { DatabaseIcon } from 'vue-tabler-icons';
import AGLoader from 'components/utils/loader.vue';
import AGDeleteEntityModal from 'components/utils/deleteEntityModal.vue';
import AGDatabaseModal from 'components/settings/databaseModal.vue';
const session = sessionStore();
import { fetchDatabases, searchDatabases } from 'src/apis/database';
export default {
  name: 'AGSettingsDatabases',
  components: { AGLoader, DatabaseIcon, AGDeleteEntityModal, AGDatabaseModal , AGInput},
  mounted() {
    this.fetchDatabases();
  },

  watch: {
    query() {
      searchDatabases(this.query, this.setDatabases);
    },
  },



  data() {
    return {
      loading: false,
      databases: [],
      openDeleteDatabaseModal: false,
      editingDatabase: null,
      deletingDatabase: null,
      openDatabaseEditModal: false,
      openDatabaseNewModal: false,
      query: "",

    };
  },
  methods: {
    fetchDatabases() {
      fetchDatabases(session.token, this.setDatabases);
    },
    setDatabases(databases, loading) {
      this.databases = databases || [];
      this.loading = loading;
    },
  },
};
</script>
