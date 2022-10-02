<template>
  <div class="tw-grid tw-grid-cols-12 tw-py-2 tw-px-2 tw-border tw-bg-white">
    <div class="tw-grid-flow-col tw-auto-cols-max tw-divide-x tw-col-span-10 !tw-inline-flex ">
      <div class="" v-if="currentUser.canEditQuestion || settings.can_viewers_change_query_terms">

        <AGFilters v-model:filters="queryTermsLocal.filters" :columns="columns" :colDetails="colDetails" :rows="rows" />

      </div>
      <div class="" v-if="currentUser.canEditQuestion || settings.can_viewers_change_query_terms">
        <AGViews v-model:views="queryTermsLocal.views" :columns="columns" :colDetails="colDetails" />
      </div>
      <div class="" v-if="currentUser.canEditQuestion || settings.can_viewers_change_query_terms">

        <AGGroupings v-model:groupings="queryTermsLocal.groupings" :columns="columns" :colDetails="colDetails" />
      </div>
      <div class="" v-if="currentUser.canEditQuestion || settings.can_viewers_change_query_terms">
        <AGSortOrders v-model:sortings="queryTermsLocal.sortings" :columns="columns" :colDetails="colDetails" />
      </div>

    </div>
    <!-- <div class=""> -->
    <!-- <AGLimit/> -->
    <!-- </div> -->
    <div class="tw-text-right tw-w-full tw-col-span-2 tw-my-auto">
      <div class="tw-inline"><a href="#" class="tw-text-primary" @click="clearQueryTerms"
          v-if="currentUser.canEditQuestion || settings.can_viewers_change_query_terms">clear</a></div>
      <slot name="actions" />
    </div>
  </div>
</template>

<script>

import AGFilters from 'components/queryTerms/filters.vue'
import AGViews from 'components/queryTerms/views.vue'
import AGGroupings from 'components/queryTerms/groupings.vue'
import AGSortOrders from 'components/queryTerms/sortOrders.vue'

import { currentUserStore } from 'src/stores/currentUser'
// import AGLimit from 'components/queryTerms/limit.vue'

import { newQueryTerms } from 'src/helpers/qtHelpers';
import { _ } from 'lodash'

const currentUser = currentUserStore()
export default {
  name: 'AGQBHorizontalLayout',
  props: ['columns', 'showSettings', 'rows', 'colDetails', 'queryTerms', 'settings'],
  components: { AGFilters, AGGroupings, AGViews, AGSortOrders },
  data() {
    return {
      queryTermsLocal: _.cloneDeep(this.queryTerms.details) || _.cloneDeep(newQueryTerms),
      currentUser: currentUser,
    }
  },

  watch: {
    queryTerms: {
      deep: true,
      handler() {
        if (this.queryTerms.towardsQTLayout) {
          this.queryTermsLocal = this.queryTerms.details || _.cloneDeep(newQueryTerms)
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
      this.queryTermsLocal = _.cloneDeep(newQueryTerms)
    }
  }

}
</script>
