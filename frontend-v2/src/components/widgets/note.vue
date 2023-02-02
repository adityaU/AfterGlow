<style scoped>
.group:hover .action-buttons{
  display: block;
} 
.group .action-buttons{
  display: none;
} 
</style>
<template>
  <div class="group tw-h-full tw-w-full">
    <AGLoader :text="loaderText" v-if="loading" />
    <div class="editor-content tw-p-2 tw-overflow-auto tw-w-full" v-html="parsedContent"
      v-if="!loading && note" />
    <div class="action-buttons tw-absolute tw-right-0 tw-top-0 tw-left-0 tw-bottom-0 tw-bg-primary/80 tw-text-white" v-if="!loading && note && editMode">
      <div class="tw-flex tw-justify-center tw-h-full tw-items-center tw-gap-1">
        <EditIcon size=16 @click="showEditorLocal = true" class="tw-cursor-pointer" />
        <slot />
      </div>
    </div>
  </div>

  <Editor v-model:content="note.content"
    v-model:open="showEditorLocal" 
    :id="id" 
    :query="query"
    :containerStyle="containerStyle"
    @save="save" @removeWidget="$emit('removeWidget', widgetID)" :key="note.content" v-if="note"/>
</template>

<script>
import Editor from './editNote.vue'
import AGLoader from 'components/utils/loader.vue'

import {variableQuery} from 'stores/variableQuery'


import { fetchNote, saveNote, deleteNote } from 'src/apis/notes'
import { queryStore } from 'stores/query'

import {EditIcon, } from 'vue-tabler-icons';

const query = queryStore()
const varStore = variableQuery()
export default {
  name: 'AGNote',
  props: ['id', 'queryKey', 'editMode', 'widgetID', 'containerStyle', 'showEditor'],
  components: { Editor, AGLoader, EditIcon, },
  watch: {
    showEditor(){
      this.showEditorLocal = this.showEditor
    },
    showEditorLocal(oldValue, newValue){
      if (oldValue != newValue){
        this.$emit('update:showEditor', this.showEditorLocal)
      }
    }
  },
  data() {
    return {
      query: null,
      note: {},
      loaderText: 'Fetching Note',
      loading: false,
      showEditorLocal: false,
      variables: [],
    }
  },
  mounted() {
    this.refresh()
  },

  mounted() {
    window.addEventListener('message', this.receiveMessage)
    this.refresh()
  },

  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage)
  },

  computed: {
    parsedContent(){
      if (!this.note) {return ""}
      let content = this.note.content
      this.variables.forEach(v => {
        const regex = new RegExp(`{{\\W*${v}\\W*}}`, "g")
        const value = varStore.get(varStore.hashed(v))
        content = content.replace(regex, value || "" )
      })
      return content
    }
  },

  methods: {
    refresh() {
      this.query = query.get(this.queryKey)
      if (this.id) {
        fetchNote(this.id, this.query.token, this.setNote)
      }
    },
    setNote(note, loading) {
      const prevID = this.note && this.note.id
      this.note = note
      this.loading = loading
      if (note){ this.parseVariables(note)}
      if (this.loading === false) {
        this.loaderText = "Fetching Note"
      }
      if (this.note && (prevID !=  this.note.id)) {
        this.$emit('update:id', this.note.id)
      }
    },
    save(html) {
      this.loaderText = "Saving Note"
      saveNote(this.id, { id: this.id, content: html }, this.query.token, this.setNote)
    },

    parseVariables(note){
      const matches = note.content.matchAll(/{{\W*(.*?)\W*}}/g) 
      let variables = []
      for (const match of matches){
        variables.push(match[1])
      }
      this.variables = variables
    },
    receiveMessage(event) {
      if (event.data.message != 'ag_refresh_dashboard') { return }
      const eventPayload = JSON.parse(event.data.payload)
      this.payload = Object.assign({}, this.payload, eventPayload)

      if (!eventPayload.changed) {
        this.refresh()
        return 
      }
    }
  }
}
</script>
