<template>
  <BaseTable v-slot="{columns, rows}" :results="results" :showSettings="showSettings" :settings="settings"
          :questionID="questionID" :visualizationID="visualizationID"
  @settings="(val) => $emit('settings', val)">

    <table class="tw-text-default tw-w-full">
      <thead>
        <tr class="tw-text-left tw-px-4  tw-text">
          <th class="tw-px-4 tw-py-2 tw-text-auto tw-uppercase tw-font-semibold tw-border-b tw-text-sm tw-text-default" v-for="column in columns"
            :key="column">
            <div class="tw-inline" v-if="column.type === 'column'">
            {{ column.name }}
            </div>
            <div class="tw-inline" v-if="column.type === 'apiAction'">
            {{ column.name }}
            </div>
            </th>
        </tr>

      </thead>
      <tbody>
        <tr class="tw-py-2 even:tw-bg-secondary" v-for="row in rows" :key="row">
          <td class="tw-px-4 tw-py-2 tw-border-b" v-for="el in row" :key="el">
            <div class="tw-inline" v-if="el.type === 'column'">
            {{ el.value }}
            </div>
            <div class="tw-inline tw-uppercase"  v-if="el.type === 'apiAction'">
             <ApiActionLink :link="el" :queryKey="queryKey" />
            </div>
          </td>
        </tr>

      </tbody>

    </table>
  </BaseTable>
</template>

  <script>
  import BaseTable from 'components/dataRenderers/charts/baseTable.vue'
  import ApiActionLink from 'components/apiActions/link.vue'
  export default {
    name: 'AGTable',
  
    props: ['results', 'showSettings', 'settings', 'queryKey', 'visualizationID', 'questionID'],
    components: { BaseTable, ApiActionLink }
 
  }
  </script>

