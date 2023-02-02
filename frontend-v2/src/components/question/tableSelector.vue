<template>
  <div>
    <div class="tw-flex tw-cursor-pointer">
      <div class="tw-border tw-border-primary tw-px-2  tw-text-primary tw-font-semibold" :class="selectedTableLocal?.name ? 'tw-rounded-l-sm' : 'tw-rounded-sm'"> Table </div>
      <div class="tw-border tw-border-primary tw-bg-primary tw-text-white tw-px-2 tw-rounded-r-sm" v-if="selectedTableLocal?.name"> {{selectedTableLocal?.name}} </div>
      <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="800px" 
        class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
        <SelectOptions :options="tables" v-model:selected="selectedTableLocal" :menuShow="menuShow" iconLetter="D"
          displayKey="name" areOptionObjects="true" disableLocalSearch="true" v-model:searchQuery="q" hideOnClick=true />
      </q-menu>
    </div>

  </div>
</template>
<script>
import SelectOptions from 'components/base/selectOptions.vue'
import {sessionStore} from 'stores/session'

import isEqual from 'lodash/isEqual'

const session = sessionStore()
import {searchTables} from 'src/apis/database'
export default {
  name: 'AGTableSelector',
  props: ['selectedTable', 'database'],
  components: {SelectOptions},
  watch: {
    selectedTable(oldV, newV){
      if (!isEqual(oldV, newV)){
        this.selectedTableLocal = this.selectedTable
      }

    },
    selectedTableLocal(oldV, newV){
      if (!isEqual(oldV, newV)){
        this.$emit('update:selectedTable', this.selectedTableLocal)
      }

    },

    q(){
     this.fetchTables(this.q)
    },
    database: {
      deep: true,
      handler(){
        this.q = ""
        this.fetchTables("")
      }
    },


  },

  mounted(){
    this.fetchTables("")
  },

  data(){
    return {
      tables: [],
      selectedTableLocal: this.selectedTable,
      q: "",
    }
  },

  methods: {
    setUpTables(tables, _loading){
      this.tables = tables || []
    },

    fetchTables(q){

      if (this.database?.id) {

        searchTables(this.database?.id, q, true, session.token, this.setUpTables)
      }
    }
  }

}
</script>
