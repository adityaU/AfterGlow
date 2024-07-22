<template>
  <div class="tw-flex tw-flex-col tw-w-full">
    <div class="tw-flex tw-items-center tw-justify-center tw-p-4">
      <AGInput v-model:value="query" placeholder="Search Databases" class="tw-w-[500px]" debounce="500" />
    </div>
    <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase tw-text-right tw-py-2"
      @click="openDatabaseNewModal = true">
      + Add New Database
    </div>
    <div class="tw-flex tw-flex-col tw-mx-3 tw-gap-1 tw-w-full">

      <AGLoader class="tw-my-6" text="Fetching Databases" v-if="loading" />
      <div class="tw-bg-white tw-border tw-flex tw-items-center tw-py-2 tw-px-4 tw-gap-2 tw-rounded-2xl"
        v-for="db in databases" :key="db">
        <DatabaseIcon size="32" class="icon-primary" />
        <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
          <div class="tw-leading-3 tw-font-semibold">{{ db.name }}</div>
          <div class="note tw-leading-2">type: {{ db.db_type }}</div>
        </div>

        <div
          class="tw-py-1 tw-px-4 tw-flex tw-items-center tw-gap-1 tw-cursor-pointer tw-rounded-full tw-bg-red-500 tw-text-white"
          v-if="db.base_db_id">
          Restricted Schema Access</div>

        <div class="tw-cursor-pointer tw-p-2">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Actions
          </q-tooltip>
          <Menu2Icon size="24" class="icon-default" />
          <q-menu flat="true" transition-show="scale" transition-hide="scale" max-height="900px" :offset="[0, 5]"
            class="tw-rounded-2xl custom-shadow tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown"
            auto-close>
            <div
              class="tw-cursor-pointer tw-whitespace-nowrap tw-uppercase tw-text-primary note tw-flex tw-items-center tw-gap-2 tw-py-1 tw-px-2 tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
              @click="
                ((scopedDB = db.id) || true)" v-if="!db?.base_db_id && db.db_type != 'api_client'">
              <DatabaseExclamationIcon size="28" class="icon-primary" />
              Create Restricted DB
            </div>

            <div
              class="tw-cursor-pointer tw-whitespace-nowrap tw-uppercase tw-text-primary note tw-flex tw-items-center tw-gap-2 tw-py-1 tw-px-2 tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
              @click="
                ((editScopedBaseDB = db.base_db_id) || true) && ((editScopedDB = db.id))"
              v-if="db?.base_db_id && db.db_type != 'api_client'">
              <DatabaseEditIcon size="28" class="icon-primary" />
              Edit Schema Access
            </div>
            <div
              class="tw-cursor-pointer tw-whitespace-nowrap tw-uppercase tw-text-primary note tw-flex tw-items-center tw-gap-2 tw-py-1 tw-px-2 tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
              @click="
                ((editingDatabase = db) || true) && (openDatabaseEditModal = true)
                ">
              <EditIcon size="28" class="icon-primary" />

              Edit
            </div>
            <div
              class="tw-cursor-pointer tw-whitespace-nowrap tw-uppercase tw-text-red-500 note tw-flex tw-items-center tw-gap-2 tw-py-1 tw-px-2 tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
              @click="
                ((deletingDatabase = db) || true) &&
                (openDeleteDatabaseModal = true)
                ">
              <XIcon size="28" class="icon-danger" />
              Delete
            </div>
          </q-menu>
        </div>

        <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-white tw-p-4 tw-rounded-2xl tw-border"
          v-if="databases?.length === 0">
          <div class="">You do not have any Databases yet.</div>
          <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase"
            @click="openDatabaseNewModal = true">
            + Add New Database
          </div>
        </div>
      </div>

      <AGDatabaseModal v-model:open="openDatabaseEditModal" @refresh="fetchDatabases()" :databaseID="editingDatabase.id"
        v-if="editingDatabase" :key="editingDatabase" />
      <AGDatabaseModal v-model:open="openDatabaseNewModal" @refresh="fetchDatabases()" />
      <AGDeleteEntityModal v-model:open="openDeleteDatabaseModal" entityName="database" :entityID="deletingDatabase.id"
        @deleted="fetchDatabases" v-if="deletingDatabase" />
    </div>
  </div>
</template>
<script>
import { sessionStore } from 'stores/session';
import AGInput from 'components/base/input.vue';

import { DatabaseIcon, Menu2Icon, DatabaseExclamationIcon, DatabaseEditIcon, EditIcon, XIcon } from 'vue-tabler-icons';
import AGLoader from 'components/utils/loader.vue';
import AGDeleteEntityModal from 'components/utils/deleteEntityModal.vue';
import AGDatabaseModal from 'components/settings/databaseModal.vue';
const session = sessionStore();
import { fetchDatabases, searchDatabases } from 'src/apis/database';
export default {
  name: 'AGSettingsDatabases',
  components: { AGLoader, DatabaseIcon, AGDeleteEntityModal, AGDatabaseModal, AGInput, Menu2Icon, DatabaseExclamationIcon, EditIcon, XIcon, DatabaseEditIcon },
  pros: ['queryParams', 'currentTab'],
  mounted() {
    this.fetchDatabases();
  },

  watch: {
    query() {
      searchDatabases(this.query, this.setDatabases);
    },
    editScopedDB() {
      this.$emit('update:queryParams', { editScopedDB: this.editScopedDB, baseDB: this.editScopedBaseDB })
      this.$emit('update:currentTab', 'editScopedDB')
    },
    scopedDB() {
      this.$emit('update:queryParams', { baseDB: this.scopedDB })
      this.$emit('update:currentTab', 'scopedDB')
    }
  },



  data() {
    return {
      loading: false,
      scopedDB: null,
      editScopedDB: null,
      editScopedBaseDB: null,
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
