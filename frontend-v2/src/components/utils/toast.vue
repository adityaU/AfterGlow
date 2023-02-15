<template>
  <teleport to="body">
    <div class="tw-flex tw-basis-8 tw-absolute tw-top-2 tw-right-2 ag-card tw-p-3 tw-max-w-[400px]" v-if="show"
      :class="'tw-border-l-4 ' + borderClass">
      <div class="tw-border-l-red-600 tw-border-l-green-600 tw-border-l-yellow-600 tw-hidden"></div>
      <div class="col">
        <slot />
      </div>
      <div class="tw-absolute tw-float-right tw-top-1 tw-right-1 tw-cursor-pointer">
        <XIcon @click="$emit('update:show', false)" size="14" />
      </div>
    </div>
  </teleport>

</template>

<script>
const borderClasses = {
  critical: 'tw-border-l-red-600',
  warning: 'tw-border-l-yellow-600',
  ok: 'tw-border-l-green-600'
}
import { XIcon } from 'vue-tabler-icons';
export default {
  name: "AGToast",
  props: ['show', 'type'],
  components: { XIcon },
  watch: {
    type(){
      this.borderClass = borderClasses[this.type]
    }
  },
  data() {
    return {
      borderClass: borderClasses[this.type]
    }
  },

  watch: {
    show() {
      if (this.show) {
        setTimeout(() => {
          this.$emit('update:show', false)
        }, 5000)
      }
    }
  }
}
</script>
