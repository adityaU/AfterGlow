<template>
  <Suspense>
    <BaseDataRenderer :resultsKey="resultsKey" :dataLoaded="dataLoaded"></BaseDataRenderer>
  </Suspense>
</template>

<script lang="ts">
import BaseDataRenderer from 'components/dataRenderers/base.vue';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { resultsStore } from 'stores/results'
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

export default defineComponent({
  name: 'QuestionPage',
  components: { BaseDataRenderer },

  data() {
    return {
        resultsKey: null,
        dataLoaded: false
    }
  },
  async created() {
    const route = useRoute();
    const results = resultsStore();
    let key = await hash(route.query.payload)
    let completed = api.post('query_results', JSON.parse(route.query.payload), apiConfig(route.query.token)).then((response) => {
      results.pushResults(response.data, key)
      this.dataLoaded = true
    })
    this.resultsKey = key
    return { key, completed };
  }
});
</script>
