<template>
  <div class="tw-inline tw-cursor-pointer">
      <AGTDMenu :formattedValue="formattedValue" :value="value" :dataType="dataType" :column="column" :showFilters="showFilters" @addFilter="(filter) => $emit('addFilter', filter)" />
      {{ formattedValue }}
  </div>

</template>

<script>
import { findDataType } from 'src/helpers/dataTypes';
import { date } from 'quasar';
import AGTDMenu from 'components/dataRenderers/charts/td/menu.vue';
export default {
  name: 'AGTDRenderer',
  props: ['colDetails', 'columns', 'value', 'index', 'showFilters', 'isColumnObject' ],
  components: {AGTDMenu},
  computed: {
    column(){
      return (this.isColumnObject && this.columns[this.index].name) || this.columns[this.index]
    },
    dataType() {
      return findDataType(this.colDetails, this.column)
    },
    formattedValue() {
      if (this.dataType === 'datetime') {
        return this.formatDateTime(this.value)
      }
      if (this.value === null) {
        return 'NULL'
      }
      return this.value
    }
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
