<template>
  <teleport to="body">

    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
          Create Users
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y">
          <div class="label"> Access Level </div>
          <div class="input-border tw-px-2 tw-py-1" v-if="permissionSets">
            {{permissionSet?.name || 'Select Access level'}}

            <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="800px" 
              class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown" fit>
              <SelectOptions :options="permissionSets" v-model:selected="permissionSet" :menuShow="menuShow"
                displayKey="name" areOptionObjects="true" hideOnClick=true hideSearch=true />
            </q-menu>
          </div> 
          <div class="label tw-mt-4">Emails</div>
          <AGInput v-model:value="newUserEmails" textArea=true placeholder="Enter comma separated emails" />
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')">
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="newUserEmails && permissionSet ? '' : 'disabled' "
            @clicked="(save() || true) " >
            Create
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>

</template>
<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from "components/base/button.vue"
import AGInput from "components/base/input.vue"
import SelectOptions from "components/base/selectOptions.vue"
import isEqual from 'lodash/isEqual'

import {fetchPermissionSets, createBulkUsers} from 'src/apis/user'
import {fetchDatabases} from 'src/apis/database'
import {sessionStore} from 'stores/session'
import cloneDeep from 'lodash/cloneDeep'

import {fetchRecipients} from 'src/apis/recipients'
export default {
  name: 'AGCreateUsers',
  components: {AGModal, AGButton, AGInput, SelectOptions},
  props: ["open"],

  data() {
    return {
      newUserEmails: "",
      permissionSet: null,
      permissionSets: [],
    }
  },

  mounted(){
    fetchPermissionSets(this.setPermissionSets)
  },

  methods: {
    setPermissionSets(ps, _loading){
      this.permissionSets = ps
    },
    save(){
      const emails = this.newUserEmails.split(',').map(e => e.trim())
      createBulkUsers(emails, this.permissionSet?.id, (_t, loading) => {
        if (!loading ){
          this.$emit('refresh')
          this.$emit('update:open', false)
        }
      })
    },
  }
}
</script>
