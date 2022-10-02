
<template>
    <AGModal :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading" :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
         Delete Note 
        </div>
      </template>
      <template #body>
        <div class="tw-p-2">
        Are you Sure, you want to delete this note ?
        </div>

      </template>
      <template #footer>

        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-start-11 tw-col-span-2 tw-p-2 tw-text-right">

            <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2" @clicked="$emit('update:open', false)">
              No
            </AGButton>

            <AGButton class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary tw-ml-2 tw-p-2" @clicked="deleteNote">
              Yes
            </AGButton>
          </div>
        </div>
      </template>
    </AGModal>
</template>

<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from 'components/base/button.vue'

import { deleteNote} from 'src/apis/notes'


export default {
  name: 'AGEditorLink',
  props: ['id', 'query', 'open'],
  components: { AGModal,AGButton},
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    deleteNote(){
      deleteNote(this.id, this.query.token, (loading) => {
      if (loading === false){
        this.$emit('update:open', false)
        this.$emit('noteDeleted', this.id)
      }
      this.loading = loading
      })
    }
  }

}
</script>
