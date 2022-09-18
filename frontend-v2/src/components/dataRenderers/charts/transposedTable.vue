<template>
  <BaseTable :results="results" isTransposed=true :showSettings="showSettings" :settings="settings" @settings="(val) => $emit('settings', val)" v-slot={rows}>
  <table class="tw-text-default tw-w-full">
    <tbody>
      <tr class="tw-py-2 tw-border tw-border-default/20 " v-for="row in rows" :key="row">
        <td class=" tw-leading-10  tw-px-4 tw-border-b first:tw-border-r first:tw-uppercase first:tw-font-semibold"
          v-for="el in row" :key="el">{{ el }}</td>
      </tr>

    </tbody>

  </table>

  </BaseTable>
</template>

<script>
import BaseTable from './baseTable.vue';
export default {
  name: 'AGTransposedTable',
  props: ["results", "showSettings"],
  components: {BaseTable}
}
</script>
