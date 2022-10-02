<template>
  <div class="tw-flex">
    <AGLoader :text="loaderText" v-if="loading" />
    <div class="editor-content tw-p-2 tw-overflow-auto tw-w-full" v-html="note.content"
      v-if="!loading && note && !editMode" />
    <div class="tw-h-full tw-w-full tw-overflow-hidden" v-if="!loading && note && editMode">
      <Editor v-model="note.content" @save="save" @removeWidget="$emit('removeWidget', widgetID)"/>
    </div>
  </div>
</template>

<script>
import Editor from './editNote.vue'
import AGLoader from 'components/utils/loader.vue'


import { fetchNote, saveNote, deleteNote } from 'src/apis/notes'
import { queryStore } from 'stores/query'

const query = queryStore()
export default {
  name: 'AGNote',
  props: ['id', 'queryKey', 'editMode', 'widgetID'],
  components: { Editor, AGLoader,},
  data() {
    return {
      query: null,
      note: {},
      loaderText: 'Fetching Note',
      loading: false,
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
    receiveMessage(event) {
      if (event.data.message == 'ag_refresh_dashboard') {
        this.refresh()
      }
    }
  }
}
</script>
