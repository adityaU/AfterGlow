<template>
  <div class="tw-grid tw-grid-cols-12 tw-py-2 tw-px-2 tw-border tw-bg-white">
    <div class="tw-grid-flow-col tw-auto-cols-max tw-divide-x tw-col-span-10 !tw-inline-flex ">
      <div class="">

        <AGFilters v-model:filters="queryTermsLocal.filters" :columns="columns" :colDetails="colDetails" :rows="rows" />

      </div>
      <div class="">
        <AGViews v-model:views="queryTermsLocal.views" :columns="columns" :colDetails="colDetails" />
      </div>
      <div class="">

        <AGGroupings v-model:groupings="queryTermsLocal.groupings" :columns="columns" :colDetails="colDetails" />
      </div>
      <div class="">
        <AGSortOrders v-model:sortings="queryTermsLocal.sortings" :columns="columns" :colDetails="colDetails" />
      </div>

    </div>
    <!-- <div class=""> -->
    <!-- <AGLimit/> -->
    <!-- </div> -->
    <div class="tw-text-right tw-w-full tw-col-span-2 tw-my-auto">
      <div class="tw-inline"><a href="#" class="tw-text-primary" @click="clearQueryTerms">clear</a></div>
      <div class=" tw-inline tw-px-2 tw-h-[30px]">
        <a href="#" :class="iconActiveClass"
          @click="$emit('updateViz')">
          <q-tooltip transition-show="scale" transition-hide="scale"> Run Query
          </q-tooltip>
          <PlayerPlayIcon class="tw-h-3 tw-w-3 tw-inline" />
        </a>
      </div>
      <div class=" tw-inline tw-px-2 tw-h-[30px]" v-if="rows && rows.length > 0">
        <a href="#" :class="[showSettings ? iconActiveClass : iconClass]"
          @click="$emit('updateShowSettings', showSettings)">
          <q-tooltip transition-show="scale" transition-hide="scale"> Settings
          </q-tooltip>
          <SettingsIcon class="tw-h-3 tw-w-3 tw-inline" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>

import { SettingsIcon, PlayerPlayIcon } from 'vue-tabler-icons';
import AGFilters from 'components/queryTerms/filters.vue'
import AGViews from 'components/queryTerms/views.vue'
import AGGroupings from 'components/queryTerms/groupings.vue'
import AGSortOrders from 'components/queryTerms/sortOrders.vue'
// import AGLimit from 'components/queryTerms/limit.vue'

import { _ } from 'lodash'

const newQueryTerms = {
  filters: { towardsChild: true, details: [] },
  views: { towardsChild: true, details: [] },
  groupings: { towardsChild: true, details: [] },
  sortings: { towardsChild: true, details: [] }
}
export default {
  name: 'AGQBHorizontalLayout',
  props: ['columns', 'showSettings', 'rows', 'colDetails', 'queryTerms'],
  components: {PlayerPlayIcon, SettingsIcon, AGFilters, AGGroupings, AGViews, AGSortOrders },
  data() {
    let baseIconClass = "tw-border  tw-pb-1 tw-px-2 tw-rounded tw-mx-0.5"
    let iconClass = baseIconClass + " tw-border-default/20 tw-bg-secondary tw-text-default"
    let iconActiveClass = baseIconClass + " tw-border-primary tw-bg-primary tw-text-white"
    return {
      iconActiveClass: iconActiveClass,
      iconClass: iconClass,
      queryTermsLocal: _.cloneDeep(this.queryTerms.details) || _.cloneDeep(newQueryTerms)
    }
  },

  watch: {
    queryTerms: {
      deep: true,
      handler() {
        if (this.queryTerms.towardsQTLayout) {
          this.queryTermsLocal =  this.queryTerms.details || _.cloneDeep(newQueryTerms)
          this.queryTermsLocal.filters.towardsChild = true
          this.queryTermsLocal.views.towardsChild = true
          this.queryTermsLocal.groupings.towardsChild = true
          this.queryTermsLocal.sortings.towardsChild = true
        }
      }

    },
    queryTermsLocal: {
      deep: true,
      handler() {
        this.$emit('update:queryTerms', { towardsQTLayout: false, details: this.queryTermsLocal })
      }
    }
  },

  methods: {
    clearQueryTerms() {
      this.queryTermsLocal =  _.cloneDeep(newQueryTerms)
    }
  }

}
</script>
