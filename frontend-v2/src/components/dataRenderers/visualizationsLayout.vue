<template>
  <div class="tw-bg-white tw-shadow-sm tw-border tw-rounded-sm tw-border-b-2 tw-border-b-primary">

    <a href="#">
      <div class="group tw-p-2 tw-font-semibold tw-inline-flex" v-for="viz, index in visualizationsLocal" :key="viz"
        :class="viz.current ? 'tw-bg-primary tw-text-white hover:tw-bg-primary/80 tw-outline-primary tw-outline hover:tw-outline-primary/80' : 'tw-border-r'"
        @click="setCurrentViz(viz)">
        <component :is="icon(viz.rendererType).icon" class="tw-inline-flex tw-my-auto"
          :class="icon(viz.rendererType).isIconRotated ? 'tw-rotate-90' : ''" size=14 />
        <span class="tw-ml-2 tw-capitalize" v-if="!viz.edit">{{ viz.name }}</span>
        <span class="tw-ml-2 tw-capitalize tw-my-auto hover:tw-text-primary  group-hover:tw-visible" v-if="!viz.edit"
          @click='(viz.edit = true) && focusInput(index)'>
          <EditIcon size=10 />
        </span>
        <span class="tw-ml-2 tw-capitalize tw-my-auto hover:tw-text-primary  group-hover:tw-visible" v-if="!viz.edit"
          @click="$emit('deleteViz', index)">
          <XIcon size=10 />
        </span>

        <span class="tw-ml-2" v-if="viz.edit">
          <BaseInput invisible=true :value="viz.name" @inputed="(val) => viz.name = val" @keyup.enter="viz.edit = false"
            :ref="'input_' + index" class="tw-bg-transparent" placeholder="A Meaningful name" />
        </span>
        <span class="tw-ml-2 tw-capitalize tw-my-auto hover:tw-text-primary" v-if="viz.edit" @click='viz.edit = false'>
          <CheckIcon size=10 />
        </span>
      </div>
    </a>
    <a href="#" @click="addNewViz">
      <div class="tw-p-2 tw-font-semibold tw-text-primary tw-inline-flex">
        <PlusIcon class="tw-inline tw-my-auto" size=14 />
        <span class="tw-ml-2">New visualization</span>
      </div>
    </a>
  </div>
</template>

<script>
import { _ } from 'lodash'
import { rendererTypeIcons } from 'src/helpers/rendererConfig'

import { PlusIcon, EditIcon, CheckIcon, XIcon } from 'vue-tabler-icons'
import BaseInput from 'components/base/input.vue'
export default {
  name: 'VisualizationLayout',

  props: ['visualizations'],

  components: { PlusIcon, EditIcon, CheckIcon, BaseInput, XIcon },

  watch: {
    visualizations: {
      deep: true,
      handler() {
        if (this.visualizations.towardsVizLayout) {
          this.visualizationsLocal = this.visualizations.details
        }
      }
    },

    visualizationsLocal: {
      deep: true,
      handler() {
        console.log("I was triggered")
        this.$emit('update:visualizations', { towardsVizLayout: false, details: this.visualizationsLocal })
      }
    }
  },

  data() {
    const vizLocal = _.cloneDeep(this.visualizations.details)
    return {
      visualizationsLocal: vizLocal,
    }
  },

  methods: {
    icon(rendererType) {
      return rendererTypeIcons[rendererType] || rendererTypeIcons['table']
    },
    addNewViz() {
      this.visualizationsLocal.push({ rendererType: 'table', name: "Visualization " + (this.visualizationsLocal.length + 1) })
    },
    focusInput(index) {
      setTimeout(() => {
        this.$refs['input_' + index][0].$el.focus()
      }, 500)

    },
    setCurrentViz(viz) {
      this.visualizationsLocal.forEach((viz) => viz.current = false)
      viz.current = true
      this.$emit('fetchVizResults', viz)
    }
  }

}
</script>
