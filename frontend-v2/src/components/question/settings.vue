<template>

  <teleport to="body">

    <AGModal size="small" :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading"
      :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
          Question Settings
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y" v-if="questionLocal">
          <AGInput label="Cache time in seconds" placeholder="example - 300 for 5 minutes, default: no caching"
            v-model:value="questionLocal.config.cache_time_in_seconds" type="number" />
          <div class="note tw-pl-2"> This cache time applies to all visualizations for this question. However you can
            override
            for each
            visualization.</div>
          <AGBool label="Can viewers change filters, view, group by and sort order"
            v-model:val="questionLocal.config.can_viewers_change_query_terms" />
          <div class="note tw-pl-2"> This Setting also applies to all visualizations for this question. However you can
            override
            for each visualization.</div>
          <AGBool label="Can viewers view data in new visualization"
            v-model:val="questionLocal.config.can_viewers_see_in_new_visualization" />
          <div class="tw-pl-2 note"> Viewers won't be able to save a new visualization. This option enables them to find
            useful data without modifying the existing visualizations.</div>
        </div>
      </template>
      <template #footer>
        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-span-12 tw-p-2 tw-text-center">
            <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2"
              @clicked="$emit('update:open', false)"> Cancel
            </AGButton>
            <AGButton
              class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-ml-2 tw-p-2"
              @clicked="$emit('saveQuestion')">
              Save
            </AGButton>
          </div>
        </div>
      </template>
    </AGModal>
  </teleport>

</template>

<script>
import AGButton from 'components/base/button.vue'
import AGBool from 'components/base/bool.vue';
import AGInput from 'components/base/agInput.vue'
import AGModal from 'components/utils/modal.vue'
import {_} from 'lodash'

export default {
  name: 'AGQuesSettings',
  components: { AGInput, AGBool, AGModal, AGButton },
  props: ['config', 'open', 'queryKey', 'question'],

  data() {
    let question = _.cloneDeep(this.question)
    if (question && !question.config){
      question.config = {can_viewers_change_query_terms: true, can_viewers_see_in_new_visualization: true}
    }
    return {
      loading: false,
      query: null,
      questionLocal: question ,
    }
  },
  watch: {
    questionLocal: {
      deep: true,
      handler() {
        this.$emit('update:question', this.questionLocal)
      }
    }
  }



}
</script>
