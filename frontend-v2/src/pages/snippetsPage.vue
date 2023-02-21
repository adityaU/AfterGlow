<template>
  <div>
    <WithLoginHeader />
    <div class="tw-flex tw-mx-6 tw-my-3 tw-flex-col tw-gap-2">
      <div
        class="tw-py-2 tw-px-4 tw-bg-white tw-border tw-rounded-sm tw-shadow-sm tw-w-full"
      >
        <AGDatabaseSelector v-model:selectedDatabase="database" />
      </div>

      <AGSnippetsList :databaseID="databaseID" :databaseName="database?.name" />
    </div>

    <AGFooter />
  </div>
</template>
<script>
import { authMixin } from 'src/mixins/auth';
import AGSnippetsList from 'components/snippets/list.vue';
import { currentUserStore } from 'src/stores/currentUser';
import WithLoginHeader from 'components/header/withLogin.vue';
import AGDatabaseSelector from 'components/question/dbSelector.vue';
import AGFooter from 'components/footer/static.vue';
import { fetchDatabase } from 'src/apis/database';
import { fetchSnippets } from 'src/apis/snippet';
import isEqual from 'lodash/isEqual';
import { sessionStore } from 'src/stores/session';
const currentUser = currentUserStore();
const session = sessionStore();

export default {
  name: 'AGSnippetsPage',
  components: { WithLoginHeader, AGDatabaseSelector, AGSnippetsList, AGFooter },
  mixins: [authMixin],

  watch: {
    $route() {
      if (this.databaseID != this.$route?.query?.database_id) {
        this.databaseID = this.$route?.query?.database_id;
      }
    },
    database: {
      deep: true,
      handler() {
        if (!isEqual(this.database?.id, this.databaseID)) {
          this.databaseID = this.database?.id;
        }
      },
    },
    databaseID() {
      if (this.databaseID) {
        this.$router.push({ query: { database_id: this.databaseID } });
        fetchDatabase(this.databaseID, session.token, this.setDatabase);
      }
    },
    currentUser: {
      deep: true,
      handler() {
        if (!this.currentUser.canEditQuestion) {
          this.$router.replace({ path: '/questions' });
        }
      },
    },
  },
  data() {
    return {
      currentUser: currentUser,
      databaseID: 0,
      database: null,
    };
  },

  mounted() {
    if (this.$route?.query?.database_id) {
      this.databaseID = this.$route?.query?.database_id;
    }
    if (this.databaseID) {
      fetchDatabase(this.databaseID, session.token, this.setDatabase);
    }
  },

  methods: {
    setDatabase(database) {
      this.database = database;
    },
  },
};
</script>
