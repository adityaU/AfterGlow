<template>
  <div class="grid-stack-item" v-bind="gridStackAttributes">
    <div class="grid-stack-item-content tw-w-full tw-rounded-sm">
      <slot />
    </div>
  </div>
</template>

<script>
import { _ } from 'lodash';

export default {
  name: 'AGCustomListGridWidget',
  props: [
    'x',
    'y',
    'w',
    'h',
    'id',
    'type',
    'widID',
    'queryKey',
    'editMode',
    'widSize',
    'gridSize',
  ],

  components: {},

  data() {
    return {
      gridStackAttributes: {
        id: this.id,
        'gs-id': this.id,
        'gs-x': this.x,
        'gs-y': this.y,
        'gs-w': this.w,
        'gs-h': this.h,
      },
    };
  },
};
</script>
<style scoped>
@tailwind base;

@layer base {
  .grid-stack-item-content {
    @apply tw-flex tw-border;
    @apply tw-overflow-hidden !important;
  }
}
</style>
