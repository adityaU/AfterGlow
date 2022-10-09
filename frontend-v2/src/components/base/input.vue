<template>
  <span class="">
    <input :type="type" :placeholder="placeholder" :class="invisible ? 'input-no-border' : 'input-border'"
      class="tw-px-2 tw-py-0.5 tw-w-full tw-bg-inherit" v-model="valueLocal" @keypress.down="$emit('keypress:down')"
      v-if="!textArea" />
    <textarea :type="type" :rows="rows" :placeholder="placeholder"
      :class="invisible ? 'input-no-border' : 'input-border'" class="tw-px-2 tw-py-0.5 tw-w-full" v-model="valueLocal"
      @keypress.down="$emit('keypress:down')" v-if="textArea" />
  </span>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    value: {},
    invisible: { default: false },
    placeholder: { default: "Enter a value" },
    textArea: { default: false },
    rows: { default: 5 },
    type: { default: "text" }
  },
  data() {
    return {
      valueLocal: this.value || null,
    }

  },

  watch: {
    valueLocal() {
      this.$emit('inputed', this.valueLocal);
      this.$emit('update:value', this.valueLocal);
    }
  }


}
</script>
