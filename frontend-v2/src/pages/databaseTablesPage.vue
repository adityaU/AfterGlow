<template>
  <div>


    <WithLoginHeader />
    <AGLoader text="Fetching Tables" v-if="loading" />
    <div class="tw-mx-6 tw-my-3" v-if="!loading">
      <AGInput class="tw-bg-white" placeholder="Search tables" v-model:value="q" debounce=300 />

      <div class="tw-border tw-rounded-sm tw-shadow-sm tw-bg-white tw-my-3">
        <table class="tw-text-default tw-w-full" cellpadding="0" cellspacing="0" >
          <thead>
            <tr class="tw-text-left tw-px-4  tw-text">
              <th class="tw-px-2 tw-py-2 tw-text-auto tw-uppercase tw-font-semibold tw-border-b tw-text-sm tw-text-default" v-for="column in columns"
                :key="column">
                {{column}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="tw-border-b even:tw-bg-secondary tw-h-[1px] parent-container" :style="parentStyle" v-for="table in filteredTables" :key="table">
              <td class=" tw-gap-2 tw-p-2 " >
                <router-link class="tw-flex tw-gap-2 tw-items-center tw-text-primary tw-font-semibold" :to="'/data_references/databases/' + $route.params.database_id +  '/tables/' +  table.id">
                  <TableIcon size="16" />
                  {{table.name}}
                </router-link>
              </td>
              <td class="tw-p-2 tw-flex tw-items-center tw-w-full tw-max-w-full tw-gap-2">
                <div class="tw-flex-1" v-if="!table.editMode">{{table.description}}</div>
                <div class="tw-flex-1"> <AGInput v-model:value="table.description" placeholder="Table Description" v-if="table.editMode" /></div>
                <EditIcon size="16" v-if="!table.editMode && currentUser.canEditQuestion" class="tw-cursor-pointer" @click="table.editMode = true"/>                
                <CheckIcon size="16" v-if="table.editMode && currentUser.canEditQuestion" class="tw-cursor-pointer" @click="((table.editMode = false) || true) && saveTable(table)"/>                
              </td>
              <td class="tw-p-2 tw-text-right tw-pr-4 !tw-w-fit">
                <router-link :to="{path: '/questions/new', query: {database_id: $route.params.database_id, table_id: table.id}}" class="tw-cursor-pointer tw-text-primary tw-uppercase tw-font-semibold"> Explore </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import AGLoader from 'components/utils/loader.vue'
import AGInput from 'components/base/input.vue'
import WithLoginHeader from 'components/header/withLogin.vue'

import {sessionStore} from 'stores/session'
import { currentUserStore } from 'src/stores/currentUser'
import {authMixin} from 'src/mixins/auth'
import { TableIcon, EditIcon, CheckIcon } from 'vue-tabler-icons'
import { searchTables, saveTable } from 'src/apis/database'

const session = sessionStore()
const currentUser = currentUserStore()
export default {
  name: 'AGDatabaseTables',

  components: {AGLoader, WithLoginHeader, TableIcon, AGInput, EditIcon, CheckIcon},

  mixins: [authMixin],

  computed: {
    filteredTables(){
      if (!this.q){return this.tables}
      return this.tables.filter(t => {
        return t.name.toLowerCase().match(this.q.toLowerCase())
      })
    }
  },

  data(){
    return {
      columns: ['Table name', 'Description', ''],
      tables: [],
      q: "",
      loading: false,
      currentUser: currentUser,
    }
  },

  mounted(){
    searchTables(this.$route.params.database_id, "", true, session.token, this.setTables )
  },

  methods: {
    setTables(tables, loading){
      this.tables = tables || []
      this.loading = loading

    },
    saveTable(table){
      saveTable(table, () => {'pass'})
    }
  }


}
</script>
