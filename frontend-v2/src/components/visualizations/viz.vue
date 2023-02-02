<template>
  <div class="tw-w-full tw-flex">
    <!-- :class="showDebugInfo ? (showQuery ? 'tw-h-[calc(100%-303px)]' : 'tw-h-[calc(100%-103px)]') : 'tw-h-[calc(100%-55px)]'"> -->

    <div class="tw-w-full tw-flex tw-flex-[1_1_100%]" v-if="loading">
      <AGLoader text="Fetching details" />
    </div>
    <div class="tw-w-full tw-flex tw-flex-[1_1_100%]" v-if="results && results.rows && results.rows.length === 0">
      <div class="tw-m-auto">
        LOOKS LIKE YOUR QUERY DID NOT RETURN ANY RESULT.
      </div>
    </div>
    <component :is="componentDefs[visualization.rendererType]['visComponent']" :results="results"
      :resultsKey="resultskey" :queryKey="queryKey" :settings="visualization.settings[visualization.rendererType]"
      :apiActionsVizLevel="apiActionsVizLevel" :apiActionsQuesLevel="apiActionsQuesLevel" :questionID="questionID"
      :visualizationID="visualization.id" class="tw-overflow-auto"
      v-if="results && results.rows && results.rows.length > 0 && !results.message" :size="size"
      :colDetails="results.column_details" @addFilter="(filter) => $emit('addFilter', filter)"
      @addSorting="(sorting) => $emit('addSorting', sorting)" :onDashboard="onDashboard" />

    <div class="tw-h-full tw-w-full tw-bg-white tw-rounded-sm tw-shadow-sm tw-flex " v-if="results && results.message">
      <div class="tw-text-2xl tw-m-auto tw-text-center tw-text-red-600" v-if="currentUser.canEditQuestion || !results.hideFromViewer">
        {{ results.message }}
        <div class="tw-text-default tw-text-sm">
          Please look at debug info above for more information
        </div>
      </div>
      <div class="tw-text-2xl tw-m-auto tw-text-center tw-text-red-600" v-if="!currentUser.canEditQuestion && results.hideFromViewer">
        Unable to Fetch results currently.
        <div class="tw-text-default tw-text-sm">
          Please Try again. If this error persists, contact administrator. 
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import AGLoader from 'components/utils/loader.vue'
import {newComponentDefs} from 'src/helpers/componentDefs'; 
import {_} from 'lodash';

import { currentUserStore } from 'src/stores/currentUser';
const currentUser = currentUserStore()
export default {

  name: 'AGViz',
  props: ['results', 'showSettings', 'resultskey', 'queryKey', 'apiActionsQuesLevel', 'questionID', 'size', 'visualization', 'loading', 'onDashboard'],
  components: {AGLoader},
  data() {
    return {
      currentUser: currentUser, 
      componentDefs: _.cloneDeep(newComponentDefs)
    }
  },
}
</script>
