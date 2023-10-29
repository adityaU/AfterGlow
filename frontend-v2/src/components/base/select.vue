<template>
  <span class="">
    <div class="label" v-if="!naked">
      {{label}}
    </div>
    <div class="input-border tw-px-4 tw-py-2 border-radius-transition" :class="roundedClass ? 'tw-rounded-full' : 'tw-rounded-t-3xl tw-border-b-0 tw-shadow-sm'">
        <q-menu flat=true transition-show="jump-down" transition-hide="jump-up" max-height="400px"
          class="tw-rounded-b-xl tw-shadow-sm tw-border"
          @before-show="menuShow" @before-hide="menuHide" @keydown="onKeydown" fit auto-close>
          <SelectOptions :options="options" :selected="selected" :menuShow="menuShow" :multiselect="multiselect" :hideSearch="hideSearch"
            @select="(val) => ($emit('select', val) || true) && $emit('update:selected', val)" :areOptionObjects="areOptionsObject" :displayKey="displayKey" />
        </q-menu>
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="" v-if="areOptionsObject">
            {{ displaySelected }}
          </div>
          <div class="" v-if="!areOptionsObject">
            {{ selected || description }}
          </div>
          <div class="tw-text-right" v-if="!canNotDeselect">
            <XMarkIcon class="tw-w-5 tw-h-5 tw-inline tw-mt-[-1px] tw-cursor-pointer" v-if="selected"
              @click="(event) => (event.stopPropagation() || true) && clearSelected()" />
          </div>

        </div>
      </div>


    </span>
</template>

<script>
import SelectOptions from 'components/base/selectOptions.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'AGSelect',
  props: ['options', 'label', 'description', 'selected',  'multiselect', 'areOptionsObject', 'canNotDeselect', 'naked', 'hideSearch', 'displayKey'],

  components: { XMarkIcon, SelectOptions },

  computed: {
    displaySelected(){
      if (!this.selected){
        return this.description
      }
      return this.options.filter((o) => o.value === this.selected)[0][this.displayKey || 'name']
    }
  },



  data() {
    return {
      roundedClass: true,
    }
  },

  methods: {
    menuShow() {
       this.roundedClass = false

    },
    menuHide(){
      this.roundedClass = true
    },
    clearSelected(){
      this.$emit('select', null)
      this.$emit('update:selected', null)
    }
  }




}
</script>
