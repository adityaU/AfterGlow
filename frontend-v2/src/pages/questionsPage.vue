
<template>
  <Suspense>
    <AGTable :resultsKey="resultsKey" :dataLoaded="dataLoaded"></AGTable>
  </Suspense>
</template>

<script lang="ts">
import AGTable from 'components/table.vue';
import { defineComponent  } from 'vue';
import { useRoute } from 'vue-router';
import {api} from 'boot/axios';
import { resultsStore } from 'stores/results'
import hash from '../helpers/hash'
import apiConfig from '../helpers/apiConfig'

export default defineComponent({
  name: 'QuestionPage',
  components: { AGTable },

  data(){
    const route = useRoute();
    return {
      resultsKey: null, 
      dataLoaded: false
    }
  },
  async created () {
    const route = useRoute();
    const results = resultsStore();
    let key = await hash(route.query.payload)
    let completed = api.post('query_results',  JSON.parse(route.query.payload), apiConfig(route.query.token)).then((response)=>{
      results.pushResults(response.data, key)

      this.dataLoaded = true
    })
    this.resultsKey = key
    return { key , completed };
  }
});
</script>
