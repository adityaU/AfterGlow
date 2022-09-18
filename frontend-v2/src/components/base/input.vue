<template>
  <input :placeholder="placeholder" :class="invisible ? 'input-no-border' : 'input-border'" class="tw-px-2 tw-py-0.5 tw-w-full" v-model="valueLocal" @keypress.down="$emit('keypress:down')" />
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    value: {},
    invisible: {default: false},
    placeholder: {default: "Enter a value"}
  },
  data() {
    return {
      valueLocal: this.value,
    }

  },

  watch: {
    valueLocal() {
      this.$emit('inputed', this.valueLocal);
    }
  }


}
</script>
