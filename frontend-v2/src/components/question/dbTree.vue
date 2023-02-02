<template>
  <div class="tw-p-3 ">
    <AGInput v-model:value="q" placeholder="Search tables and columns" />
    <AGLoader text="Fetching search results" v-if="loading" />
    <div class="tw-overflow-auto tw-h-[calc(100%-35px)] tw-mt-2">
      <template v-for="table in tables" :key="table">
        <div class="tw-flex tw-items-center tw-gap-2">
          <CaretDownIcon size="16" class="tw-stroke-primary tw-cursor-pointer" v-if="table.open" @click="table.open = false"/>
          <CaretRightIcon size="16" class="tw-stroke-primary tw-cursor-pointer "  v-if="!table.open" @click="(table.open = true) && loadColumns(table)"/>
          <div class="tw-flex tw-flex-1 tw-items-center tw-gap-1 tw-cursor-pointer" :ref="table.readable_table_name" @click="((table.open = !table.open) || true) && loadColumns(table)">
            <TableIcon size="16" class="tw-stroke-primary"/>
            {{table.readable_table_name}}
          </div>
          <div class="tw-justify-self-end tw-flex tw-gap-1">
            <span>
              <ArrowRightIcon size="16" class="tw-stroke-primary tw-cursor-pointer " @click="$emit('pasteAtCursor', table.name)" />
              <q-tooltip>
                Paste At Cursor
              </q-tooltip>
            </span>
            <a :href="'/data_references/databases/' +  database.id +  '/tables/' + table.id + '/explore'" target="_blank">
              <ZoomInIcon size="16" class="tw-stroke-primary tw-cursor-pointer " />

              <q-tooltip>
                Explore In New Tab
              </q-tooltip>
            </a>
          </div>
        </div>
        <div class="" v-if="table.open">
          <AGLoader text="Fetching Columns" v-if="table.loading" />
          <div v-for="c in table.columns" :key=c >
            <div class="tw-flex">
              <div class="tw-flex tw-items-center tw-gap-1 tw-pl-10 tw-flex-1" >
                <ColumnsIcon class="tw-stroke-primary" size=16 v-if="!c.primary_key && c.belongs_to.length === 0 "/>
                <KeyIcon class="tw-stroke-red-700" size=16 v-if="c.primary_key"/>
                <HierarchyIcon class="tw-stroke-green-700" size=16 v-if="c.belongs_to.length >  0 "/>
                <div class="tw-text-primary tw-font-semibold tw-cursor-pointer" v-if="c.belongs_to.length > 0" @click="goToTable(c)"> {{c.name}} </div>
                <div class="tw-font-semibold" v-if="c.primary_key"> {{c.name}} </div>
                <div v-if="!c.primary_key && c.belongs_to.length === 0 "> {{c.name}} </div>
              </div>
              <div class="tw-justify-self-end">
                <span>
                  <ArrowRightIcon size="16" class="tw-cursor-pointer tw-stroke-primary" @click="$emit('pasteAtCursor', c.name)" />
                  <q-tooltip>
                    Paste at Cursor
                  </q-tooltip>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="tw-flex tw-h-full tw-items-center tw-justify-center" v-if="tables.length === 0">
        No Tables To Show.
      </div>
    </div>
  </div>
</template>
<script>
import {searchTables, getColumns} from 'src/apis/database'
import {sessionStore } from 'stores/session'
import AGInput from 'components/base/input.vue'
import AGLoader from 'components/utils/loader.vue'
import {CaretRightIcon, CaretDownIcon, TableIcon, ZoomInIcon, ArrowRightIcon, ColumnsIcon, KeyIcon, HierarchyIcon} from 'vue-tabler-icons'
const session = sessionStore()
export default {
  name: "AGDBTree",
  props: ["database", "tableList"],
  components: {CaretRightIcon, CaretDownIcon, TableIcon, ZoomInIcon, ArrowRightIcon, ColumnsIcon, KeyIcon, HierarchyIcon,
    AGInput, AGLoader
  },



  watch: {
    allTables: {
      deep: true,
      handler(){
        this.$emit('update:tableList', this.allTables)
      }
    },
    q(){
      this.search(this.q)
    },

    database: {
      deep: true, 
      handler(){
        this.q = ""
        this.search("")
      }
    }

  },

  mounted(){
    this.search("")
  },


  data(){
    return {
      tables: [],
      q: "",
      allTables: [],
      loading: false,
    }
  },

  methods: {
    search(q){
      searchTables(this.database.id, q , false, session.token, this.setTables)
    },
    loadColumns(table){
      getColumns(table.id, session.token, this.setTable(table))

    },
    setTable(t) {
      return (table, loading) => {
        t.loading = loading
        if (table) {
          t.columns = table.columns
        }
      }
    },
    goToTable(c){
      "pass"
    },
    setTables(tables, loading){
      this.tables = tables || []
      this.loading = loading
      if (this.q === ""){
        this.allTables = tables || []
      }
    }
  }

}
</script>
