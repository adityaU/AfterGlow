<template>
  <div v-if="!currentUser.loading">
    <AGLoader text="Fetching Columns" v-if="loading" />
    <div class="tw-mx-6 tw-my-3" v-if="!loading">
      <AGInput
        class="tw-bg-white"
        placeholder="Search columns"
        v-model:value="q"
        debounce="300"
      />

      <div class="tw-border tw-rounded-2xl tw-bg-white tw-my-3">
        <table
          class="tw-text-default tw-w-full"
          cellpadding="0"
          cellspacing="0"
        >
          <thead>
            <tr class="tw-text-left tw-px-4 tw-text">
              <th
                class="tw-px-2 tw-py-2 tw-text-auto tw-uppercase tw-font-semibold tw-border-b tw-text-sm tw-text-default"
                v-for="column in displayColumns"
                :key="column"
              >
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="tw-border-b even:tw-bg-secondary tw-h-[1px] parent-container"
              :style="parentStyle"
              v-for="column in filteredColumns"
              :key="column"
            >
              <td class="tw-p-2 tw-flex tw-gap-2 tw-items-center tw-max-w-full">
                <ColumnsIcon size="16" />
                {{ column.name }}
              </td>
              <td class="tw-p-2 tw-max-w-full">
                {{ column.data_type }}
              </td>
              <td
                class="tw-p-2 tw-flex tw-items-center tw-w-full tw-max-w-full tw-gap-2"
              >
                <div class="tw-flex-1" v-if="!column.editMode">
                  {{ column.description }}
                </div>
                <div class="tw-flex-1">
                  <AGInput
                    v-model:value="column.description"
                    placeholder="Column Description"
                    v-if="column.editMode"
                  />
                </div>
                <EditIcon
                  size="16"
                  v-if="!column.editMode && currentUser.canEditQuestion"
                  class="tw-cursor-pointer"
                  @click="column.editMode = true"
                />
                <CheckIcon
                  size="16"
                  v-if="column.editMode && currentUser.canEditQuestion"
                  class="tw-cursor-pointer"
                  @click="
                    ((column.editMode = false) || true) && saveColumn(column)
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <AGLoader v-else />
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import AGInput from 'components/base/input.vue';

import { sessionStore } from 'stores/session';
import { currentUserStore } from 'src/stores/currentUser';
import { authMixin } from 'src/mixins/auth';
import { ColumnsIcon, EditIcon, CheckIcon } from 'vue-tabler-icons';
import { getColumns, saveColumn } from 'src/apis/database';

const session = sessionStore();
const currentUser = currentUserStore();
export default {
  name: 'AGDatabaseColumns',

  components: {
    AGLoader,
    ColumnsIcon,
    AGInput,
    EditIcon,
    CheckIcon,
  },

  mixins: [authMixin],

  computed: {
    filteredColumns() {
      if (!this.q) {
        return this.columns;
      }
      return this.columns.filter((t) => {
        return t.name.toLowerCase().match(this.q.toLowerCase());
      });
    },
  },

  data() {
    return {
      displayColumns: ['Column name', 'data type', 'Description'],
      columns: [],
      q: '',
      loading: false,
      currentUser: currentUser,
    };
  },

  mounted() {
    getColumns(this.$route.params.table_id, session.token, this.setColumns);
  },

  methods: {
    setColumns(table, loading) {
      this.columns = table?.columns || [];
      this.loading = loading;
    },
    saveColumn(column) {
      saveColumn(column, () => {
        'pass';
      });
    },
  },
};
</script>
