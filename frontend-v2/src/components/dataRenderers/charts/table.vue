<template>
  <BaseTable v-slot="{columns, rows}" :results="results" :showSettings="showSettings" :settings="settings" @settings="(val) => $emit('settings', val)">

    <table class="tw-text-default tw-w-full">
      <thead>
        <tr class="tw-text-left tw-px-4  tw-text">
          <th class="tw-px-4 tw-py-2 tw-text-auto tw-uppercase tw-font-semibold tw-border-b tw-text-sm tw-text-default" v-for="column in columns"
            :key="column">{{ column }}</th>
        </tr>

      </thead>
      <tbody>
        <tr class="tw-py-2 even:tw-bg-secondary" v-for="row in rows" :key="row">
          <td class="tw-px-4 tw-py-2 tw-border-b" v-for="el in row" :key="el">{{ el }}</td>
        </tr>

      </tbody>

    </table>
  </BaseTable>
</template>

  <script>
  import BaseTable from 'components/dataRenderers/charts/baseTable.vue'
  export default {
    name: 'AGTable',
  
    props: ['results', 'showSettings', 'settings'],
    components: { BaseTable }
  
  }
  </script>

