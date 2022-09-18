<template>
  <div class="tw-bg-primary tw-text-white tw-border-colapse tw-border-b-0 !tw-border-primary tw-border-collapse tw-hidden"></div>
  <div :class="isTab ? 'tw-border-b' : 'tw-p-1'">
  <div 
:class="klass(item.value)"
  class="tw-border tw-inline-flex tw-rounded-sm tw-px-2 tw-py-0.5 hover:tw-bg-secondary hover:tw-text-default tw-text-sm tw-capitalize" v-for="item in options" :key="item">
    <a href="#"  @click="$emit('selected', item.value)">
      {{ item.name }}
    </a>
  </div>
  </div>
</template>

<script>
export default {
  name: "AGBoxSelect",
  props: ['options', 'selected', 'isTab'],

  methods: {
    klass(val){
      let selected = false
      if (this.multiselect){
          selected = this.selected && (this.selected.indexOf(val) >= 0) 
      }else{
        selected = this.selected === val
      }

      let klass = '' 
      if (selected) {
        klass += 'tw-bg-primary tw-text-white !tw-border-primary'
      }

      if (this.isTab){
        klass += ' tw-border-colapse tw-border-b-0'
      }else{
        klass += ' tw-m-1'
      }

      return klass

    }
  }
}
</script>


