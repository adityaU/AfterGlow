<template v-if="dataLoaded">
<div class="q-table__container q-table--vertical-separator column no-wrap q-table__card q-table--no-wrap">
<div class="q-table__middle scroll">
<table class="q-table"><thead>
<tr>
<th class="text-right" v-for="column in columns" :key="column">{{column}}</th>
</tr>

</thead>
<tbody>
<tr v-for="row in rows" :key="row">
  <td v-for="el in row" :key="el">{{el}}</td>
</tr>

</tbody>

</table>
</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { resultsStore } from 'stores/results'
export default defineComponent({
  name: 'AGTable',
  props: [
    'resultsKey',
    'dataLoaded',
  ],

  watch: {
    resultsKey: function() {
      this.updateProps()
    },
    dataLoaded: function() {
    this.updateProps()

    }
  },

  methods: {
    updateProps() {
        const results = resultsStore()
        if (this.resultsKey && this.dataLoaded) {
          const r = results.getResults(this.resultsKey)
          this.columns = r.data.columns
          this.rows = r.data.rows   
        }
    }
  }

  // setup(){
  // }
})
</script>
