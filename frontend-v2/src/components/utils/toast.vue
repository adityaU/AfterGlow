<template>
  <!-- <teleport to="body"> -->
  <div class="tw-flex tw-basis-8 tw-fixed tw-top-2 tw-right-2 ag-card tw-max-w-[400px]" v-if="show">
    <div class="tw-bg-green-700 tw-flex tw-items-center tw-text-white tw-px-4 tw-rounded-l-lg" v-if="type == 'ok'">
      <ChecksIcon size="48" />
    </div>
    <div class="tw-bg-orange-400 tw-flex tw-items-center tw-text-white tw-px-4 tw-rounded-l-lg" v-if="type == 'warning'">
      <AlertCircleFilledIcon size="48" />
    </div>
    <div class="tw-bg-red-700 tw-flex tw-items-center tw-text-white tw-px-4 tw-rounded-l-lg" v-if="type == 'critical'">
      <AlertCircleFilledIcon size="48" />
    </div>
    <div class="tw-border-l-red-600 tw-border-l-green-600 tw-border-l-yellow-600 tw-hidden"></div>
    <div class="col tw-p-3 tw-pr-6">
      <slot />
    </div>
    <div class="tw-absolute tw-float-right tw-top-1 tw-right-1 tw-cursor-pointer">
      <XIcon @click="$emit('update:show', false)" size="24" />
    </div>
  </div>
  <!-- </teleport> -->
</template>

<script>
const borderClasses = {
  critical: 'tw-border-l-red-600',
  warning: 'tw-border-l-yellow-600',
  ok: 'tw-border-l-green-600',
};
import { XIcon, AlertCircleFilledIcon, ChecksIcon } from 'vue-tabler-icons';
export default {
  name: 'AGToast',
  props: ['show', 'type'],
  components: { XIcon, ChecksIcon, AlertCircleFilledIcon },
  data() {
    return {
      borderClass: borderClasses[this.type],
    };
  },

  watch: {
    show() {
      if (this.show) {
        setTimeout(() => {
          this.$emit('update:show', false);
        }, 15000);
      }
    },
  },
};
</script>
