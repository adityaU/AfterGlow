<template>
  <div>
    <div class="tw-flex tw-items-center tw-px-4">
      <div
        class="tw-flex-1 tw-font-semibold"
        :class="error.name ? 'tw-text-red-700' : 'tw-text-primary'"
      >
        {{ snippetLocal.name }}
        <q-menu
          flat="true"
          transition-show="scale"
          transition-hide="scale"
          max-height="400px"
          :offset="[0, 5]"
          class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
          @show="menuShow"
          @keydown="onKeydown"
        >
          <AGInput
            v-model:value="snippetLocal.name"
            class="tw-block"
            invisible="true"
            debounce="300"
          />
        </q-menu>
      </div>

      <div class="">
        <AGBool
          v-model:value="snippetLocal.expand_on_select"
          label="Expandable"
          class="tw-font-semibold"
        />
      </div>
    </div>
    <div class="tw-h-[200px]">
      <MonacoEditor
        theme="AGDraculaTheme"
        v-model:value="snippetLocal.text"
        language="sql"
        :options="{ minimap: { enabled: false } }"
        @editorWillMount="editorWillMount"
        @editorDidMount="editorDidMount"
      />
    </div>
    <div
      class="tw-flex tw-cursor-pointer tw-px-4 tw-py-2"
      v-if="!snippetLocal.expand_on_select"
      @click="open = !open"
    >
      <ChevronDownIcon Size="16" v-if="open" />
      <ChevronRightIcon Size="16" v-if="!open" />
      Referenced In
    </div>
    <div class="" v-if="open">
      <AGLoader text="fetching Questions" v-if="loading" class="tw-py-4" />
      <div
        class="tw-px-8"
        v-if="!loading && questions?.length == 0 && snippets?.length === 0"
      >
        Not Referenced Yet.
      </div>
      <div
        class="tw-flex tw-justify-between tw-border-b last:tw-border-b-0 tw-px-8"
        v-for="question in questions"
        :key="question"
      >
        <router-link class="tw-text-primary" :to="'/questions/' + question.id"
          >Question:{{ question.id }}</router-link
        >
        <div>{{ question.title }}</div>
      </div>
      <div
        class="tw-flex tw-justify-between tw-border-b last:tw-border-b-0 tw-px-8"
        v-for="snip in snippets"
        :key="snip"
      >
        <router-link class="tw-text-primary" :to="'/snippets/' + snip.id"
          >Snippet:{{ snip.id }}</router-link
        >
        <div>{{ snip.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import AGBool from 'components/base/bool.vue';
import AGInput from 'components/base/input.vue';
import MonacoEditor from 'monaco-editor-vue3';
import AGLoader from 'components/utils/loader.vue';
import { AGDraculaTheme } from 'src/helpers/monacoTheme';
import { saveSnippet } from 'src/apis/snippet';
import { fetchSnippetRefrencedBy } from 'src/apis/snippet';
import { ChevronRightIcon, ChevronDownIcon } from 'vue-tabler-icons';
export default {
  name: 'AGSnippet',
  props: ['snippet', 'monaco'],
  components: {
    AGBool,
    AGInput,
    MonacoEditor,
    ChevronDownIcon,
    ChevronRightIcon,
  },

  watch: {
    open() {
      if (this.open) {
        fetchSnippetRefrencedBy(this.snippet.id, this.setReferences);
      }
    },
    snippetLocal: {
      deep: true,
      handler() {
        this.error = {};
        saveSnippet(this.snippetLocal, this.setSnippetErrors);
      },
    },
  },

  data() {
    return {
      snippetLocal: this.snippet || {},
      error: {},
      open: false,
      questions: [],
      snippets: [],
    };
  },
  methods: {
    setReferences(response, loading) {
      this.questions = response?.questions || [];
      this.snippets = response?.snippets || [];
      this.loading = loading;
    },
    setSnippetErrors(snippet) {
      if (snippet.status === 422) {
        this.error = snippet.data.errors;
      }
    },
    editorWillMount(monaco) {
      if (!this.monaco) {
        this.$emit('update:monaco', monaco);
        monaco.editor.defineTheme('AGDraculaTheme', AGDraculaTheme);
      }
    },
  },
};
</script>
