<template>
  <div class="tw-w-full tw-border tw-px-4 tw-py-2 tw-cursor-pointer">
    {{ displayTextLocal }}
    <div class="tw-text-default/40" v-if="!displayTextLocal"> Select Date & Time </div>
    <q-menu flat="true" transition-show="scale" transition-hide="scale" max-height="400px" :offset="[0, 5]"
      class="tw-rounded-2xl tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
      <AGDatePicker :value="valueLocal" @update:value="updateValueLocal" v-model:displayText="displayTextLocal"
        :type="type" :clearCount="clearCount" />
    </q-menu>
  </div>
</template>

<script>
import AGDatePicker from 'components/base/datePicker.vue';
import { formatDatetime } from 'src/helpers/datetimeFormatting';
export default {
  name: 'AGDatePickerInput',
  props: ['value', 'type', 'clearCount', 'displayText'],
  components: { AGDatePicker },
  watch: {
    value() {
      if (this.value != this.valueLocal) {
        this.valueLocal = this.value;
        this.displayTextLocal = this.makeDisplayText(this.displayText);
      }
    },

    valueLocal: {
      deep: true,
      handler() {
        this.$emit('update:value', this.valueLocal);
        this.displayTextLocal = this.makeDisplayText(this.displayText);
      }
    },
    displayText() {
      this.displayTextLocal = this.makeDisplayText(this.displayText);
    },
    clearCount() {
      this.valueLocal = "Empty";
      this.displayTextLocal = "Empty"
      this.displayTextLocal = this.makeDisplayText("Empty")
    },
  },
  data() {
    return {
      valueLocal: this.value,
      displayTextLocal: this.makeDisplayText(this.displayText),
    };
  },
  methods: {
    updateValueLocal(value) {
      this.valueLocal = value;
      this.$emit('update:value', this.valueLocal);
    },
    makeDisplayText(text) {
      if (text === "Empty") {
        return "Empty";
      }
      // if (!this.value) {
      this.valueLocal = text;
      this.$emit('update:value', this.valueLocal);
      // }
      if (this.type === 'datetime') {
        return formatDatetime(this.valueLocal, 'MMM DD, YYYY hh:mm A Z');
      } else if (this.type === 'date') {
        return formatDatetime(this.valueLocal, 'MMM DD, YYYY');
      } else {
        return formatDatetime(this.valueLocal, 'MMM DD, YYYY hh:mm A Z');
      }

    },
  },
};
</script>
