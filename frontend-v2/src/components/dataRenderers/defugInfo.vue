<template>
  <div class="tw-bg-white tw-rounded-sm tw-shadow-sm" >
    <div class="tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-py-4" @click="$emit('update:showQuery', !showQuery)">
      <a href="#" class="tw-col-span-8 tw-pl-3">
        <ChevronRightIcon class="tw-inline" size=14 v-if="!showQuery" />
        <ChevronDownIcon class="tw-inline" size=14 v-if="showQuery" />
        <div class="tw-inline note tw-text-primary tw-font-semibold">
          DEBUG INFO
        </div>
      </a>


      <div class="tw-text-right tw-pr-4">
        <span class="tw-text-primary tw-font-semibold note">

        <CheckIcon class="tw-inline tw-text-green-700" size=14 v-if="fromCache" />
        <XIcon class="tw-inline tw-text-red-700" size=14 v-if="!fromCache" />
        Cached
        </span>
      </div>
      <div class="tw-text-right tw-pr-4" v-if="!fromCache">
        <span class="note tw-font-semibold tw-text-primary">Last Updated At:</span>
        <span class="note"> now</span>
      </div>
      <div class="tw-text-right tw-pr-4" v-if="fromCache">
        <span class="note tw-font-semibold tw-text-primary">Last Updated At:</span>
        <span class="note"> &nbsp; {{lastUpdatedAt}}</span>
      </div>

      <div class="tw-text-right tw-pr-4" v-if="fromCache">
        <span class="note tw-font-semibold tw-text-primary">Cached Until:</span>
        <span class="note"> &nbsp; {{cachedUntilTime}}</span>
      </div>
        
    </div>
    <v-ace-editor :value="query" @init="editorInit" lang="sql" theme="dracula" readonly style="height: 300px" v-if="showQuery"/>
  </div>
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-dracula';
import { ChevronRightIcon, ChevronDownIcon, CheckIcon, XIcon } from 'vue-tabler-icons';

import {date} from 'quasar';
export default {
  name: "AGDebugInfo",
  components: { VAceEditor, ChevronRightIcon, ChevronDownIcon, CheckIcon, XIcon },
  props: ['query', 'showQuery', 'fromCache', 'cacheUpdatedAt', 'cachedUntil'],

  computed: {
    lastUpdatedAt(){
      return this.cacheUpdatedAt && date.formatDate(this.cacheUpdatedAt + 'Z', 'MMM DD, YYYY, hh:mm:ss A') 
    },
    cachedUntilTime(){
      return this.cachedUntil && date.formatDate(this.cachedUntil, 'MMM DD, YYYY, hh:mm:ss A') 
    }
  }

}
</script>
