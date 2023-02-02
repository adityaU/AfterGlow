<style scoped>
  .group:hover .group\:hover\:tw-text-white{
    color: white;
  }
</style>
<template>
  <div class="" @keydown="onKeydown" tabindex="0">
    <div class="tw-py-1 tw-px-2" v-if="!hideSearch">
      <BaseInput :value="query" @inputed="(val) => query = val" placeholder="Search" ref="option_0" />
    </div>
    <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
      <div  @click="select(el)" :tabindex="index + 1"
        class=" tw-cursor-pointer group tw-flex tw-py-1 tw-px-2 tw-w-full hover:tw-bg-primary hover:!tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
        v-for="el, index in optionsLocal" :key=el :ref="'option_' + (index + 1)" v-close-popup="hideOnClick ? -1 : 0">
        <span class="text-icon-primary" v-if="iconLetter"> {{ iconLetter }} </span>
        <span class="tw-grid tw-grid-cols-12" v-if="areOptionObjects">
          <span class="tw-col-span-6">{{ el[this.displayKey || 'name'] }}</span>
          <span class="tw-text-xs tw-text-default/80 tw-text-right tw-col-span-6 tw-mt-1.5 group:hover:tw-text-white" v-if="el.subtitle">{{ el.subtitle }}</span>
        </span>
        <template v-if="!areOptionObjects">
          <span>{{ el }}</span>
        </template>
        <CheckIcon v-if="multiselect ? (selected.indexOf(el) >= 0) : (selected === el)"
          class="tw-w-5 tw-h-5 tw-stroke-primary tw-inline tw-float-right" />
      </div>
      <div class="tw-border-b last:tw-border-none tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis"
        v-if="optionsLocal && optionsLocal.length === 0">
        No Results
      </div>
    </div>
  </div>
</template>

<script>

import { CheckIcon } from 'vue-tabler-icons'
import BaseInput from 'components/base/input.vue';
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'AGSelectOptions',

  props: ['options', 'selected', 'menuShow', 'includeQuery', 'multiselect', 'iconLetter', 'hideSearch', 'areOptionObjects', 'searchQuery', 'disableLocalSearch', 'displayKey', 'hideOnClick'],

  components: { CheckIcon, BaseInput },

  data() {
    return { optionsLocal: [... this.options], query: "", focusPointer: -1 }
  },


  watch: {
    options(){
      this.optionsLocal = cloneDeep(this.options)
    },
    menuShow() {
      this.menuShowFn()
    },
    query(q) {
      if (this.disableLocalSearch){
        this.$emit('update:searchQuery', q)
        return 
      }
      if (!q || q === '') {
        this.optionsLocal = [...this.options]
        return
      }
      if (this.areOptionObjects) {
        this.optionsLocal = [...this.options].filter((item) => {
          return item[this.displayKey || 'name'].toLowerCase().indexOf(q.toLowerCase()) >= 0
        })
        if (this.includeQuery) {
          this.optionsLocal.push({ name: q, subtitle: null, })
        }

        return
      }

      this.optionsLocal = [...this.options].filter((item) => {
        return item.toLowerCase().indexOf(q.toLowerCase()) >= 0
      })

      if (this.includeQuery) {
        this.optionsLocal.push(q)
      }
    }
  },
  methods: {
    select(el) {
      if (this.areOptionObjects && !this.displayKey){
        this.$emit('select', el.value)
        this.$emit('update:selected', el.value)
        return
      }
      this.$emit('select', el)
      this.$emit('update:selected', el)
    },
    menuShowFn() {
      this.focusPointer = 0
      this.focus()
    },
    onKeydown(event) {
      if (event.key == 'ArrowUp') {
        this.focusPointer -= 1
        if (this.focusPointer < 0) {
          this.focusPointer = this.optionsLocal.length
        }
        this.focus()

      }

      if (event.key == 'ArrowDown') {
        this.focusPointer += 1
        if (this.focusPointer > this.optionsLocal.length) {
          this.focusPointer = 0
        }
        this.focus()
      }
    },
    focus() {
      if (this.focusPointer === 0) {
        this.$refs['option_0'].$el.focus()
        return
      }
      this.$refs['option_' + this.focusPointer][0].focus()
    }
  }
}
</script>
