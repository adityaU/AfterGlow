<template>
  <div>

    <div class="label tw-mb-1" v-if="!naked">
      {{ label }}
    </div>
    <div class="tw-cursor-pointer"> 

      <q-menu transition-show="scale" class="tw-overflow-auto" transition-hide="scale" auto-close=true
        max-height="70vh">
        <div class="card tw-p-2">
          <div class="tw-my-2" v-for="arr in colors" :key=arr>
            <div 
              class="tw-cursor-pointer tw-box-content tw-mx-0.5 tw-inline tw-border-4 tw-border-secondary/20 tw-px-2.5 tw-rounded"
              :class="selectedColor == color ? 'tw-border-primary' : ''"
              :style="pallateStyle(color)"
              @click="selectColor(color)" v-for="color in arr" :key="color"
              v-close-popup>
            </div>
          </div>
          <AGButton @clicked="moreColors">More Colors</AGButton>
          <AGButton @clicked="random" v-if="allowRandom" >Random</AGButton>
          <AGButton @clicked="auto" v-if="allowAuto" >Auto</AGButton>
        </div>
      </q-menu>

      <span class="btn-full tw-border-4 tw-rounded tw-border-secondary/50 padding-top-[1px] tw-text-transparent"
        :style="pallateStyle(selectedColor)" v-if="(selectedColor != 'random' && selectedColor != 'auto')">
        c
      </span>
      <span class="btn-full tw-border-4 tw-rounded tw-border-secondary/50 padding-top-[1px] tw-text-transparent"
        :style="pallateStyle(selectedColor)" v-if="selectedColor === 'random'" v-close-popup>
        Random
      </span>
      <span class="btn-full tw-border-4 tw-rounded tw-border-secondary/50 padding-top-[1px] tw-text-transparent"
        :style="pallateStyle(selectedColor)" v-if="selectedColor === 'auto'" v-close-popup>
        Auto
      </span>
    </div>
  </div>
</template>

<script>
import { chunks } from '../../helpers/arrayUtils.ts';
import { generateColors, defaultColors } from '../../helpers/colorGenerator.ts';
import AGButton from 'components/base/button.vue';
export default {
  name: 'ColorSelector',

  props: {
    value: {default: defaultColors[0]},
    selectedColor: { default: defaultColors[0] }, label: { default: 'color' }, naked: { default: false }, additionalColors: { default: [] },
    allowRandom: {default: false},
    allowAuto: {default: false},
  },

  components: { AGButton },

  data() {
    const colors = chunks(generateColors(16), 8);
    return {
      colors: [(this.additionalColors || []), ...colors],
      colorCount: 16,
    }
  },

  methods: {
    pallateStyle(color){
      color = color ? color: this.value || this.selectedColor

      if (color === 'transparent'){
        return {
          "background-image": "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
          "background-size": "10px 10px",
          "background-position": "0 0, 0 10px, 10px -10px, -10px 0px",
          "opacity": 0.5,
          "border-color": "#e5e7eb"
        }
      }
      let base = {'background-color': color }
      if (color === 'white'){
        base["border-color"] = "#e5e7eb"
      }
      if (color === 'random' || color === 'auto'){
        base["border-color"] = "#e5e7eb"
        base["color"] = "#6e7687"
      }
      return base

    },
    moreColors() {
      this.colorCount += 16
      this.colors = [(this.additionalColors || []), ...chunks(generateColors(this.colorCount), 8)]
    },
    random(){
      this.$emit('selectColor', 'random')
      this.$emit('update:selectedColor', 'random')
      this.$emit('update:value', 'random')
    },
    auto(){
      this.$emit('selectColor', 'auto')
      this.$emit('update:selectedColor', 'auto')
      this.$emit('update:value', 'auto')
    },
    selectColor(color) {
      this.$emit('selectColor', color)
      this.$emit('update:selectedColor', color)
      this.$emit('update:value', color)
    }
  }

}
</script>
