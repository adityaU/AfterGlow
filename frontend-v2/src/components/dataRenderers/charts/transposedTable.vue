<template>
  <BaseTable :results="results" isTransposed=true :showSettings="showSettings" :settings="settings" @settings="(val) => $emit('settings', val)" v-slot="{rows, columns}">
  <table class="tw-text-default tw-w-full">
    <tbody>
      <tr class="tw-py-2 tw-border tw-border-default/20 " v-for="row, index in rows" :key="row">
        <td class=" tw-leading-10  tw-px-4 tw-border-b first:tw-border-r first:tw-uppercase first:tw-font-semibold"
          v-for="el, i in row" :key="el">
            <div class="tw-inline" v-if="el.type === 'column'">

            <AGTDRenderer :colDetails="colDetails" isColumnObject=true :value="el.value" :columns="columns" :index="index" :showFilters="!onDashboard && !results.additional_filters_applied" @addFilter="(filter) => $emit('addFilter', filter)" v-if="i !=0"/>
            <AGTHMenu :column="el.name" :showSorting="!onDashboard && !results.additional_filters_applied" @addSorting="(sorting) => $emit('addSorting', sorting)" v-if="i === 0"/>
            {{i == 0 ? el.name : ''}}
            </div>
            <div class="tw-inline" v-if="el.type === 'apiAction'"> 
             <ApiActionLink :link="el" :queryKey="queryKey" v-if="!el.name" />
             {{el.name}}
            </div>
          </td>
      </tr>

    </tbody>

  </table>

  </BaseTable>
</template>

<script>
import BaseTable from './baseTable.vue';
import ApiActionLink from 'components/apiActions/link.vue'
import AGTDRenderer from 'components/dataRenderers/charts/td/renderer.vue'
import AGTHMenu from 'components/dataRenderers/charts/th/menu.vue'
export default {
  name: 'AGTransposedTable',
  props: ["results", "showSettings", "queryKey", "colDetails", "onDashboard"],
  components: {BaseTable, ApiActionLink, AGTDRenderer, AGTHMenu}
}
</script>
