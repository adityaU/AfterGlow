<template>
  <div
    class="tw-flex tw-bg-white tw-py-4 tw-px-4 tw-shadow-sm tw-border-b tw-items-center"
  >
    <div
      class="tw-cursor-pointer tw-flex-1"
      @click="openQuestionTitleModal = true"
    >
      <div class="tw-cursor-pointer tw-font-semibold tw-text-primary">
        {{ questionLocal?.title || 'New Question' }}
      </div>
      <div
        class="note tw-leading-3"
        v-if="questionLocal && questionLocal.description"
      >
        {{ questionLocal?.description || 'New Question' }}
      </div>
    </div>

    <div
      class="tw-flex tw-gap-4 tw-leading-4 tw-items-center"
      v-if="currentUser.canEditQuestion"
    >
      <div
        class="tw-font-semibold tw-text-primary tw-uppercase tw-cursor-pointer"
        @click="save"
      >
        Save
      </div>
      <div
        class="tw-font-semibold tw-text-primary tw-uppercase tw-cursor-pointer"
        @click="openShareQuestionModal = true"
        v-if="questionLocal.id"
      >
        share
      </div>
      <div
        class="tw-font-semibold tw-text-primary tw-uppercase tw-cursor-pointer"
        @click="openTagsModal = true"
        v-if="questionLocal.id"
      >
        Add Tags
      </div>
      <div
        class="tw-font-semibold tw-text-red-700 tw-uppercase tw-cursor-pointer"
        @click="openDeleteModal = true"
        v-if="questionLocal.id"
      >
        delete
      </div>
      <span
        class="tw-cursor-pointer tw-mr-4 tw-border tw-pb-1 tw-px-2 tw-rounded-sm tw-mx-0.5 tw-border-default/20 tw-bg-secondary tw-text-default"
        @click="showQuestionSettingsModal = true"
        v-if="questionLocal.id && currentUser.canEditQuestion"
      >
        <q-tooltip transition-show="scale" transition-hide="scale">
          Show question Settings
        </q-tooltip>
        <SettingsIcon class="tw-h-3 tw-w-3 tw-inline" />
      </span>
    </div>

    <AGTitleModal
      v-model:question="questionLocal"
      v-model:open="openQuestionTitleModal"
      @save="save"
      v-if="currentUser.canEditQuestion"
    />
    <AGShareQuestionModal
      v-model:open="openShareQuestionModal"
      v-model:entity="questionLocal"
      entityName="Question"
      @save="save"
      v-if="currentUser.canEditQuestion"
    />
    <AGAddTagsModal
      v-model:open="openTagsModal"
      v-model:tags="tagsLocal"
      @save="save"
      v-if="currentUser.canEditQuestion"
    />
    <AGDeleteModal
      entityName="question"
      :entityID="questionLocal.id"
      @deleted="deleted"
      v-model:open="openDeleteModal"
      v-if="currentUser.canEditQuestion"
    />
    <AGQuestionsSettings
      v-model:open="showQuestionSettingsModal"
      v-model:question="questionLocal"
      @saveQuestion="save"
      v-if="questionLocal.id"
      :key="questionLocal"
    />
  </div>
</template>
<script>
import AGTitleModal from 'components/question/titleModal.vue';
import AGShareQuestionModal from 'components/utils/shareEntity.vue';
import AGAddTagsModal from 'components/question/addTagsModal.vue';
import AGDeleteModal from 'components/utils/deleteEntityModal.vue';
import AGQuestionsSettings from 'components/question/settings.vue';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { currentUserStore } from 'src/stores/currentUser';
import { SettingsIcon } from 'vue-tabler-icons';

const currentUser = currentUserStore();

export default {
  name: 'AGQuestionHeader',
  props: ['question', 'tags'],
  components: {
    AGTitleModal,
    AGShareQuestionModal,
    AGAddTagsModal,
    AGDeleteModal,
    SettingsIcon,
    AGQuestionsSettings,
  },

  watch: {
    tags: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(oldv, newv)) {
          this.tagsLocal = this.tags;
        }
      },
    },

    tagsLocal: {
      deep: true,
      handler(newv, oldv) {
        this.$emit('update:tags', this.tagsLocal);
      },
    },
    question: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.questionLocal, this.question)) {
          this.questionLocal = cloneDeep(this.question);
        }
      },
    },

    questionLocal: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.questionLocal, this.question)) {
          this.$emit('update:question', this.questionLocal);
        }
      },
    },
  },

  data() {
    return {
      questionLocal: cloneDeep(this.question) || {},
      openQuestionTitleModal: false,
      openShareQuestionModal: false,
      openTagsModal: false,
      openDeleteModal: false,
      tagsLocal: [],
      currentUser: currentUser,
      showQuestionSettingsModal: false,
    };
  },

  methods: {
    deleted() {
      window.location.pathname = '/questions';
    },
    save() {
      if (!this.questionLocal?.title) {
        this.openQuestionTitleModal = true;
        return;
      }
      this.$emit('save');
    },
  },
};
</script>
