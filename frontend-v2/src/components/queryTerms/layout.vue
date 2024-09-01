<template>
  <div class="tw-w-full tw-flex tw-gap-2 tw-items-center tw-border-0">
    <template v-if="!hideQueryTerms">
      <div class="tw-flex tw-flex-col tw-rounded-full tw-overflow-hidden tw-w-full"
        v-if="showAskAI && (currentUser.canEditQuestion || showQTs)">
        <AGInput v-model:value="queryTermsLocal.genai_prompt.request" placeholder="Ask AI anything about this data"
          class="tw-w-full" debounce="500" />
      </div>
      <template v-if="!showAskAI">
        <div class="" v-if="currentUser.canEditQuestion || showQTs">
          <AGFilters v-model:filters="queryTermsLocal.filters" :columns="columns" :colDetails="colDetails" :rows="rows" />
        </div>
        <div class="" v-if="currentUser.canEditQuestion || showQTs">
          <AGViews v-model:views="queryTermsLocal.views" :columns="columns" :colDetails="colDetails" />
        </div>
        <div class="" v-if="currentUser.canEditQuestion || showQTs">
          <AGGroupings v-model:groupings="queryTermsLocal.groupings" :columns="columns" :colDetails="colDetails" />
        </div>
        <div class="" v-if="currentUser.canEditQuestion || showQTs">
          <AGSortOrders v-model:sortings="queryTermsLocal.sortings" :columns="columns" :colDetails="colDetails" />
        </div>
        <div class="" v-if="currentUser.canEditQuestion || showQTs">
          <AGLimit v-model:limit="queryTermsLocal.limit" />
        </div>

        <div class="" v-if="currentUser.canEditQuestion || showQTs">
          <AGOffset v-model:offset="queryTermsLocal.offset" />
        </div>
      </template>
    </template>
    <!-- <div class=""> -->
    <!-- <AGLimit/> -->
    <!-- </div> -->
    <div class="tw-whitespace-nowrap tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-2">

      <div class="tw-bg-primary tw-rounded-full" v-if="!hideQueryTerms">
        <div class="tw-flex tw-items-center tw-px-4 tw-py-1 tw-cursor-pointer tw-font-semibold tw-gap-1"
          v-if="!hideAskAI && !showAskAI && currentUser?.getIfGenAIEnabled && (currentUser.canEditQuestion || showQTs)"
          @click="toggleAskAI">
          <BrainIcon />
          Ask AI
          <div class="tw-w-[15px] tw-h-[15px] tw-bg-yellow-500 tw-rounded-full"
            v-if="queryTermsLocal?.genai_prompt?.request"></div>
        </div>
        <div class="tw-flex tw-items-center tw-px-4 tw-py-1 tw-cursor-pointer tw-font-semibold"
          v-if="showAskAI && !hideAskAI && currentUser?.getIfGenAIEnabled && (currentUser.canEditQuestion || showQTs)"
          @click="toggleAskAI">
          <BoxModel2Icon />
          Filters
        </div>
      </div>
      <div class="tw-text-primary tw-cursor-pointer tw-inline" @click="clearQueryTerms"
        v-if="currentUser.canEditQuestion || showQTs">
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
import AGInput from 'components/base/input.vue';

import { currentUserStore } from 'src/stores/currentUser';
// import AGLimit from 'components/queryTerms/limit.vue'

import { newQueryTerms } from 'src/helpers/qtHelpers';
import { _ } from 'lodash';
import isEqual from 'lodash/isEqual';

import { BrainIcon, BoxModel2Icon } from 'vue-tabler-icons';

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
    'hideAskAI'
  ],
  components: {
    AGFilters,
    AGGroupings,
    AGViews,
    AGSortOrders,
    AGLimit,
    AGOffset,
    BrainIcon,
    AGInput,
    BoxModel2Icon
  },
  data() {
    return {
      showAskAI: false,
      queryTermsLocal:
        _.cloneDeep(this.queryTerms.details) || _.cloneDeep(newQueryTerms),
      currentUser: currentUser,
    };
  },

  watch: {
    genAIPrompt: {
      deep: true,
      handler() {
        let genAIPrompt = this.queryTermsLocal?.genai_prompt;
        if (genAIPrompt?.request && (genAIPrompt?.request != this.queryTermsLocal?.genai_prompt?.request) || (genAIPrompt?.columns != this.queryTermsLocal?.genai_prompt?.columns)) {
          let request = genAIPrompt.request;
          this.clearQueryTerms()
          this.queryTermsLocal.genai_prompt.request = request;
          this.queryTermsLocal.genai_prompt.columns = this.columns || [];
        }

      },
    },
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
    genAIPrompt() {
      return this.queryTermsLocal?.genai_prompt?.request
    },
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
    toggleAskAI() {
      this.showAskAI = !this.showAskAI;


    },
    clearQueryTerms() {
      this.queryTermsLocal = _.cloneDeep(newQueryTerms);
    },
  },
};
</script>
