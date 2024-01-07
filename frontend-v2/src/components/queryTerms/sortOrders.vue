<template>
  <floating-menu :items="sortingsLocal" label="Sort Order" @clicked="(val) => newsorting.showMenu = true">
    <template #itemsSlot>
      <div class="tw-inline" v-for="sorting, index in sortingsLocal" :key="sorting">

        <div class="tw-px-0.5 tw-py-1 tw-inline-flex tw-flex-nowrap">
          <sortingMenu @addsorting="prevent" addLabel="Done" @editsorting="(val) => sorting = val" :sorting="sorting"
            :columns="columns" :colDetails="colDetails" />
          <div class="tw-cursor-pointer btn tw-bg-primary tw-text-white hover:tw-bg-primary/80"
            v-for="dv, i in getDisplayValues(sorting, colDetails)" :key="dv" :class="i === 0 ? 'btn-left' : 'btn-center'"
            @click="sorting.currentStage = dv[1]">{{
              dv[0]
            }}</div>
          <div class="tw-cursor-pointer btn btn-right" @click="removesorting(index)">
            <XIcon class="tw-inline tw-h3 tw-w-3" size=18 />
          </div>
        </div>

      </div>
    </template>
    <template #menuSlot>
      <SortingMenu @addsorting="addsorting" @editsorting="(val) => newsorting = val" addLabel="Add Sort Order"
        :reset="reset" :sorting="newsorting" :columns="columns" :colDetails="colDetails" />
    </template>
  </floating-menu>
</template>

<script>



import FloatingMenu from 'components/base/floatingMultiSelect.vue'
import SortingMenu from 'components/queryTerms/sortOrderMenu.vue'

import { XIcon } from 'vue-tabler-icons';

import { SortingMixin } from 'src/mixins/sortingMixin'
import isEqual from 'lodash/isEqual'

import { _ } from 'lodash';
export default {

  name: 'AGsortings',

  props: ['columns', 'colDetails', 'sortings'],
  mixins: [SortingMixin],

  components: { SortingMenu, FloatingMenu, XIcon },

  data() {
    return {
      sortingsLocal: this.sortings?.details || [],
      reset: false,
      newsorting: null
    }
  },

  watch: {
    sortings() {
      if (!isEqual(this.sortingsLocal, this.sortings.details)) {
        this.sortingsLocal = this.sortings.details
      }
    },
    sortingsLocal: {
      deep: true,
      handler() {
        this.$emit('update:sortings', { towardsChild: false, details: this.sortingsLocal })
      }
    }
  },

  methods: {
    addsorting(sorting) {
      this.sortingsLocal.push(sorting)
      this.reset = !this.reset
      return true
    },

    removesorting(index) {
      this.sortingsLocal.splice(index, 1)
    }
  }

}
</script>
