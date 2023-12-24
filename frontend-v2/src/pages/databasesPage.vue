<template>
  <div v-if="!currentUser.loading">

    <div class="tw-flex tw-items-center tw-justify-center tw-p-4" >
      <AGInput
        v-model:value="query"
        placeholder="Search Databases"
        class="tw-w-[500px]"
        debounce="500"
      />
    </div>
    <AGLoader text="Fetching Databases" v-if="loading" />
    <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-mx-6 tw-my-3" v-if="!loading">
      <div
        class="tw-bg-white tw-border- tw-rounded-2xl tw-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-gap-2"
        v-for="db in databases"
        :key="db"
      >
        <DatabaseIcon size="48" class="icon-primary" />
        <div
          class="tw-text-primary tw-cursor-pointer tw-text-xl tw-font-semibold tw-flex-1"
        >
          <router-link
            :to="'/data_references/databases/' + db.id + '/tables'"
            >{{ db.name }}</router-link
          >
          <div class="note">{{ db.db_type }}</div>
        </div>
        <div
          class="tw-cursor-pointer tw-text-primary tw-uppercase tw-font-semibold"
          v-if="currentUser.canEditQuestion"
          @click="sync(db.id)"
        >
          Sync
        </div>
      </div>
    </div>
    <AGToast v-model:show="showToastKey" type="ok">
      YaY! Sync has been successfully initiated. Please check database details
      after some time.</AGToast
    >
  </div>
  <AGLoader v-else />
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import { fetchDatabases, syncDatabase, searchDatabases } from 'src/apis/database';
import { sessionStore } from 'stores/session';
import { authMixin } from 'src/mixins/auth';
import { DatabaseIcon } from 'vue-tabler-icons';
import { currentUserStore } from 'src/stores/currentUser';
import AGToast from 'components/utils/toast.vue';
import AGInput from 'components/base/input.vue';

const currentUser = currentUserStore();
const session = sessionStore();
export default {
  name: 'AGDatabases',
  components: { AGLoader, DatabaseIcon, AGToast, AGInput },

  mixins: [authMixin],

  data() {
    return {
      databases: [],
      loading: false,
      currentUser: currentUser,
      showToastKey: false,
      query: "",
    };
  },

  watch: {
    query() {
      searchDatabases(this.query, (databases, loading) => {
        this.databases = databases
        this.loading = loading;
      });
    },
  },

  mounted() {
    fetchDatabases(session.token, this.setDatabases);
  },

  methods: {
    setDatabases(databaases, loading) {
      this.databases = databaases || [];
    },
    sync(dbID) {
      syncDatabase(dbID, this.showToast);
    },

    showToast(_, loading) {
      if (!loading) {
        this.showToastKey = true;
      }
    },
  },
};
</script>
