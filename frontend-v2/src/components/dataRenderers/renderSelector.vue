<template>
  <div class="tw-my-3 tw-px-3">

  <a href="#" :class="[rendererType === 'number' ? iconActiveClass : iconClass]" @click="emitSetRendererType('number')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Number
    </q-tooltip>
    <HashtagIcon class="tw-h-3 tw-w-3 tw-inline "></HashtagIcon>
  </a>

  <a href="#" :class="[rendererType === 'table'  ? iconActiveClass : iconClass]" @click="emitSetRendererType('table')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Table
    </q-tooltip>
    <MenuIcon class="tw-h-3 tw-w-3 tw-inline "></MenuIcon>
  </a>

  <a href="#" :class="[rendererType === 'transposed_table' ? iconActiveClass : iconClass]" @click="emitSetRendererType('transposed_table')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Transposed Table
    </q-tooltip>
    <MenuIcon class="tw-h-3 tw-w-3 tw-inline  tw-rotate-90"></MenuIcon>
  </a>

  <a href="#" :class="[rendererType === 'line' ? iconActiveClass : iconClass]" @click="emitSetRendererType('line')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Line 
    </q-tooltip>
    <TrendingUpIcon class="tw-h-3 tw-w-3 tw-inline "></TrendingUpIcon>
  </a>

  <a href="#" :class="[rendererType === 'bar' ? iconActiveClass : iconClass]" @click="emitSetRendererType('bar')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Bar
    </q-tooltip>
    <ChartBarIcon class="tw-h-3 tw-w-3 tw-inline "></ChartBarIcon>
  </a>

  <a href="#" :class="[rendererType === 'pie' ? iconActiveClass : iconClass]" @click="emitSetRendererType('pie')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Pie
    </q-tooltip>
    <ChartPieIcon class="tw-h-3 tw-w-3 tw-inline "></ChartPieIcon>
  </a>

  <a href="#" :class="[rendererType === 'area' ? iconActiveClass : iconClass]" @click="emitSetRendererType('area')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Area
    </q-tooltip>
    <TrendingDownIcon class="tw-h-3 tw-w-3 tw-inline "></TrendingDownIcon>
  </a>

  <a href="#" :class="[rendererType === 'bubble' ? iconActiveClass : iconClass]" @click="emitSetRendererType('bubble')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Bubble
    </q-tooltip>
    <StopIcon class="tw-h-3 tw-w-3 tw-inline "></StopIcon>
  </a>

  <a href="#" :class="[rendererType === 'funnel' ? iconActiveClass : iconClass]" @click="emitSetRendererType('funnel')">
    <q-tooltip transition-show="scale" transition-hide="scale"> Funnel
    </q-tooltip>
    <RssIcon class="tw-h-3 tw-w-3 tw-inline rotate-135"></RssIcon>
  </a>

  </div>

</template>

<script>
import { HashtagIcon, MenuIcon, ChartBarIcon, ChartPieIcon, TrendingUpIcon, TrendingDownIcon, StopIcon, RssIcon } from '@heroicons/vue/outline'
export default {

  name: "RenderSelector",
  components: { HashtagIcon, MenuIcon, ChartBarIcon, ChartPieIcon, TrendingUpIcon, TrendingDownIcon, RssIcon, StopIcon },

  props: {
    rendererType: {
      default: 'table',
      type: String
    }
  },

  methods :{
    emitSetRendererType(t) {
      this.$emit('setRendererType', t)
    }
  },

  setup(){
    let baseIconClass = "tw-border  tw-pb-1 tw-px-2 tw-rounded tw-mx-0.5"
    let iconClass = baseIconClass + " tw-border-default/20 tw-bg-secondary tw-text-default"
    let iconActiveClass = baseIconClass + " tw-border-primary tw-bg-primary tw-text-white" 

    return {
    iconClass, iconActiveClass
    }
  }

}
</script>
