<template>
  <a href="#" :style="{ 'color': link.details.color }" @click="sendRequest">
    {{ format(link.value) }}
  </a>
  <Teleport to="body">
    <AGModal v-model:show="open" :loading="loading" :loadingMessage="link.details.loading_message">
      <template #header>
        <div class="tw-p-2 tw-text-2xl">
          Response
        </div>
      </template>
      <template #body>
        <v-ace-editor :value="response.response_body" @init="editorInit" :lang="contentType" theme="dracula" readonly
          min-lines=2 max-lines=35 />
      </template>
      <template #footer>

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

import { VAceEditor } from 'vue3-ace-editor';
import AGModal from 'components/utils/modal.vue'

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-dracula';
export default {
  name: 'ApiActionLink',
  props: ['link',  'queryKey'],
  components: { AGModal, VAceEditor },
  data() {
    return { open: false, loading: false, contentType: 'json' }
  },

  computed: {
    variables(){
      const query = queryStore().get(this.queryKey)
      const payload = query && query.payload
      let variables = payload && payload.variables && payload.variables.map(v => {
        return { name: v.name, value: v.value }
      }) || []

      this.link.vars.cols && this.link.vars.cols.forEach((c, i) => {
          variables.push({ name: c, value: this.link.vars.row && this.link.vars.row[i] })
      })

      return variables
    }
  },

  methods: {
    format(name){
      this.variables.forEach((v) => {
        const r = new RegExp(`{{ *${v.name} *}}`, 'g')
        name = name.replace(r, v.value) 
      }) 
      return name
    },
    sendRequest() {
      this.open = false

      const query = queryStore().get(this.queryKey)
      let variables = this.variables


      const actionPayload = { variables: variables, api_action: this.link.details }
      let url = 'api_actions/send_request'
      if (this.link.details.id) {
        url = 'api_actions/' + this.link.details.id + '/send_request'
      }
      this.loading = true
      this.open = true
      api.post(url, actionPayload, apiConfig(query.token)).then((response) => {

        if (response.data.redirect_url) {
          window.open(response.data.redirect_url, '_blank');
          // this.loading = false
          this.open = false
          return
        }
        if (response.data.response_headers) {
          if (response.data.response_headers['Content-Type'].match('html')) {
            this.contentType = 'html'
          }
          if (response.data.response_headers['Content-Type'].match('json')) {
            this.contentType = 'json'
          }
          if (response.data.response_headers['Content-Type'].match('xml')) {
            this.contentType = 'xml'
          }

        }
        this.loading = false
        this.response = response.data
      }).catch(error => {
        this.loading = false
        this.response = error.data
      })

    }
  }
}
</script>
