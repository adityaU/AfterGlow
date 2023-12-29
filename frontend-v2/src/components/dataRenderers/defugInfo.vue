<template>
  <div class="tw-bg-white">
    <div class="tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-py-4"
      @click="$emit('update:showQuery', !showQuery)">
      <div class="tw-cursor-pointer tw-col-span-8 tw-pl-3">
        <ChevronRightIcon class="tw-inline" size="14" v-if="!showQuery" />
        <ChevronDownIcon class="tw-inline" size="14" v-if="showQuery" />
        <div class="tw-inline note tw-text-primary tw-font-semibold">
          DEBUG INFO
        </div>
      </div>

      <div class="tw-text-right tw-pr-4">
        <span class="tw-text-primary tw-font-semibold note">
          <CheckIcon class="tw-inline tw-text-green-700" size="14" v-if="fromCache" />
          <XIcon class="tw-inline tw-text-red-700" size="14" v-if="!fromCache" />
          Cached
        </span>
      </div>
      <div class="tw-text-right tw-pr-4" v-if="!fromCache">
        <span class="note tw-font-semibold tw-text-primary">Last Updated At:</span>
        <span class="note"> now</span>
      </div>
      <div class="tw-text-right tw-pr-4" v-if="fromCache">
        <span class="note tw-font-semibold tw-text-primary">Last Updated At:</span>
        <span class="note"> &nbsp; {{ lastUpdatedAt }}</span>
      </div>

      <div class="tw-text-right tw-pr-4" v-if="fromCache">
        <span class="note tw-font-semibold tw-text-primary">Cached Until:</span>
        <span class="note"> &nbsp; {{ cachedUntilTime }}</span>
      </div>
    </div>
    <div class="tw-h-[300px]" v-if="showQuery">
      <MonacoEditor theme="AGDraculaTheme" class="tw-rounded-b-2xl" :value="query" :language="query_type"
        :options="{ languageWorkers: ['sql', 'json'] }" @editorWillMount="editorWillMount"
        @editorDidMount="editorDidMount" @change="change" />
    </div>
  </div>
</template>

<script>
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
} from 'vue-tabler-icons';

import { date } from 'quasar';
import MonacoEditor from 'monaco-editor-vue3';
import { AGDraculaTheme } from 'src/helpers/monacoTheme';
import { setSQLFormatter } from 'src/helpers/formatters';
import { shallowRef } from 'vue';
export default {
  name: 'AGDebugInfo',
  components: {
    MonacoEditor,
    ChevronRightIcon,
    ChevronDownIcon,
    CheckIcon,
    XIcon,
  },
  props: [
    'query',
    'showQuery',
    'fromCache',
    'cacheUpdatedAt',
    'cachedUntil',
    'query_type',
  ],

  data() {
    return {
      editorInstance: null,
    };
  },

  computed: {
    lastUpdatedAt() {
      return (
        this.cacheUpdatedAt &&
        date.formatDate(this.cacheUpdatedAt + 'Z', 'MMM DD, YYYY, hh:mm:ss A')
      );
    },
    cachedUntilTime() {
      return (
        this.cachedUntil &&
        date.formatDate(this.cachedUntil, 'MMM DD, YYYY, hh:mm:ss A')
      );
    },
  },
  methods: {
    editorDidMount(editor) {
      this.editorInstance = shallowRef(editor);
      setTimeout(() => {
        this.editorInstance.updateOptions({
          readOnly: false,
          minimap: { enabled: false },
        });
        this.editorInstance.getAction('editor.action.formatDocument').run();
        setTimeout(() => {
          this.editorInstance.updateOptions({ readOnly: true });
        }, 500);
      }, 500);
    },
    editorWillMount(monaco) {
      monaco.editor.defineTheme('AGDraculaTheme', AGDraculaTheme());
      setSQLFormatter(monaco);
    },
  },
};
</script>
