<template>
  <div>
    <AGSelect canNotDeselect="true" v-model:selected="dataFormat"
      :options="numericFormats" areOptionsObject="true" description="Select a Format" v-if="dataType === 'number'" hideSearch="true" />
    <AGSelect canNotDeselect="true" v-model:selected="dataFormat" :options="dateTimeFormats" areOptionsObject="true" description="Select a Format" v-if="dataType === 'datetime'" hideSearch="true" />
  </div>
</template>

<script>
import AGSelect from 'components/base/select.vue'

import {numericFormats} from "src/helpers/numeralFormatting";
import {dateTimeFormats } from 'src/helpers/datetimeFormatting'
export default {
  name: "AGDataTypeFormat",
  components: {AGSelect},
  props: ['format', 'dataType'],
  watch: {
    dataFormat(){
      this.$emit('update:format', this.dataFormat)
    }
  },
  data(){
    return {
      numericFormats: numericFormats,
      dateTimeFormats: dateTimeFormats,
      dataFormat: this.dataFormat || null
    }
  }
}
</script>
