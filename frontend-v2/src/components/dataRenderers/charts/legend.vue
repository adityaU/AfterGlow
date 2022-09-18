<template>
  <div v-if="legendDetailsLocal.length" class="tw-text-center tw-border-t tw-py-1 tw-overflow-x-auto tw-h-[50px] tw-w-full">
  <div class="tw-inline-block tw-m-1" v-for="legend in legendDetailsLocal" :key="legend">
    <div class="legend " :class="legend.show ? activeClass : inactiveClass" @click="legendClicked(legend)">
      <div
        class="tw-m-1 tw-inline tw-col-span-2 tw-border-4 tw-border-secondary/20 tw-px-2.5 tw-rounded tw-text-right tw-max-w-[20px] tw-text-xs"
        :style="{ 'color': legend.color, 'background-color': legend.color }"></div>
      {{ legend.legendName }}
    </div>
  </div>
  </div>

</template>

<script>
export default {
  name: "AGLegend",

  props: ['legendDetails'],

  watch: {
    legendDetails() {
      this.legendDetailsLocal = this.legendDetails
    }
  },

  data() {
    return {
      activeClass: "tw-text-default",
      inactiveClass: "tw-text-default/20",
      legendDetailsLocal: this.legendDetails
    }
  },
  methods: {
    legendClicked(legend) {
      (legend.show = !legend.show)
      this.$emit('updated', this.legendDetailsLocal)
    }
  }
}
</script>
