<template>
<AGInput v-model:value="valueLocal" placeholder="Enter Comma Separated Values" />
</template>>

<script>
import AGInput from 'components/base/input.vue'
import debounce from 'lodash/debounce'
export default {
  name: "AGArrayInput",
  props: ['value', 'isObject'],
  components: {AGInput},
  data(){
    return {
      valueLocal: this.makeValueLocal(this.value)
    }
  },
  watch: {
    valueLocal(){
      debounce(()=> {
        this.$emit('update:value', this.makeValue())
      }, 300)()
    }
  },
  methods: {
    makeValue(){
      if (this.isObject) {
        return this.valueLocal.split(",").map(v => {
          return {name: v.trim(), value: v.trim()}
        })
      }

      return this.valueLocal.split(",").map(v => v.trim())
    },
    makeValueLocal(value){
      if (!Array.isArray(value)){
         return ""
      }

      const v = value.map(f => {
        if (this.isObject) {return f.name}
        f
      })

      return v.join(", " )
    }
  }
}
</script>
