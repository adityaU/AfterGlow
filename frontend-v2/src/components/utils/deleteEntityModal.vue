<template>
  <teleport to="body">

    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)"
      :loading="loading" :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold tw-uppercase">
          Delete {{ entityName }}
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y">
          <p>
            This will permanently delete this {{ entityName }}. Are you sure?
          </p>
        </div>
      </template>
      <template #footer>
        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-span-12 tw-p-2 tw-text-center">
            <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2" @clicked="$emit('update:open', false)">
              Cancel
            </AGButton>
            <AGButton
              class="tw-text-white hover:tw-bg-red-700/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-red-700 tw-ml-2 tw-p-2"
              @clicked="deleteEntity() && $emit('update:open', false)">
              Yes, Delete
            </AGButton>
          </div>
        </div>
      </template>
    </AGModal>
  </teleport>
  <AGToast v-model:show="toastShow" :type="toastType">{{
    toastMessage
  }}</AGToast>
</template>

<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from 'components/base/button.vue'
import AGToast from 'components/utils/toast.vue'
import { deleteEntity } from 'src/apis/entity'

export default {
  name: 'deleteEntity',
  props: ['open', 'entityName', 'entityID'],
  components: { AGModal, AGButton, AGToast },
  data() {
    return {
      toastShow: false,
      toastMessage: '',
      toastType: 'critical',
    }
  },
  methods: {
    redirect(error, loading) {
      if (!loading) {
        if (error) {
          this.toastShow = true;
          this.toastMessage = error.details || error.error || "Unsuccessful";
          this.$emit('update:open', false)
        } else {
          this.toastShow = true;
          this.toastMessage = `${this.entityName} deleted successfully`;
          this.$emit('update:open', false)
          this.$emit('deleted')
        }
      }
    },

    deleteEntity() {
      deleteEntity(this.entityName, this.entityID, this.redirect)
      return true
    }
  }
}
</script>
