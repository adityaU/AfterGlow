
<template>
  <Teleport to="body">

    <div class="tw-text-indigo-700 tw-text-teal-700 tw-text-red-700 tw-text-yellow-700 tw-hidden"></div>
    <AGModal size="small" :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading" :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
          Delete API Action
        </div>
      </template>
      <template #body>
        <div class="tw-p-2">
        Are you sure , you want to delete this API Action ?
        </div>

      </template>
      <template #footer>

        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-start-11 tw-col-span-2 tw-p-2 tw-text-right">

            <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2" @clicked="$emit('update:open', false)">
              No
            </AGButton>

            <AGButton class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary tw-ml-2 tw-p-2" @clicked="deleteApiAction">
              Yes
            </AGButton>
          </div>
        </div>
      </template>
    </AGModal>

    <!-- <div v-if="open" class="tw-flex tw-inset-0 tw-z-50 tw-absolute tw-bg-default/80"> -->
    <!--   <div  -->
    <!--     class="tw-flex tw-inset-[5%] tw-z-50 tw-absolute tw-border tw-rounded-sm tw-shadow-sm tw-bg-white"> -->
    <!--     <div class="" v-if="!loading"> -->
    <!--       <div class="header tw-p-2 tw-border-b tw-text-2xl tw-"> -->
    <!--         Action Response -->
    <!--       </div> -->
    <!--       <div class="tw-p-2 tw-border-b tw-overflow-auto"> -->
    <!---->
    <!--         {{ response.response_body }} -->
    <!---->
    <!--       </div> -->
    <!--       <div class="tw-p-2 tw-border-t tw-inset-b-0 tw-absolute tw-w-100%"> -->
    <!---->
    <!--       </div> -->
    <!---->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </div> -->
  </Teleport>
</template>

<script>
import { queryStore } from 'stores/query'
import { api } from 'boot/axios';
import apiConfig from 'src/helpers/apiConfig'
import AGModal from 'components/utils/modal.vue'
import AGButton from 'components/base/button.vue'


export default {
  name: 'ApiActionDelete',
  props: ['apiActionID', 'queryKey', 'open'],
  components: { AGModal,AGButton},
  data() {
    return {
      loading: false,
    }
  },

  methods: {
    deleteApiAction() {
      const query = queryStore().get(this.queryKey)
      if (this.apiActionID) {
        const url = 'api_actions/' + this.apiActionID

        api.delete(url, apiConfig(query.token)).then(() => {
          this.loading = false
          this.$emit('update:apiAction')
          this.$emit('update:open', false)
        }).catch(_ => {
          this.loading = false
        })
        return

      }

    }
  }
}
</script>
