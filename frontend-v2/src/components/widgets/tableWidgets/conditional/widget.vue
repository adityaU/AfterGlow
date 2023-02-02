<template>
      <AGTableCellFormatter :parentStyle="parentStyle" @update:parentStyle="(val) => $emit('update:parentStyle', val)" :formattingSettings="matchingCondition" :dataType="dataType" :value="value" :displayName="displayName" />
</template>

<script>
import AGTableCellFormatter from 'components/widgets/tableWidgets/dataFormatting/widget.vue'
import {extractFormattingSetting} from 'src/helpers/conditionMatching'
export default {
  name: "AGConditionalRenderer",
  props: ['conditions', 'value', 'dataType', 'displayName', 'parentStyle'],
  components: {AGTableCellFormatter},

  computed: {
    matchingCondition(){
      return extractFormattingSetting(this.conditions, this.value)
    }
  },

}
</script>
