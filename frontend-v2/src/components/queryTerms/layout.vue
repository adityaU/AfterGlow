<template>
  <div
    :class="
      naked
        ? 'tw-flex tw-flex-wrap'
        : 'tw-flex  tw-py-2 tw-px-2 tw-border tw-bg-white tw-flex-wrap'
    "
  >
    <div
      class="tw-flex tw-divide-x tw-justify-start tw-items-center tw-flex-wrap"
      v-if="!hideQueryTerms"
    >
      <div class="" v-if="currentUser.canEditQuestion || showQTs">
        <AGFilters
          v-model:filters="queryTermsLocal.filters"
          :columns="columns"
          :colDetails="colDetails"
          :rows="rows"
        />
      </div>
      <div class="" v-if="currentUser.canEditQuestion || showQTs">
        <AGViews
          v-model:views="queryTermsLocal.views"
          :columns="columns"
          :colDetails="colDetails"
        />
      </div>
      <div class="" v-if="currentUser.canEditQuestion || showQTs">
        <AGGroupings
          v-model:groupings="queryTermsLocal.groupings"
          :columns="columns"
          :colDetails="colDetails"
        />
      </div>
      <div class="" v-if="currentUser.canEditQuestion || showQTs">
        <AGSortOrders
          v-model:sortings="queryTermsLocal.sortings"
          :columns="columns"
          :colDetails="colDetails"
        />
      </div>
      <div class="" v-if="currentUser.canEditQuestion || showQTs">
        <AGLimit v-model:limit="queryTermsLocal.limit" />
      </div>

      <div class="" v-if="currentUser.canEditQuestion || showQTs">
        <AGOffset v-model:offset="queryTermsLocal.offset" />
      </div>
    </div>
    <!-- <div class=""> -->
    <!-- <AGLimit/> -->
    <!-- </div> -->
    <div
      class="tw-text-right tw-my-auto tw-whitespace-nowrap tw-self-end tw-flex-1"
    >
      <div
        class="tw-text-primary tw-cursor-pointer tw-inline"
        @click="clearQueryTerms"
        v-if="currentUser.canEditQuestion || showQTs"
      >
        clear
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
import AGFilters from 'components/queryTerms/filters.vue';
import AGViews from 'components/queryTerms/views.vue';
import AGGroupings from 'components/queryTerms/groupings.vue';
import AGSortOrders from 'components/queryTerms/sortOrders.vue';
import AGLimit from 'components/queryTerms/limit.vue';
import AGOffset from 'components/queryTerms/offset.vue';

import { currentUserStore } from 'src/stores/currentUser';
// import AGLimit from 'components/queryTerms/limit.vue'

import { newQueryTerms } from 'src/helpers/qtHelpers';
import { _ } from 'lodash';
import isEqual from 'lodash/isEqual';

const currentUser = currentUserStore();
export default {
  name: 'AGQBHorizontalLayout',
  props: [
    'columns',
    'showSettings',
    'rows',
    'colDetails',
    'queryTerms',
    'vizConfig',
    'quesConfig',
    'naked',
    'hideQueryTerms',
  ],
  components: {
    AGFilters,
    AGGroupings,
    AGViews,
    AGSortOrders,
    AGLimit,
    AGOffset,
  },
  data() {
    return {
      queryTermsLocal:
        _.cloneDeep(this.queryTerms.details) || _.cloneDeep(newQueryTerms),
      currentUser: currentUser,
    };
  },

  watch: {
    queryTerms: {
      deep: true,
      handler() {
        if (!isEqual(this.queryTermsLocal, this.queryTerms.details)) {
          this.queryTermsLocal =
            this.queryTerms.details || _.cloneDeep(newQueryTerms);
        }
      },
    },
    queryTermsLocal: {
      deep: true,
      handler() {
        this.$emit('update:queryTerms', {
          towardsQTLayout: false,
          details: this.queryTermsLocal,
        });
      },
    },
  },

  computed: {
    showQTs() {
      if (!this.vizConfig) {
        if (
          this.quesConfig &&
          this.quesConfig.can_viewers_change_query_terms != 'null'
        ) {
          return this.quesConfig.can_viewers_change_query_terms;
        }
        return true;
      }
      if (
        this.vizConfig &&
        this.vizConfig.can_viewers_change_query_terms != null
      ) {
        return this.vizConfig.can_viewers_change_query_terms;
      }
      return true;
    },
  },

  methods: {
    clearQueryTerms() {
      this.queryTermsLocal = _.cloneDeep(newQueryTerms);
    },
  },
};
</script>
