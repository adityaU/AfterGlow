<template>
  <div class="tw-py-3 tw-px-3 tw-border-b tw-bg-white">

  <div class="tw-text-sm tw-font-semibold tw-mb-1">Select a Visualisation</div>
    <div class="tw-flex tw-gap-1">
      <div class="tw-cursor-pointer" :class="[rendererType === rt ? iconActiveClass : iconClass]"
        v-for="[rt, obj] in Object.entries(rendererTypeIcons)" :key="rt" @click="emitSetRendererType(rt)">
        <q-tooltip transition-show="scale" transition-hide="scale"> {{ obj.tooltipText }}
        </q-tooltip>
        <component :is="obj.icon" size=16 :class="obj.isIconRotated ? 'tw-rotate-90' : ''"
          :key="rt" />
      </div>
      <div class="tw-flex-1 tw-flex tw-items-center tw-gap-1 tw-justify-end">
      <div class="label">Custom:</div>
      <div class="tw-cursor-pointer" :class="[rendererType === rt ? iconActiveClass : iconClass]"
        v-for="[rt, obj] in Object.entries(customRendererIcons)" :key="rt" @click="emitSetRendererType(rt)">
        <q-tooltip transition-show="scale" transition-hide="scale"> {{ obj.tooltipText }}
        </q-tooltip>
        <component :is="obj.icon" size=16 :class="obj.isIconRotated ? 'tw-rotate-90' : ''"
          :key="rt" />
      </div>
      </div>
    </div>
  </div>

</template>

<script>

import {rendererTypeIcons, customRendererIcons} from 'src/helpers/rendererConfig'
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
      rendererTypeIcons: rendererTypeIcons,
      customRendererIcons: customRendererIcons
    }
  },

  setup() {
    let baseIconClass = "icon-default tw-p-1"
    let iconClass = baseIconClass
    let iconActiveClass = baseIconClass + " tw-border-primary tw-bg-primary tw-text-white"

    return {
      iconClass, iconActiveClass
    }
  }

}
</script>
