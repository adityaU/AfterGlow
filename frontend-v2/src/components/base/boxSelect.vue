<template>
  <div :class="isTab ? 'tw-border-b' : 'tw-px-1'">

    <div :class="klass(item.value)"
      class="tw-border tw-inline-flex tw-px-4 tw-py-2 tw-text-sm tw-capitalize first:tw-ml-0"
      v-for="item in options" :key="item">
      <div class="tw-cursor-pointer" @click="select(item)">
        {{ item.name }}
      </div>
    </div>

    <div
      class="tw-bg-primary tw-text-white tw-border-colapse tw-border-b-0 !tw-border-primary hover:tw-bg-primary/80 tw-border-collapse tw-hidden hover:tw-bg-secondary">
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "AGBoxSelect",
  props: ['options', 'selected', 'isTab', 'multi'],

  methods: {
    select(item) {
      if (!this.multi) {
        this.$emit('selected', item.value);
        this.$emit('update:selected', item.value);
        return
      }

      const localSelected = this.selected ? cloneDeep(this.selected) : []

      const i = this.selected && this.selected.indexOf(item.value)
      if (i < 0) {
        localSelected.push(item.value)
      } else {
        localSelected.splice(i, 1)
      }

      this.$emit('selected', localSelected);
      this.$emit('update:selected', localSelected);

    },
    klass(val) {
      let selected = false
      if (this.multi) {
        selected = this.selected && (this.selected.indexOf(val) >= 0)
      } else {
        selected = this.selected === val
      }

      let klass = ''
      if (selected) {
        klass += 'tw-bg-primary tw-text-white !tw-border-primary hover:tw-bg-primary/80'
      }

      if (this.isTab) {
        klass += ' tw-border-colapse tw-border-b-0 tw-rounded-t-xl'
      } else {
        klass += ' tw-mx-1 hover:tw-bg-secondary tw-rounded-full'
      }

      return klass

    }
  }
}
</script>


