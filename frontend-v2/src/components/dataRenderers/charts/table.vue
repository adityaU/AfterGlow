<template>
  <BaseTable
    v-slot="{ columns, rows }"
    :results="results"
    :showSettings="showSettings"
    :settings="settings"
    :questionID="questionID"
    :visualizationID="visualizationID"
    @settings="(val) => $emit('settings', val)"
  >
    <table class="tw-text-default tw-w-full" cellpadding="0" cellspacing="0">
      <thead>
        <tr class="tw-text-left tw-px-4 tw-text">
          <th
            class="tw-px-4 tw-py-2 tw-text-auto tw-uppercase tw-font-semibold tw-border-b tw-text-sm tw-text-default"
            v-for="column in columns"
            :key="column"
          >
            <div class="tw-inline" v-if="column.type === 'column'">
              {{ column.displayName || column.name }}
              <AGTHMenu
                :column="column.name"
                :showSorting="
                  !onDashboard && !results.additional_filters_applied
                "
                @addSorting="(sorting) => $emit('addSorting', sorting)"
              />
            </div>
            <div class="tw-inline" v-if="column.type === 'apiAction'">
              {{ column.displayName || column.name }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="tw-border-b even:tw-bg-secondary tw-h-[1px] parent-container"
          :style="parentStyle"
          v-for="row in rows"
          :key="row"
        >
          <template v-for="(el, index) in row" :key="el">
            <template v-if="el.type === 'column'">
              <AGTDRenderer
                :colDetails="colDetails"
                isColumnObject="true"
                :value="el.value"
                :columns="columns"
                :index="index"
                :showFilters="
                  !hideFilters &&
                  !onDashboard &&
                  !results.additional_filters_applied
                "
                :formattingSettings="el.formattingSettings"
                v-model:parentStyle="parentStyle"
                @addFilter="(filter) => $emit('addFilter', filter)"
              />
            </template>
            <td class="" v-if="el.type === 'apiAction'">
              <ApiActionLink
                :link="el"
                :queryKey="queryKey"
                :settings="settings && settings.columns"
                :colDetails="colDetails"
                :queryVariables="variables"
              />
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </BaseTable>
</template>

<script>
import BaseTable from 'components/dataRenderers/charts/baseTable.vue';
import ApiActionLink from 'components/apiActions/linkWithFormModal.vue';
import AGTDRenderer from 'components/dataRenderers/charts/td/renderer.vue';
import AGTHMenu from 'components/dataRenderers/charts/th/menu.vue';
export default {
  name: 'AGTable',

  props: [
    'results',
    'showSettings',
    'settings',
    'queryKey',
    'visualizationID',
    'questionID',
    'colDetails',
    'onDashboard',
    'hideFilters',
    'variables',
  ],
  components: { BaseTable, ApiActionLink, AGTDRenderer, AGTHMenu },
  data() {
    return {
      parentStyle: null,
    };
  },
};
</script>
<style scoped>
.parent-container:has(.data-container) {
  background: var(--parent-background-color);
}
</style>
