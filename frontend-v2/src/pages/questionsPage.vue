<template>
  <WithLoginHeader />
  <AllQuestionsHeader />
  <div class="tw-mx-6 tw-my-3 tw-mb-12">
    <div class="tw-flex tw-flex-col tw-p-2 tw-gap-2 tw-flex-wrap tw-justify-center tw-w-full">
      <div class="tags tw-flex tw-gap-2 ">
        <div class="tw-py-1 tw-px-2 tw-rounded !tw-py-2 !tw-px-4 tw-flex tw-items-center tw-gap-1 tw-cursor-pointer"
          :class="tag === t.id ? 'tw-border-4 tw-border-primary tw-box-border' : ''" v-for="t in tags" :key="t"
          :style="{ 'background-color': t.color, 'color': autoTextColor(t.color) }" @click="filterByTags(t)">
          {{ t.name }}
          <TagIcon size=16 />
        </div>
        <div
          class="tw-py-1 tw-px-2 tw-rounded tw-flex tw-items-center tw-gap-1 tw-cursor-pointer tw-uppercase tw-text-primary tw-font-semibold"
          v-if="tag" @click="clearTag"> Clear Tag </div>
      </div>
      <AGInput v-model:value="q" placeholder="Search Questions" debounce=300 />

      <AGLoader v-if="loading" />
      <div class="tw-flex tw-bg-white tw-p-2 tw-border tw-items-center tw-flex-1 tw-rounded-sm"
        v-for="question in questions" :key="question">

        <div class="icon-primary tw-py-2 tw-px-4 tw-text-2xl tw-mx-2">Q</div>
        <div class="tw-flex tw-flex-1">
          <div class="tw-flex tw-flex-col tw-flex-1">
            <router-link class="tw-font-semibold tw-text-primary tw-text-xl" :to="'/questions/' + question.id">{{
              question.title
            }}</router-link>
            <div class="note"> {{ question.description }}</div>
            <div class="note"> from {{ question.database_name }}</div>
          </div>
          <div class="tw-flex tw-flex-col tw-mx-2">
            <div class="note">
              Updated {{ moment(question.updated_at) }}
            </div>
            <div class=" tw-flex tw-gap-1">By <div class="tw-font-semibold">
                {{ question?.owner?.full_name || question?.owner?.email }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AGFooter />
</template>

<script>
import WithLoginHeader from 'components/header/withLogin.vue'
import AGLoader from 'components/utils/loader.vue'
import AGFooter from 'components/footer/static.vue'
import AGInput from 'components/base/input.vue'
import AllQuestionsHeader from 'components/question/allQuestionsHeader.vue'

import { fetchTags } from 'src/apis/tags'

import { fetchQuestions, searchQuestions } from 'src//apis/questions'

import { authMixin } from 'src/mixins/auth'

import { sessionStore } from 'stores/session'
import moment from 'moment'
import { autoTextColor } from 'src/helpers/colorGenerator'

import { TagIcon } from 'vue-tabler-icons'

const session = sessionStore()
export default {
  name: "AGDashboardsPage",
  components: { WithLoginHeader, AGLoader, AGFooter, AllQuestionsHeader, AGInput, TagIcon },
  mixins: [authMixin],

  watch: {
    $route(newValue, oldValue) {
      this.tag = this.$route?.query?.tag || ""
      this.q = this.$route?.query?.q || ""
    },
    tag() {
      this.$router.push({ query: { q: this.q, tag: this.tag } })
      searchQuestions(this.q, this.tag, session.token, this.updateQuestions)
    },
    q() {
      this.$router.push({ query: { q: this.q, tag: this.tag } })
      searchQuestions(this.q, this.tag, session.token, this.updateQuestions)
    }
  },
  mounted() {
    this.loading = true
    fetchTags((tags, loading) => {
      this.tags = tags
    })
    searchQuestions(this.q, this.tag, session.token, this.updateQuestions)
  },

  data() {
    return {
      questions: [],
      tags: [],
      loading: false,
      q: "",
      tag: "",
    }
  },

  methods: {
    filterByTags(tag) {
      this.tag = tag.id
    },
    updateQuestions(questions, loading) {
      this.questions = questions
      this.loading = loading
    },
    moment(t) {
      return moment(t).fromNow()
    },
    autoTextColor(c) {
      return autoTextColor(c)
    },
    clearTag() {
      this.tag = ""
      this.$router.push({ query: { q: this.q, tag: this.tag } })
    }
  }
}
</script>
