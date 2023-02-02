<template>
  <td class="tw-h-[inherit]" :class="cursor == 'normal' ? '' : 'tw-cursor-pointer'">
      <AGTDMenu :formattedValue="formattedValue" :value="value" :dataType="dataType" :column="column" :showFilters="showFilters" @addFilter="(filter) => $emit('addFilter', filter)"  v-if="!noMenu" />
      <AGConditionalRenderer :displayName="displayName" :conditions="formattingSettings" :dataType="dataType" :value="value" :parentStyle="parentStyle" @update:parentStyle="(val) => $emit('update:parentStyle', val)" />

     <!-- <template v-if="!formattingSettings" > -->
     <!--  {{formattedValue}} -->
     <!-- </template> -->
  </td>

</template>

<script>
import { findDataType } from 'src/helpers/dataTypes';
import { date } from 'quasar';
import AGTDMenu from 'components/dataRenderers/charts/td/menu.vue';
import AGConditionalRenderer from 'components/widgets/tableWidgets/conditional/widget.vue'
export default {
  name: 'AGTDRenderer',
  props: ['colDetails', 'columns', 'value', 'index', 'showFilters', 'isColumnObject', 'formattingSettings', 'cursor', 'noMenu', 'parentStyle' ],
  components: {AGTDMenu, AGConditionalRenderer},
  computed: {
    column(){
      return (this.isColumnObject && this.columns[this.index].name) || this.columns[this.index]
    },
    displayName(){ 
      return (this.isColumnObject && (this.columns[this.index].displayName || this.columns[this.index].name)) || this.columns[this.index]
    },
    dataType() {
      return findDataType(this.colDetails, this.column)
    },
  },
  methods: {
    formatDateTime(value) {
      if (value === null) {
        return 'NULL'
      }
      return date.formatDate(new Date(this.value), 'MMM DD, YYYY hh:mm:ss A')
    },
  }
}
</script>
