<template>
  <AGModal :size="form.modalSize" bodyClass="tw-grid tw-overflow-y-auto" :show="open" @update:show="(val) => $emit('update:open', val)" :loading="loading" :loadingMessage="loadingMessage">
    <template #header>
      <AGFormHeader :form="form" />
    </template>
    <template #body>
      <div class="tw-p-2">
        <AGFormFields :form="form" v-model:validForm="validForm" :variables="variables" v-model:outputForm="outputForm" :queryKey="queryKey" />
      </div>
    </template>
    <template #footer>
      <AGFormButtons :form="form" :validForm="validForm" :outputForm="outputForm" :variables="variables" :apiAction="apiAction" :queryKey="queryKey" :show="open" @reset="outputForm = {}" @update:show="val => $emit('update:open', val)" />
    </template>
  </AGModal>
</template>
<script>
import AGModal from 'components/utils/modal.vue'
import AGFormFields from 'components/apiActions/formFieldsRenderer.vue'
import AGFormButtons from 'components/apiActions/formButtonsRenderer.vue'
import AGFormHeader from 'components/apiActions/formHeaderRenderer.vue'
export default {
  name: 'AGFormRenderer',
  props: ['open', 'form', 'apiAction', 'variables', 'queryKey'],
  components: {
    AGModal,
    AGFormFields, AGFormButtons, AGFormHeader
  },
  data(){
    return {
    outputForm: {},
    recalculateOutputForm: 0,
    validForm: true
    }
  }
}
</script>
