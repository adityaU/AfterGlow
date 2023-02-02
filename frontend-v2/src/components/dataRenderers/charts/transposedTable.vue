<template>
  <BaseTable :results="results" isTransposed=true :showSettings="showSettings" :settings="settings" @settings="(val) => $emit('settings', val)" v-slot="{rows, columns}">
    <table class="tw-text-default tw-w-full">
      <tbody>
        <tr class="tw-border tw-border-default/20 tw-h-[1px] " v-for="row, index in rows" :key="row">
          <template 
            v-for="el, i in row" :key="el">
            <template  v-if="el.type === 'column'">

              <AGTDRenderer :colDetails="colDetails"  
                isColumnObject=true :value="el.value" :columns="columns" 
                :index="index" :showFilters="!onDashboard && !results.additional_filters_applied"
                :formattingSettings="el.formattingSettings"
                @addFilter="(filter) => $emit('addFilter', filter)" v-if="i !=0"/>
              <AGTHMenu  :column="el.name" :showSorting="!onDashboard && !results.additional_filters_applied" @addSorting="(sorting) => $emit('addSorting', sorting)" v-if="i === 0"/>
              <td class="tw-px-4 tw-py-2 " v-if="i === 0">
                <div class="tw-h-full tw-items-center tw-flex tw-font-semibold tw-uppercase tw-h-inherit">
                  {{i == 0 ? el.displayName || el.name : ''}}
                </div>
              </td>
            </template>
            <td class="tw-px-4 tw-py-2" v-if="el.type === 'apiAction'"> 
              <ApiActionLink :link="el" :queryKey="queryKey" :settings="settings && settings.columns" :colDetails="colDetails" v-if="!el.name" />
              <div class="tw-h-full tw-items-center tw-flex tw-font-semibold tw-uppercase tw-h-inherit">
                {{el.name}}
              </div>
            </td>
          </template>
        </tr>

      </tbody>

    </table>

  </BaseTable>
</template>

<script>
import BaseTable from './baseTable.vue';
import ApiActionLink from 'components/apiActions/linkWithFormModal.vue'
import AGTDRenderer from 'components/dataRenderers/charts/td/renderer.vue'
import AGTHMenu from 'components/dataRenderers/charts/th/menu.vue'
export default {
  name: 'AGTransposedTable',
  props: ["results", "showSettings", "queryKey", "colDetails", "onDashboard", "settings"],
  components: {BaseTable, ApiActionLink, AGTDRenderer, AGTHMenu}
}
</script>
