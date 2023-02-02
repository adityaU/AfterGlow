<template>
  <div class="grid-stack-item" :class="isEditing ? '!tw-border-2 !tw-border-primary' : ''" v-bind="gridStackAttributes">
    <div class="grid-stack-item-content tw-w-full tw-rounded-sm tw-shadow-sm" :style="widgetContainerStyle">
      <component :is="compDefs[type]" :id="widID" @update:id="(val) => $emit('update:widID', val)"
        :widgetID='id' :queryKey="queryKey" :editMode="editMode" :size="size"
        class="tw-w-full" @removeWidget="(widgetID) => $emit('widgetDeleted', widgetID)"
        v-model:showRemoveFromDashboardModal="showRemoveFromDashboardModal"
        :headerStyle="headerStyle"
        :containerStyle="widgetContainerStyle"
        :showHeader="showHeader"
        v-bind="additionalParams"
      >
        <slot />
      </component>
      <RemoveFromDashboard v-model:open="showRemoveFromDashboardModal" :type="type" :widgetID="id" @removeWidget="(widgetID) => $emit('widgetDeleted', widgetID)" />
    </div>
  </div>
</template>

<script>

import AGQues from 'components/widgets/question.vue';
import AGNote from 'components/widgets/note.vue';
import AGViz from 'components/widgets/visualization.vue';
import AGVariablePane from 'components/widgets/variablePane.vue'; 
import {ArrowsMoveIcon} from 'vue-tabler-icons';

import RemoveFromDashboard from 'components/dashboard/removeFromDashboard.vue';

import { _ } from 'lodash'

const newCompDefs = {
  'notes': AGNote,
  'note': AGNote,
  'question': AGQues,
  'visualization': AGViz,
  'variablePane' : AGVariablePane
}

const containerShadows = {
  'none': 'none',
  'small': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'medium': '0 4px 6px -1px rgb(0 0 0 / 0.05)',
  'large': '0 10px 15px -3px rgb(0 0 0 / 0.05)',
  'extra-large': '0 20px 25px -5px rgb(0 0 0 / 0.05)',
}


export default {
  name: 'AGGridWidget',
  props: ['x', 'y', 'w', 'h', 'id', 'type', 'widID', 'queryKey', 'editMode', 'widSize', 'gridSize', 'formattingSettings', 'isEditing', 'additionalParams'],

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

  computed: {
    size(){
      return (this.widSize || 0) + this.gridSize
    },
    showHeader(){
      return this.formattingSettings ? this.formattingSettings.showHeader : true
    },

    headerStyle(){
      if (!this.formattingSettings) { return {}}
      const fs = this.formattingSettings
      let style = {}
      style['background-color'] = fs.headerBackgroundColor ? fs.headerBackgroundColor : 'white'
      style['color'] = fs.headerTextColor ? fs.headerTextColor : '#6e7687'
      return style
    },

    widgetContainerStyle(){
      if (!this.formattingSettings) { return {}}
      const fs = this.formattingSettings
      let style = {}
      style["background-color"] = fs.backgroundColor ? fs.backgroundColor : 'white'
      if (fs.borderPosition && fs.borderPosition.indexOf('left') >= 0){
        style['border-left'] = `${fs.borderThickness || 0}px solid ${fs.borderColor || 'transparent'}` 
      }
      if (fs.borderPosition && fs.borderPosition.indexOf('right') >= 0){
        style['border-right'] = `${fs.borderThickness || 0}px solid ${fs.borderColor || 'transparent'}` 
      }
      if (fs.borderPosition && fs.borderPosition.indexOf('top') >= 0){
        style['border-top'] = `${fs.borderThickness || 0}px solid ${fs.borderColor || 'transparent'}` 
      }
      if (fs.borderPosition && fs.borderPosition.indexOf('bottom') >= 0){
        style['border-bottom'] = `${fs.borderThickness || 0}px solid ${fs.borderColor || 'transparent'}` 
      }
      style['border-radius'] = fs.borderRadius ? fs.borderRadius + 'rem' :  '0.125rem'
      style['inset'] = (fs.hasOwnProperty('gapAround') ? fs.gapAround + 'rem' :  '0.125rem') + " !important"
      style['box-shadow'] = containerShadows[fs.boxShadow || 'none']
      return style
    },

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
