<template>
  <q-slider :min="min" :max="max" :step="step" v-model="valueLocal" color="primary" />
</template>
<script>
export default {
  name: "AGSlider",
  props: {min: Number, max: Number, value: Number, step: Number},
  watch: {
    valueLocal(){
      this.$emit('update:value', this.valueLocal)
    }
  },
  data(){
    return {
      valueLocal: this.value || this.min || 0
    }
  }
}
</script>
