<template v-if="results">
  <div class="tw-flex tw-flex-col tw-w-full">
    <AGLocalFilters
      v-model:filteredResults="filteredResults"
      :settings="settingsLocal"
      :results="results"
    />
    <div
      class="tw-h-full tw-w-full tw-flex tw-justify-center tw-text-2xl"
      v-if="rows && rows.length <= 0"
    >
      No Results
    </div>
    <div class="tw-h-full tw-w-full" v-if="rows && rows.length > 0">
      <slot
        :columns="columns"
        :rows="rows"
        v-if="rows && rows.length > 0"
        :settings="settingsLocal"
      />

      <div
        class="pagination tw-my-7 tw-flex tw-justify-center"
        v-if="lastPageNumber > 1"
      >
        <div
          class="tw-cursor-pointer"
          href="#"
          :class="[
            pageNumber === 1 ? arrowButtonsDisabledClass : arrowButtonsClass,
          ]"
          @click="decrementPageNumber"
        >
          <ChevronsLeftIcon size="16" />
        </div>
        <div
          class="tw-cursor-pointer"
          :class="[
            pageNumber === displayPageNumberStart + n - 1
              ? pageNumberButtonsActiveClass
              : pageNumberButtonsClass,
          ]"
          @click="setPageNumber(n)"
          v-for="n in totalPageNumbers"
          :key="n"
        >
          {{ this.displayPageNumberStart + n - 1 }}
        </div>

        <div
          class="tw-cursor-pointer"
          href="#"
          :class="[
            pageNumber === lastPageNumber
              ? arrowButtonsDisabledClass
              : arrowButtonsClass,
          ]"
          @click="increamentPageNumber"
        >
          <ChevronsRightIcon size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronsLeftIcon, ChevronsRightIcon } from 'vue-tabler-icons';
import AGLocalFilters from 'components/dataRenderers/charts/localFilters.vue';

import _ from 'lodash';

const eqSet = (xs, ys) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));

export default {
  name: 'AGTable',
  components: { ChevronsRightIcon, ChevronsLeftIcon, AGLocalFilters },

  props: [
    'results',
    'showSettings',
    'isTransposed',
    'settings',
    'apiActionsQuesLevel',
    'visualizationID',
    'questionID',
  ],

  data() {
    return {
      lastPageNumber: this.lastPageNumber,
      displayPageNumberStart: this.displayPageNumberStart,
      displayPageNumberEnd: this.displayPageNumberEnd,
      rows: this.rows,
      columns: this.columns,
      size: 20,
      settingsLocal: this.settings,
      filteredResults: this.results,
    };
  },

  watch: {
    filteredResults: {
      deep: true,
      handler() {
        this.pageNumber = 1;
        this.updateProps();
      },
    },

    apiActionsQuesLevel: {
      deep: true,
      handler() {
        this.updateProps();
      },
    },
    settings: {
      handler() {
        this.updateProps(this.settings);
      },
      deep: true,
    },
  },

  emits: ['update:pageNumber'],
  methods: {
    setPageNumber(index) {
      this.pageNumber = this.displayPageNumberStart + index - 1;
      this.updateProps();
    },
    decrementPageNumber() {
      if (this.pageNumber > 1) {
        this.pageNumber -= 1;
        this.updateProps();
      }
    },
    increamentPageNumber() {
      if (this.lastPageNumber != this.pageNumber) {
        this.pageNumber += 1;
        this.updateProps();
      }
    },
    updateProps(settings) {
      if (settings) {
        this.settingsLocal = _.cloneDeep(settings);
      }
      let r = this.filteredResults;
      if (r) {
        let rows = [];
        const settingsColumns = new Set(
          (this.settingsLocal &&
            this.settingsLocal.columns &&
            this.settingsLocal.columns.map((item) =>
              item.apiAction ? 'apiAction_' + item.apiActionID : item.name
            )) ||
            []
        );
        const columns = new Set(r.columns || []);
        const apiActionsQuesLevel = new Set(
          (this.apiActionsQuesLevel &&
            this.apiActionsQuesLevel
              .filter(
                (aa) =>
                  aa.visualization_id === null ||
                  aa.visualization_id === this.visualizationID
              )
              .map((aa) => 'apiAction_' + aa.id)) ||
            []
        );

        const allNames = new Set();
        columns.forEach((item) => allNames.add(item));
        apiActionsQuesLevel.forEach((item) => allNames.add(item));

        if (
          eqSet(settingsColumns, allNames) &&
          [...settingsColumns].length > 0
        ) {
          let columnSettings = {};
          this.settingsLocal.columns.forEach((col, i) => {
            col['newOrder'] = i;
            columnSettings[
              col.apiAction ? 'apiAction_' + col.apiActionID : col.name
            ] = col;
          });
          this.columns = this.settingsLocal.columns
            .sort((a, b) => {
              return a.newOrder - b.newOrder;
            })
            .filter((item) => item.show)
            .map((item) => {
              return {
                type: item.apiAction ? 'apiAction' : 'column',
                name: item.name,
                displayName: item.displayName,
              };
            });
          rows = r.rows
            .slice(
              (this.pageNumber - 1) * this.pageSize,
              this.pageNumber * this.pageSize
            )
            .map((row, index) => {
              let newRow = [];
              row.forEach((el, i) => {
                columnSettings[r.columns[i]] &&
                  (newRow[columnSettings[r.columns[i]].newOrder] = {
                    type: 'column',
                    value: el,
                    formattingSettings:
                      columnSettings[r.columns[i]].formattingSettings,
                  });
              });
              this.settingsLocal.columns
                .filter((item) => item.apiAction)
                .forEach((item) => {
                  newRow[
                    columnSettings['apiAction_' + item.apiActionID].newOrder
                  ] = {
                    type: 'apiAction',
                    value: item.name,
                    details: item.details,
                    formattingSettings:
                      columnSettings['apiAction_' + item.apiActionID]
                        ?.formattingSettings,
                    vars: { cols: r.columns, row: r.rows[index] },
                  };
                });
              return newRow.filter(
                (el, i) =>
                  this.settingsLocal.columns.filter(
                    (col) => col.newOrder === i
                  )[0].show
              );
            });
        } else {
          let columnSettings = {};
          this.settingsLocal &&
            this.settingsLocal.columns.forEach((col, i) => {
              columnSettings[
                col.apiAction ? 'apiAction_' + col.apiActionID : col.name
              ] = col;
            });

          rows = r.rows
            .slice(
              (this.pageNumber - 1) * this.pageSize,
              this.pageNumber * this.pageSize
            )
            .map((row) => {
              return row.map((el, i) => {
                return {
                  type: 'column',
                  value: el,
                  formattingSettings:
                    columnSettings[r.columns[i]] &&
                    columnSettings[r.columns[i]].formattingSettings,
                };
              });
            });
          this.columns = _.cloneDeep(r.columns).map((col, i) => {
            return {
              name: col,
              type: 'column',
              displayName:
                columnSettings[r.columns[i]] &&
                columnSettings[r.columns[i]].displayName,
            };
          });
          this.apiActionsQuesLevel &&
            this.apiActionsQuesLevel
              .filter(
                (aa) =>
                  aa.visualization_id === null ||
                  aa.visualization_id === this.visualizationID
              )
              .forEach((apiAction) => {
                this.columns.push({ type: 'apiAction', name: apiAction.name });
                rows.forEach((row, index) => {
                  row.push({
                    type: 'apiAction',
                    value: apiAction.name,
                    details: apiAction,
                    formattingSettings:
                      columnSettings['apiAction_' + apiAction.id]
                        ?.formattingSettings,
                    vars: { cols: r.columns, row: r.rows[index] },
                  });
                });
              });
        }

        if (this.isTransposed) {
          this.rows = this.columns.map((item, colIndex) => [
            item,
            ...rows.map((row) => row[colIndex]),
          ]);
        } else {
          this.rows = rows;
        }

        this.lastPageNumber = +Math.ceil(r.rows.length / this.pageSize);
        this.displayPageNumberStart =
          this.pageNumber - 5 > 0 ? this.pageNumber - 5 : 1;
        if (this.pageNumber < 6) {
          this.displayPageNumberEnd =
            this.lastPageNumber > 10 ? 10 : this.lastPageNumber;
        } else {
          this.displayPageNumberEnd =
            this.pageNumber + 4 < this.lastPageNumber
              ? this.pageNumber + 4
              : this.lastPageNumber;
        }

        if (this.displayPageNumberEnd - this.displayPageNumberEnd < 9) {
          this.displayPageNumberStart = this.displayPageNumberEnd - 9;
        }
        if (this.displayPageNumberStart < 1) {
          this.displayPageNumberStart = 1;
        }

        this.totalPageNumbers =
          this.displayPageNumberEnd - this.displayPageNumberStart + 1;
      }
    },
  },

  mounted() {
    this.updateProps();
  },

  setup() {
    const pageSize = 10;
    const paginationButtonClass =
      'tw-border-2 tw-leading-4 tw-m-auto tw-border-primary hover:tw-bg-primary hover:tw-text-tertiary tw-mx-1 tw-py-2 tw-rounded-full';
    const paginationButtonDisabledClass =
      'tw-border-2 tw-leading-4 tw-m-auto tw-border-default/20 hover:tw-bg-default/20 tw-mx-1 tw-py-2 tw-text-default/50 tw-rounded-full';

    let arrowButtonsClass = paginationButtonClass + ' tw-text-primary tw-px-3';
    let arrowButtonsDisabledClass = paginationButtonDisabledClass + ' tw-px-3';

    let pageNumberButtonsClass =
      paginationButtonClass + ' tw-text-primary  tw-px-3';
    let pageNumberButtonsActiveClass =
      paginationButtonClass + ' tw-text-white tw-bg-primary tw-px-3';

    let pageNumber = 1;

    return {
      pageSize,
      paginationButtonClass,
      paginationButtonDisabledClass,
      arrowButtonsClass,
      arrowButtonsDisabledClass,
      pageNumberButtonsClass,
      pageNumberButtonsActiveClass,
      pageNumber,
    };
  },
};
</script>
