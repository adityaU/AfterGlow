<template>
  <button class="tw-text-center tw-rounded-sm tw-px-2 tw-py-1 tw-border" @click="handleClick">
  <slot />
  </button>
</template>

<script>
import { defaultColors } from "../../helpers/saneDefaults.ts";
export default {
  name: "AGButton",
  props: {
    label: { default: "click me" },
    backgroundColor: { default: defaultColors.tertiary },
    textColor: { default: defaultColors.primary },
    borderColor: { default: defaultColors.primary }
  },
  methods: {
    handleClick() {
      this.$emit('clicked')
    }
  }

}
</script>
