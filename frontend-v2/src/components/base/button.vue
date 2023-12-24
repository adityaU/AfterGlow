<template>
  <button
    class="tw-text-center tw-border tw-font-semibold tw-from-indigo-400 tw-rounded-full tw-px-4 tw-py-2"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
import { defaultColors } from '../../helpers/saneDefaults.ts';
export default {
  name: 'AGButton',
  props: {
    label: { default: 'click me' },
    backgroundColor: { default: defaultColors.tertiary },
    textColor: { default: defaultColors.primary },
    borderColor: { default: defaultColors.primary },
  },
  methods: {
    handleClick() {
      this.$emit('clicked');
    },
  },
};
</script>
