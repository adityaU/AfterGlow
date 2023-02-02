<template>
  <teleport to="body">

    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading"
      :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
          Share Dashboard
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y">
          <div class="note">Select email ids and/or teams to share this dashboard with: </div>
          <AGSearchSelect v-model:selected="dashboardLocal.shared_to"
            :queryFunction="searchUsers"
            :options="emailOptions"
            includeQuery=true
            disableLocalSearch="true"
            :selectedValidator="validateEmail"
            description="Enter few email or teams" class="tw-p-2 tw-pl-0" />

          <div class="note tw-pb-2">  or Share the link below:</div>
          <div class="tw-flex tw-w-full">
            <div class="tw-py-1 tw-px-1 tw-border tw-rounded-sm tw-flex-1">{{shareableLink}}</div>
            <div class="tw-py-1 tw-px-2 tw-border tw-border-l-0 tw-rounded-sm tw-bg-primary tw-text-white tw-cursor-pointer" @click="copyToClipboard">Copy</div>
          </div>



        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="$emit('update:open', false)">
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            @clicked="($emit('save') || true) && $emit('update:open', false)">
            Share
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>

</template>
<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from "components/base/button.vue"

import AGSearchSelect from 'components/base/searchSelect.vue'

import {sessionStore} from 'stores/session'
import cloneDeep from 'lodash/cloneDeep'

import {fetchRecipients} from 'src/apis/recipients'
export default {
  name: 'AGShareDashbaord',
  components: {AGModal, AGButton, AGSearchSelect},
  props: ["open","dashboard"],

  watch: {
    dashboardLocal:{
      deep: true,
      handler(){
        this.$emit("update:dashboard", this.dashboardLocal)
      }
    }
  },

  data(){
    return {
      emailOptions: [],
      dashboardLocal: cloneDeep(this.dashboard || {}),
      session: sessionStore()
    }
  },

  computed: {
    hostName(){
      return window.location.protocol + "//" + window.location.host
    },
    shareableLink(){
      return `${this.hostName}/dashboards/${this.dashboard.id}?share_id=${this.dashboardLocal.shareable_link}`
    }
  },

  methods: {
    searchUsers(q){
      fetchRecipients(q, this.session.token, (emailOptions) => {
        this.emailOptions = emailOptions
        this.emailOptions.push(q)
      })
    },

    validateEmail(email){
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return (true)
      }else if(/^".+"@team/.test(email)){
        return (true)
      }
      return (false)
    },
    copyToClipboard(){
      navigator.clipboard.writeText(this.shareableLink)
    }
  }
}
</script>
