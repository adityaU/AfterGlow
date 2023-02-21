<template>
  <div class="tw-w-full tw-border tw-px-2 tw-py-1 tw-cursor-pointer">
    {{ displayText }}
    <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]"
      class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
      <AGDatePicker v-model:value="valueLocal" v-model:displayText="displayText" :type="type"
        :clearCount="clearCount" />
    </q-menu>
  </div>

</template>

<script>
import AGDatePicker from 'components/base/datePicker.vue'
import { formatDatetime } from 'src/helpers/datetimeFormatting'
export default {
  name: "AGDatePickerInput",
  props: ['value', 'type', 'clearCount'],
  components: { AGDatePicker },
  watch: {
    value() {
      if (this.value != this.valueLocal) {
        this.valueLocal = this.value
        this.displayText = this.makeDisplayText()
      }
    },
    valueLocal() {
      this.$emit('update:value', this.valueLocal)
    },
    clearCount() {
      this.valueLocal = null
      this.displayText = this.makeDisplayText()
    }
  },
  data() {
    return {
      valueLocal: this.value,
      displayText: this.makeDisplayText(),
    }
  },
  methods: {
    makeDisplayText() {
      if (!this.value) { return 'Empty' }
      if (this.type === 'datetime') {
        return formatDatetime(this.value, "MMM DD, YYYY hh:mm A Z")
      }
      else if (this.type === 'date') {
        return formatDatetime(this.value, 'MMM DD, YYYY')
      }
      else {
        return formatDatetime(this.value, "MMM DD, YYYY hh:mm A Z")
      }

    }

  }


}
</script>
