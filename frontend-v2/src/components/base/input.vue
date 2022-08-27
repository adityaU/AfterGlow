<template>
  <div>
  <input :placeholder="placeholder" :class="invisible ? withOutBorderClass : withBorderClass" class="tw-px-2 tw-py-0.5" v-model="value" @keypress.down="$emit('keypress:down')" />

  </div>
</template>

<script>
export default {
  name: 'AGInput',
  props: {
    invisible: {default: false},
    placeholder: {default: "Enter a value"}
  },
  data() {
    return {
      value: "",
      withBorderClass: "tw-border tw-border-primary tw-rounded focus-visible:tw-border-2 focus-visible:tw-border-primary focus-visible:tw-outline-0",
      withOutBorderClass: "tw-border-0 focus-visible:tw-outline-0"
    }

  },

  watch: {
    value() {
      this.$emit('inputed', this.value);
    }
  }


}
</script>
