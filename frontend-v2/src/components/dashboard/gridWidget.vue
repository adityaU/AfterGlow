<template>
  <div class="grid-stack-item " v-bind="gridStackAttributes">
    <div class="grid-stack-item-content tw-w-full tw-rounded-sm tw-shadow-sm">
      <component :is="compDefs[type]" :id="widID" @update:id="(val) => $emit('update:widID', val)"
      :widgetID='id' :queryKey="queryKey" :editMode="editMode" :size="widSize"
      class="tw-w-full" @removeWidget="(widgetID) => $emit('widgetDeleted', widgetID)"
      v-model:showRemoveFromDashboardModal="showRemoveFromDashboardModal"
      />
      <RemoveFromDashboard v-model:open="showRemoveFromDashboardModal" :type="type" :widgetID="id" @removeWidget="(widgetID) => $emit('widgetDeleted', widgetID)" />
    </div>
  </div>
</template>

<script>

import AGQues from 'components/widgets/question.vue';
import AGNote from 'components/widgets/note.vue';
import AGViz from 'components/widgets/visualization.vue'
import {ArrowsMoveIcon} from 'vue-tabler-icons';

import RemoveFromDashboard from 'components/dashboard/removeFromDashboard.vue';

import { _ } from 'lodash'

const newCompDefs = {
  'notes': AGNote,
  'note': AGNote,
  'question': AGQues,
  'visualization': AGViz
}



export default {
  name: 'AGGridWidget',
  props: ['x', 'y', 'w', 'h', 'id', 'type', 'widID', 'queryKey', 'editMode', 'widSize'],

  components: {ArrowsMoveIcon, RemoveFromDashboard},

  data() {
    return {
      compDefs: _.cloneDeep(newCompDefs),
      showRemoveFromDashboardModal: false,
      gridStackAttributes: {
        id: this.id,
        "gs-id": this.id,
        "gs-x": this.x,
        "gs-y": this.y,
        "gs-w": this.w,
        "gs-h": this.h
      }
    }
  },
}
</script>
<style scoped>
@tailwind base;

@layer base {
  .grid-stack-item-content {
    @apply tw-flex tw-shadow-sm tw-bg-white tw-border;
    @apply tw-overflow-hidden !important;
  }
}
</style>
