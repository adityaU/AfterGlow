
<style scoped>
.font-transition {
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
}
</style>
<template>
  <!-- <div v-for="datum, j in row" :key="datum" class="tw-col-span-2"> -->
    <div class="tw-border tw-rounded tw-mx-3  tw-break-inside-avoid-column"
      :style="{ 'padding-top': fontRef / 4 + 'px', 'padding-bottom': fontRef / 5 + 'px', 'padding-left': fontRef / 4 + 'px', 'padding-right': fontRef / 3 + 'px' }">

      <div class="tw-block tw-text-right" :style="{
        'position': 'relative',
        'right': '0px',
        'top': fontRef / 30 + 'px',
        'height': '0px'
      }">
        <div class="tw-inline font-transition tw-text-right" :style="{ 'font-size': fontRef / 4 + 'px' }"
          v-if="settings.trendColumn">
          <div class="tw-inline tw-ml-3">
            {{settings.trendPrefix}}
            {{ data.referenceValues[index ]
            }}{{ settings.trendSuffix || '%'}}
          </div>
          <ArrowLongDownIcon class="tw-inline tw-stroke-red-500"
            :style="{ 'width': fontRef / 5 + 'px', 'height': fontRef / 4 + 'px' }"
            v-if="data.referenceValues[index ] < 0" />
          <ArrowLongUpIcon class="tw-inline tw-stroke-green-500"
            :style="{ 'width': fontRef / 5 + 'px', 'height': fontRef / 4 + 'px' }"
            v-if="data.referenceValues[index ] > 0" />
          <Bars2Icon class="tw-inline tw-stroke-blue-500"
            :style="{ 'width': fontRef / 5 + 'px', 'height': fontRef / 4 + 'px' }"
            v-if="data.referenceValues[index ] === 0" />
        </div>
      </div>
      <div class="tw-block tw-text-center">
        <div class="tw-inline font-transition  tw-text-black/80" :style="{ 'font-size': fontRef + 'px' }">{{settings.dataPrefix}}
        </div>
        <div class="tw-inline font-transition  tw-text-black/80" :style="{ 'font-size': fontRef + 'px' }">
        {{data.dataValues[index]}}
        </div>
        <div class="tw-inline font-transition  tw-text-black/80" :style="{ 'font-size': fontRef + 'px' }">
        {{settings.dataSuffix}}
        </div>

      </div>
      <div class="tw-block text-center" v-if="settings.subtitleColumn" :style="{ 'font-size': fontRef / 4 + 'px' }">
        {{ data.subtitles[index ] }}
      </div>

    </div>

  <!-- </div> -->
</template>

<script>

// import FitText from 'components/utils/fitText.vue'

import { ArrowLongUpIcon, ArrowLongDownIcon, Bars2Icon } from '@heroicons/vue/24/outline'
export default {
  name: "AGNumberDetails",
  props: ['row', 'fontRef', 'settings', 'index', 'data', 'numberOfColumns'],
  components: {
    ArrowLongUpIcon, ArrowLongDownIcon, Bars2Icon

  }
}
</script>
