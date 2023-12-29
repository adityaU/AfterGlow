<template>
  <div>
    <AGLoader class="tw-h-[90vh]" text="Fetching Snippets" v-if="loading" />
    <div
      class="tw-flex tw-items-center tw-justify-center tw-h-full tw-min-h-[400px]"
      v-if="!databaseID"
    >
      Please Select a Database to view it's snippets
    </div>

    <div
      class="tw-flex tw-items-center tw-justify-center tw-h-full tw-min-h-[400px]"
      v-if="databaseID && !loading && snippets.length === 0"
    >
      Database: {{ databaseName }} doesn't have any snippets. You can create
      snippets from sql editor in any question on this database.
    </div>
    <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-py-2" v-else>
      <div
        class="tw-py-2 tw-bg-white ag-card"
        v-for="snippet in snippets"
        :key="snippet"
      >
        <AGSnippet :snippet="snippet" v-model:monaco="monaco" />
      </div>
    </div>
  </div>
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import AGSnippet from 'components/snippets/snippet.vue';
import { fetchSnippets } from 'src/apis/snippet';
export default {
  name: 'AGSnippetList',
  components: { AGLoader, AGSnippet },
  props: ['databaseID', 'databaseName'],
  data() {
    return {
      snippets: [],
      loading: false,
      monaco: null,
    };
  },

  watch: {
    databaseID() {
      this.fetchSnippets();
    },
  },

  mount() {
    this.fetchSnippets();
  },
  methods: {
    fetchSnippets() {
      if (this.databaseID) {
        fetchSnippets(this.databaseID, this.setSnippets);
      }
    },

    setSnippets(snippets, loading) {
      this.snippets = snippets;
      this.loading = loading;
    },
  },
};
</script>
