<template>
  <template v-if="!currentUser.loading">
    <AllQuestionsHeader />
    <div class="tw-mx-6 tw-my-3">
      <div
        class="tw-flex tw-flex-col tw-p-2 tw-gap-2 tw-flex-wrap tw-justify-center tw-w-full"
      >
        <div class="tw-flex tw-items-center tw-justify-center tw-p-4">
          <AGInput
            v-model:value="q"
            placeholder="Search Questions"
            class="tw-w-[500px]"
            debounce="300"
          />
        </div>

        <div class="tags tw-flex tw-gap-2 tw-flex-wrap">
          <div
            class="!tw-py-2 !tw-px-4 tw-flex tw-items-center tw-gap-1 tw-cursor-pointer tw-rounded-full"
            :class="
              tag === t.id ? 'tw-border-4 tw-border-primary tw-box-border' : ''
            "
            v-for="t in tags"
            :key="t"
            :style="{
              'background-color': t.color,
              color: autoTextColor(t.color),
            }"
            @click="filterByTags(t)"
          >
            {{ t.name }}
            <TagIcon size="16" />
          </div>
          <div
            class="tw-py-1 tw-px-2 tw-flex tw-items-center tw-gap-1 tw-cursor-pointer tw-uppercase tw-text-primary tw-font-semibold"
            v-if="tag"
            @click="clearTag"
          >
            Clear Tag
          </div>
        </div>
        <AGLoader v-if="loading" />
        <div class="tw-rounded-xl tw-border">
          <div
            class="tw-flex tw-bg-white tw-p-2 tw-border-b last:tw-rounded-b-xl first:tw-rounded-t-xl last:tw-border-0 tw-items-center tw-flex-1"
            v-for="question in questions"
            :key="question"
          >
            <CircleLetterQIcon size="40" class="icon-primary" />
            <div class="tw-flex tw-flex-1">
              <div class="tw-flex tw-flex-col tw-flex-1">
                <router-link
                  class="tw-font-semibold tw-text-primary tw-text-xl"
                  :to="'/questions/' + question.id"
                  >{{ question.title }}</router-link
                >
                <div class="note">{{ question.description }}</div>
                <div class="note">from {{ question.database_name }}</div>
              </div>

              <div class="tw-flex tw-flex-wrap tw-gap-1">
                <div
                  class="tw-flex tw-items-center tw-justify-center"
                  v-for="t in question.tags"
                  :key="t"
                >
                  <div
                    class="!tw-py-1 !tw-px-4 tw-flex tw-items-center tw-gap-1 tw-cursor-pointer tw-rounded-full"
                    :class="
                      tag === t.id
                        ? 'tw-border-4 tw-border-primary tw-box-border'
                        : ''
                    "
                    :style="{
                      'background-color': t.color,
                      color: autoTextColor(t.color),
                    }"
                    @click="filterByTags(t)"
                  >
                    {{ t.name }}
                    <TagIcon size="16" />
                  </div>
                </div>
              </div>
              <div class="tw-flex tw-flex-col tw-mx-2">
                <div class="note">
                  Updated {{ moment(question.updated_at) }}
                </div>
                <div class="tw-flex tw-gap-1">
                  By
                  <div class="tw-font-semibold">
                    {{ question?.owner?.full_name || question?.owner?.email }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <AGLoader v-else />
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import AGInput from 'components/base/input.vue';
import AllQuestionsHeader from 'components/question/allQuestionsHeader.vue';

import { fetchTags } from 'src/apis/tags';

import { fetchQuestions, searchQuestions } from 'src//apis/questions';

import { authMixin } from 'src/mixins/auth';

import { sessionStore } from 'stores/session';
import { currentUserStore } from 'stores/currentUser';
import moment from 'moment';
import { autoTextColor } from 'src/helpers/colorGenerator';

import { TagIcon, CircleLetterQIcon } from 'vue-tabler-icons';

const session = sessionStore();
const currentUser = currentUserStore();
export default {
  name: 'AGDashboardsPage',
  components: {
    AGLoader,
    AllQuestionsHeader,
    AGInput,
    TagIcon,
    CircleLetterQIcon,
  },
  mixins: [authMixin],

  watch: {
    $route(newValue, oldValue) {
      this.tag = this.$route?.query?.tag || '';
      this.q = this.$route?.query?.q || '';
    },
    tag() {
      this.$router.push({ query: { q: this.q, tag: this.tag } });
      searchQuestions(this.q, this.tag, session.token, this.updateQuestions);
    },
    q() {
      this.$router.push({ query: { q: this.q, tag: this.tag } });
      searchQuestions(this.q, this.tag, session.token, this.updateQuestions);
    },
  },
  mounted() {
    this.loading = true;
    fetchTags((tags, loading) => {
      this.tags = tags;
    });
    searchQuestions(this.q, this.tag, session.token, this.updateQuestions);
  },

  data() {
    return {
      questions: [],
      tags: [],
      loading: false,
      q: '',
      tag: '',
      currentUser: currentUser,
    };
  },

  methods: {
    filterByTags(tag) {
      this.tag = tag.id;
    },
    updateQuestions(questions, loading) {
      this.questions = questions;
      this.loading = loading;
    },
    moment(t) {
      return moment(t).fromNow();
    },
    autoTextColor(c) {
      return autoTextColor(c);
    },
    clearTag() {
      this.tag = '';
      this.$router.push({ query: { q: this.q, tag: this.tag } });
    },
  },
};
</script>
