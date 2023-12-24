<template>
  <div v-if="!currentUser.loading">
    <div class="tw-flex tw-mx-6 tw-my-3 tw-flex-col tw-gap-2">
      <div
        class="tw-py-2 tw-px-4 tw-bg-white tw-border tw-rounded-2xl tw-w-full"
      >
        <div
          class="tw-flex tw-border tw-border-primary tw-rounded-2xl tw-w-fit"
        >
          <div class="tw-px-2 tw-border tw-border-primary">Database:</div>
          <div
            class="tw-px-2 tw-border tw-border-primary tw-bg-primary tw-text-white"
          >
            {{ database?.name }}
          </div>
        </div>
      </div>
      <div class="ag-card">
        <AGSnippet :snippet="snippet" :key="snippet" />
      </div>
    </div>
  </div>
  <AGLoader v-else />
</template>
<script>
import { authMixin } from 'src/mixins/auth';
import AGSnippet from 'components/snippets/snippet.vue';
import { currentUserStore } from 'src/stores/currentUser';
import { fetchSnippet } from 'src/apis/snippet';
import { fetchDatabase } from 'src/apis/database';
import { sessionStore } from 'src/stores/session';
import AGLoader from 'components/utils/loader.vue';
const session = sessionStore();
const currentUser = currentUserStore();

export default {
  name: 'AGSnippetPage',
  components: { AGSnippet, AGLoader },
  mixins: [authMixin],

  watch: {
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
      snippet: null,
      database: null,
    };
  },

  mounted() {
    if (this.$route.params.id) {
      fetchSnippet(this.$route.params.id, this.setSnippet);
    }
  },

  methods: {
    setSnippet(snippet) {
      this.snippet = snippet;
      if (snippet.database_id) {
        fetchDatabase(snippet.database_id, session.token, this.setDatabase);
      }
    },
    setDatabase(database) {
      this.database = database;
    },
  },
};
</script>
