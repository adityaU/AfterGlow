<template>
  <div class="tw-text-indigo-700 tw-text-teal-700 tw-text-red-700 tw-text-yellow-700 tw-hidden"></div>
  <Teleport to="body">
    <AGModal :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading" :loadingMessage="loadingMessage">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold" v-if="!apiActionLocal.id">
          Create API Action
        </div>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold" v-if="apiActionLocal.id">
          Edit API Action
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 tw-text-sm">
          Pro tip: You can use column names/ question variables as variables. Use {{ escapedText }} in name, url,
          headers and body fields. Using this feature in name field replaces the action name by column value
        </div>
        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-span-6 tw-px-2 tw-mb-2">
            <div class="tw-text-sm tw-font-semibold">Name</div>
            <AGInput label="Name" placeholder="Give it a name" class="tw-mb-1" v-model:value="apiActionLocal.name" />

            <div class="tw-py-1 tw-text-red-500 tw-text-sm" v-if="errorMessage.name">
              {{ errorMessage.name }}
            </div>
          </div>

          <div class="tw-col-span-5 tw-px-2 tw-mb-2 tw-ml-[-10px] tw-mt-2 tw-text-right">
            <q-toggle v-model="availability" color="primary"
              label="Available for current visualization only" />
          </div>
          <div class="tw-col-span-1 tw-px-2 tw-mb-2 tw-text-right">
            <div class="tw-text-sm tw-font-semibold">color</div>
            <div class="tw-mb-1 tw-mt-1">
              <ColorSelect v-model:selectedColor="apiActionLocal.color" naked=true />
            </div>
          </div>

          <div class="tw-col-span-12 tw-px-2 tw-mb-2">
            <div class="tw-text-sm tw-font-semibold">Loading state message</div>
            <AGInput label="URL" placeholder="URL" class="tw-mb-1" v-model:value="apiActionLocal.loading_message" />

          </div>
          <div class="tw-col-span-12 tw-px-2 tw-mb-2">
            <div class="tw-text-sm tw-font-semibold">URL</div>
            <AGInput label="URL" placeholder="URL" class="tw-mb-1" v-model:value="apiActionLocal.url" />

            <div class="tw-py-1 tw-text-red-500 tw-text-sm" v-if="errorMessage.url">
              {{ errorMessage.url }}
            </div>
          </div>
          <div class="tw-col-span-12 tw-px-2 tw-mb-2">
            <div class="tw-text-sm tw-font-semibold">Method</div>
            <BoxSelect :options="methodOptions" v-model:selected="apiActionLocal.method"
              class="tw-mb-1 tw-border-b-0" />
          </div>
          <div class="tw-col-span-12 tw-px-2 tw-mb-2">
            <div class="tw-text-sm tw-font-semibold">Headers</div>
            <div class="" v-for="header, index in apiActionLocal.dummyHeaders" :key="header">
              <div class="tw-grid tw-grid-cols-11">
                <div class="tw-col-span-5 tw-pr-1">
                  <AGInput label="Name" placeholder="Header Key" class="tw-mb-1" v-model:value="header.name" />
                </div>
                <div class="tw-col-span-5 tw-pl-1">
                  <AGInput label="Name" placeholder="Header Value" class="tw-mb-1" v-model:value="header.value" />
                </div>
                <AGButton class="tw-border-0 tw-text-primary tw-px-0 tw-text-red-500"
                  @clicked="apiActionLocal.dummyHeaders.splice(index, 1)">
                  DELETE
                </AGButton>
              </div>

            </div>
            <AGButton class="tw-border-0 tw-text-primary tw-px-0"
              @clicked="apiActionLocal.dummyHeaders.push({ name: null, value: null })">
              <PlusIcon size=14 class="tw-inline" /> Add Header
            </AGButton>
          </div>
          <div class="tw-col-span-12 tw-px-2 tw-mb-2" v-if="apiActionLocal.method != 'GET'">
            <div class="tw-text-sm tw-font-semibold">Body</div>
            <AGInput label="Name" placeholder="Body" class="tw-mb-1" v-model:value="apiActionLocal.body" textArea=true
              rows=10 />
          </div>
          <div class="tw-col-span-12 tw-px-2 tw-mb-2 tw-ml-[-10px]" v-if="apiActionLocal.method === 'GET'">
            <q-toggle v-model="apiActionLocal.open_in_new_tab" color="primary" label="Open in new tab" />
          </div>
        </div>

      </template>
      <template #footer>

        <div class="tw-grid tw-grid-cols-12">
          <div class="tw-col-start-11 tw-col-span-2 tw-p-2 tw-text-right">

            <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2" @clicked="$emit('update:open', false)">
              Cancel
            </AGButton>

            <AGButton class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary tw-ml-2" @clicked="save"
              v-if="apiActionLocal.id">
              Save
            </AGButton>
            <AGButton class="tw-text-white hover:tw-bg-primary/80 tw-bg-primary" @clicked="save"
              v-if="!apiActionLocal.id">
              Create
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
import AGInput from 'components/base/input.vue'
import AGButton from 'components/base/button.vue'

import AGModal from 'components/utils/modal.vue'
import BoxSelect from 'components/base/boxSelect.vue';
import ColorSelect from 'components/base/colorSelector.vue'

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-dracula';

import { PlusIcon } from 'vue-tabler-icons'

import { defaultColors } from 'src/helpers/colorGenerator'

import { _ } from 'lodash'

const newHeader = { name: null, value: '' }
const newApiAction = {
  name: null,
  method: 'GET',
  color: defaultColors[0],
  url: null,
  headers: { '': null },
  dummyHeaders: [_.cloneDeep(newHeader)],
  open_in_new_tab: false,
  only_current_viz: false,
  question_id: null,
  visualization_id: null,
  loading_message: 'Running API Action'
}
export default {
  name: 'ApiActionLink',
  props: ['link', 'row', 'columns', 'queryKey', 'open', 'questionID', 'visualizationID', 'apiAction'],
  components: { AGModal, AGInput, BoxSelect, ColorSelect, AGButton, PlusIcon },
  data() {
    return {
      escapedText: '{{ column_name }}',
      loading: false,
      contentType: 'json',
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(item => {
        return { name: item, value: item }
      }),
      apiActionLocal: this.apiAction ? _.cloneDeep(this.apiAction) : _.cloneDeep(newApiAction),
      error: null
    }
  },

  watch: {
    headers: {
      deep: true,
      handler() {
        let dummyHeaders = []
        Object.entries(this.headers).forEach(header => {
          dummyHeaders.push({ name: header[0], value: header[1] })
        })
        this.apiActionLocal.dummyHeaders = dummyHeaders
      }
    },
    apiActionLocal: {
      deep: true,
      handler() {
        if (this.apiActionLocal.question_id === null ) {
          this.apiActionLocal.question_id = this.questionID
        }
      }
    }

  },

  computed: {
    loadingMessage(){
      if (this.apiActionLocal && this.apiActionLocal.id){
        return 'Saving API Action'
      }
      return 'Creating API Action'

    },
    headers() {
      return this.apiActionLocal.headers
    },
    availability: {
      get() {
        return !(this.apiActionLocal.visualization_id === null)
      },
      set(value) {
        if (value) {
          this.apiActionLocal.visualization_id = this.visualizationID
          return
        }
        this.apiActionLocal.visualization_id = null
      }
    },
    errorMessage() {
      if (this.error && this.error.errors) {
        let errorMessages = {}
        this.error.errors.forEach((error) => {
          errorMessages[error.source.pointer.replace('/data/attributes/', '')] = error.detail
        })
        return errorMessages
      }
      return {}
    }
  },

  methods: {
    save() {
      const query = queryStore().get(this.queryKey)
      this.apiActionLocal.headers = {}
      this.apiActionLocal.dummyHeaders && this.apiActionLocal.dummyHeaders.forEach((item) => {
        this.apiActionLocal.headers[item.name] = item.value 
      })
      const actionPayload = { data: { type: "api-actions", attributes: this.apiActionLocal } }
      let url = 'api_actions'
      this.loading=true
      if (this.apiActionLocal.id) {
        url = 'api_actions/' + this.apiActionLocal.id

        api.put(url, actionPayload, apiConfig(query.token)).then((response) => {
          this.loading = false
          this.$emit('update:apiAction')
          this.$emit('update:open', false)
        }).catch(error => {
          this.loading = false
          this.error = error.response.data
        })
        return

      }

      api.post(url, actionPayload, apiConfig(query.token)).then((response) => {
        this.loading = false
        this.$emit('update:apiAction')
        this.$emit('update:open', false)
      }).catch(error => {
        this.loading = false
        this.error = error.response.data
      })

    }
  }
}
</script>
