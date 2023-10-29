<template>
  <span class="">
    <input
      :type="type"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :class="invisible ? 'input-no-border' : 'input-border'"
      class="!tw-px-4 !tw-py-2 tw-w-full tw-bg-white tw-rounded"
      v-model="valueLocal"
      @keypress.down="$emit('keypress:down')"
      :disabled="disabled"
      v-if="!textArea"
    />
    <textarea
      :type="type"
      :min="min"
      :max="max"
      :rows="rows"
      :placeholder="placeholder"
      :class="invisible ? 'input-no-border' : 'input-border'"
      class="!tw-px-4 !tw-py-2 tw-w-full tw-bg-white tw-rounded-sm"
      v-model="valueLocal"
      @keypress.down="$emit('keypress:down')"
      v-if="textArea"
      :disabled="disabled"
    />
  </span>
</template>

<script>
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
export default {
  name: 'BaseInput',
  props: {
    value: {},
    invisible: { default: false },
    placeholder: { default: 'Enter a value' },
    textArea: { default: false },
    rows: { default: 5 },
    type: { default: 'text' },
    max: { default: Infinity },
    min: { default: -Infinity },
    debounce: { default: null },
    disabled: { default: false },
  },
  data() {
    return {
      valueLocal: this.value || this.value === 0 ? this.value : null,
    };
  },

  watch: {
    value() {
      if (!isEqual(this.value, this.valueLocal)) {
        this.valueLocal = this.value;
      }
    },
    valueLocal() {
      if (!isEqual(this.value, this.valueLocal)) {
        if (!this.debounce) {
          this.$emit('inputed', this.valueLocal);
          this.$emit('update:value', this.valueLocal);
          return;
        }

        debounce(() => {
          this.$emit('inputed', this.valueLocal);
          this.$emit('update:value', this.valueLocal);
        }, this.debounce)();
      }
    },
  },
};
</script>
