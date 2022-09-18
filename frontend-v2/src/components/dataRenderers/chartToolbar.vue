<template>
  <div class="tw-py-3 tw-px-3 tw-border-b tw-bg-white">

  <div class="tw-text-sm tw-font-semibold tw-mb-1">Select a Visualisation</div>
    <div class="tw-inline tw-pr-2 tw-pb-2">
      <a href="#" :class="[rendererType === rt ? iconActiveClass : iconClass]"
        v-for="[rt, obj] in Object.entries(rendererTypeIcons)" :key="rt" @click="emitSetRendererType(rt)">
        <q-tooltip transition-show="scale" transition-hide="scale"> {{ obj.tooltipText }}
        </q-tooltip>
        <component :is="obj.icon" class="tw-h-3 tw-w-3 tw-inline " :class="obj.isIconRotated ? 'tw-rotate-90' : ''"
          :key="rt" />
      </a>
    </div>
  </div>

</template>

<script>

import {rendererTypeIcons} from 'src/helpers/rendererConfig'
export default {

  name: "ChartToolbar",

  props: {
    rendererType: {
      default: 'table',
      type: String
    },
    showSettings: { default: 'true' }
  },

  methods: {
    emitSetRendererType(t) {
      this.$emit('setRendererType', t)
    }
  },

  data() {
    return {
      rendererTypeIcons: rendererTypeIcons 
    }
  },

  setup() {
    let baseIconClass = "tw-border tw-mb-3 tw-pb-1 tw-px-2 tw-rounded-sm tw-mx-0.5"
    let iconClass = baseIconClass + " tw-border-default/20 tw-bg-secondary tw-text-default"
    let iconActiveClass = baseIconClass + " tw-border-primary tw-bg-primary tw-text-white"

    return {
      iconClass, iconActiveClass
    }
  }

}
</script>
