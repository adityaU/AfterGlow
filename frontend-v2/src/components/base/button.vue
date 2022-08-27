<template>
  <button class="tw-w-full tw-text-center tw-rounded tw-py-1 tw-border" :class=[hoverClass]
    :style="{ 'border-color': borderColor, 'color': textColor, 'background-color': backgroundColor }" @click="handleClick">{{ label
    }}</button>
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
  },

  data() {
    return {
      hoverClass: "hover:tw-bg-[" + this.borderColor + "]"
    }
  }
}
</script>
