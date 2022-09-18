<template>
  <div class="tw-bg-white tw-rounded-sm tw-shadow-sm" >
    <div class="tw-grid tw-grid-cols-12 tw-py-4" @click="$emit('update:showQuery', !showQuery)">
      <a href="#" class="tw-col-span-8 tw-pl-3">
        <ChevronRightIcon class="tw-inline" size=14 v-if="!showQuery" />
        <ChevronDownIcon class="tw-inline" size=14 v-if="showQuery" />
        <div class="tw-inline">
          DEBUG INFO
        </div>
      </a>

      <div class="tw-col-span-4" v-if="limit">
        <CheckIcon class="tw-inline" size=14 />
        Limit of {{ limit }} applied
      </div>
    </div>
    <v-ace-editor :value="query" @init="editorInit" lang="sql" theme="dracula" readonly style="height: 300px" v-if="showQuery"/>
  </div>
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-dracula';
import { ChevronRightIcon, ChevronDownIcon, CheckIcon } from 'vue-tabler-icons';
export default {
  name: "AGDebugInfo",
  components: { VAceEditor, ChevronRightIcon, ChevronDownIcon, CheckIcon },
  props: ['query', 'limit', 'showQuery'],

}
</script>
