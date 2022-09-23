<template>
  <BaseTable :results="results" isTransposed=true :showSettings="showSettings" :settings="settings" @settings="(val) => $emit('settings', val)" v-slot={rows}>
  <table class="tw-text-default tw-w-full">
    <tbody>
      <tr class="tw-py-2 tw-border tw-border-default/20 " v-for="row in rows" :key="row">
        <td class=" tw-leading-10  tw-px-4 tw-border-b first:tw-border-r first:tw-uppercase first:tw-font-semibold"
          v-for="el in row" :key="el">
            <div class="tw-inline" v-if="el.type === 'column'">
            {{ el.value || el.name }}
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
export default {
  name: 'AGTransposedTable',
  props: ["results", "showSettings", "queryKey"],
  components: {BaseTable, ApiActionLink}
}
</script>
