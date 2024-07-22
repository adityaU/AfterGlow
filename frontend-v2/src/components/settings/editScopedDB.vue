<template>
  <div class="tw-bg-white tw-p-4 ag-card tw-w-full tw-text-default/80">
    <div class="tw-flex tw-max-w-[800px] tw-mx-auto">
      <div class="tw-flex-1 tw-font-semibold tw-text-2xl">Edit Schema Permissions for {{ editingDB?.name }}</div>
      <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2" :disabled="!editingDB?.name" @click="create">Save
      </AGButton>
    </div>
    <div class=" tw-my-4 tw-mx-auto tw-max-w-[800px]">
      <div class="note tw-my-1 ">From Database</div>
      <AGInput class="" v-model:value="database.name" placeholder="Name" debounce="500" disabled v-if="database" />
      <div class="note tw-my-1 tw-mt-2">Database Name</div>
      <AGInput :value="editingDB?.name" placeholder="Name" debounce="500" disabled />

    </div>

    <div class=" tw-max-w-[800px] tw-mx-auto tw-my-2">
      <div class="note">Select tables and their columns, that you want this database scoped to.</div>
      <div class="tw-flex tw-gap-2">
        <AGInput v-model:value="query" placeholder="Search Tables" debounce="500" class="tw-flex-1" />
        <AGButton class="tw-text-default/80 hover:tw-bg-secondary tw-p-2" @click="deselectAll" v-if="selectAllClicked">
          Deselect All </AGButton>
        <AGButton class="tw-text-default/80 hover:tw-bg-secondary tw-p-2" @click="selectAll" v-if="deselectAllClicked">
          Selected All </AGButton>
      </div>
    </div>
    <div class=" tw-border tw-rounded-2xl tw-divide-y tw-max-w-[800px] tw-mx-auto">
      <div class="tw-flex tw-justify-center tw-items-center tw-px-4 tw-py-2  ">
        <div class="tw-uppercase tw-font-semibold tw-flex-1 note">Table</div>
        <div class="tw-uppercase tw-font-semibold note">Select All Columns</div>
      </div>

      <div class="  tw-flex tw-flex-col tw-justify-center " v-for="table in selectedTables"
        :key="[table.name, table.are_all_columns_selected]">
        <div class="tw-flex tw-justify-center tw-items-center tw-px-4 tw-gap-2 ">
          <div class="tw-cursor-pointer" @click="((table.open = !table.open) || true) && fetchColumns(table)">
            <ChevronDownIcon size="24" v-if="table.open" />
            <ChevronRightIcon size="24" v-if="!table.open" />
          </div>
          <div class=" tw-flex-1">{{ table.name }}</div>
          <AGBool :value="table.are_all_columns_selected" @update:value="(v) => selectColumns(v, table)" />

        </div>
        <template v-if="table.open">
          <div class="tw-mx-8 tw-mb-2">
            <span class="note">Warning:</span><span>If you select specific columns from the table, select * query on this
              table won't
              work for this new DB. However you can still select specific columns from table.</span>
          </div>
          <div class=" tw-border tw-rounded-2xl tw-divide-y tw-mx-8 tw-mb-4">
            <div class="tw-flex tw-justify-center tw-items-center tw-px-4 tw-py-2  ">
              <div class="tw-uppercase tw-font-semibold tw-flex-1 note">column</div>
              <div class="tw-uppercase tw-font-semibold note">Select</div>
            </div>
            <div class="  tw-flex tw-flex-col tw-justify-center " v-for="column in table.columns"
              :key="column.name + column.is_selected">
              <div class="tw-flex tw-justify-center tw-items-center tw-px-4 tw-gap-2">
                <div class=" tw-flex-1">{{ column.name }}</div>
                <AGBool :value="column.is_selected" @update:value="(v) => selectColumn(v, column, table)"
                  :disabled="column.disableSelect" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchDatabase } from 'src/apis/database';
import { searchTables, getColumns, updateScopedDB } from 'src/apis/database';
import every from 'lodash/every';

import { ChevronRightIcon, ChevronDownIcon } from 'vue-tabler-icons';

import AGBool from 'components/base/bool.vue';
import AGInput from 'components/base/agInput.vue';
import AGButton from 'components/base/button.vue';


import { sessionStore } from 'stores/session';
export default {
  name: 'AGSettingsEditScopedDB',
  components: { AGBool, ChevronDownIcon, ChevronRightIcon, AGInput, AGButton },
  props: ['queryParams'],

  mounted() {
    fetchDatabase(this.queryParams?.baseDB, this.session.token, this.setDatabases);
    fetchDatabase(this.queryParams?.editScopedDB, this.session.token, this.setEditingDatabases);

  },
  watch: {
    queryParams() {
      fetchDatabase(this.queryParams?.baseDB, this.session.token, this.setDatabases);
    },

    query() {
      this.selectedTables = this.tables.filter((t) => t.name.toLowerCase().includes(this.query.toLowerCase()));
    },
    database() {
      if (this.database?.id && this.editingDB?.id) {
        this.selectedTables = [];
        this.query = "";
        searchTables(this.database.id, "", false, this.session.token, this.setTables)
      }
    },
    editingDB() {
      if (this.database?.id && this.editingDB?.id) {
        this.selectedTables = [];
        this.query = "";
        searchTables(this.database.id, "", false, this.session.token, this.setTables)
      }
    },
  },
  data() {
    return {
      database: null,
      editingDB: null,
      loading: false,
      tables: [],
      session: sessionStore(),
      selectedTables: [],
      selectAllClicked: true,
      deselectAllClicked: false,
      name: "",
      query: ""
    };
  },
  methods: {
    create() {
      let payload = { name: this.name, base_db_id: this.database.id, tables: [] }
      this.tables.forEach((t) => {
        let table = { id: t.id, columns: [], are_all_columns_selected: t.are_all_columns_selected }
        if (!t.are_all_columns_selected) {
          t.columns?.forEach((c) => {
            if (c.is_selected) {
              table.columns.push(c.id)
            }
          })
        }
        payload.tables.push(table)
      })

      updateScopedDB(this.editingDB.id, payload, (data) => {
        this.$emit('update:currentTab', 'databases')
      })
    },
    fetchColumns(table) {
      if (!table.open) {
        return;
      }

      if (table.columns?.length > 0) {
        return;
      }

      getColumns(table.id, this.session.token, (data, loading) => {
        table.columns = data?.columns || [];
        table.loading = loading;
        if (table.columns.length > 0) {
          if (table.are_all_columns_selected) {
            table.columns.forEach((c) => { c.is_selected = true })
          } else {
            table.columns.forEach((c) => { c.is_selected = false })
          }

        }

      });

    },
    setDatabases(database, loading) {
      this.database = database || null;
      this.loading = loading;
    },

    setEditingDatabases(database, loading) {
      this.editingDB = database || null;
      this.loading = loading;
    },

    setTables(tables, loading) {
      this.tables = tables || [];
      this.selectedTables = this.tables;
      this.loading = loading;
      this.tables.forEach((t) => { t.are_all_columns_selected = false })
      searchTables(this.editingDB.id, "", false, this.session.token, (tables, loading) => {
        if (!loading) {
          tables.forEach((t) => {
            getColumns(t.id, this.session.token, (data, loading) => {
              let scopedColumnData = data;
              if (!loading) {
                let originalTable = this.tables.find((table) => table.name === t.name)
                if (!originalTable.columns || originalTable.columns.length == 0) {
                  getColumns(originalTable.id, this.session.token, (data, loading) => {
                    if (!loading) {
                      originalTable.columns = data.columns;
                      originalTable.columns.forEach((c) => {
                        c.is_selected = scopedColumnData.columns.find((col) => col.name === c.name) ? true : false;
                        if (c.is_selected) {
                          c.disableSelect = true
                        }
                      })
                      if (every(originalTable.columns, { is_selected: true })) {
                        originalTable.are_all_columns_selected = true
                      } else {
                        originalTable.are_all_columns_selected = false
                      }
                    }
                  })
                }
              }
            })
          })
        }
      })
    },

    findTableByName(name) {
      return this.tables.find((t) => t.name === name)
    },

    selectColumns(v, table) {
      table.are_all_columns_selected = v
      if (table.are_all_columns_selected) {
        table.columns?.forEach((c) => {
          !c.disableSelect && (c.is_selected = true)
        })
      } else {
        table.columns?.forEach((c) => {
          !c.disableSelect && (c.is_selected = false)
        })
        this.checkAllSelected(table)

      }

    },
    selectAll() {
      this.selectAllClicked = true
      this.deselectAllClicked = false
      this.selectedTables.forEach((t) => {
        t.are_all_columns_selected = true
        t.columns?.forEach((c) => {
          !c.disableSelect && (c.is_selected = false)
        })
        this.checkAllSelected(t)
      })
    },


    deselectAll() {
      this.selectAllClicked = false
      this.deselectAllClicked = true
      this.selectedTables.forEach((t) => {
        t.are_all_columns_selected = false
        t.columns?.forEach((c) => {
          !c.disableSelect && (c.is_selected = false)
        })
        this.checkAllSelected(t)
      })
    },

    selectColumn(v, column, table) {
      column.is_selected = v
      this.checkAllSelected(table)
    },

    checkAllSelected(table) {
      let allSelected = false;
      for (let i = 0; i < table.columns.length; i++) {
        if (table.columns[i].is_selected) {
          allSelected = true;
        } else {
          allSelected = false;
          break;
        }
      }

      if (allSelected) {
        table.are_all_columns_selected = true
      } else {
        table.are_all_columns_selected = false
      }

    }
  }

}
</script>
