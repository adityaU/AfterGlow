<template>
  <div class="tw-w-full">
    <div class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-sm tw-shadow-sm tw-w-full tw-p-4 tw-border ">
      <div class="label tw-mt-2" >Maximum Number of Rows on frontend</div>
      <AGInput v-model:value="frontendLimitSettings.value" v-if="frontendLimitSettings" placeholder="How many rows can members see on frontend ?" type="number" debounce=300 />
      <div class="note"> Limit more than 2000 is ignored. This limit overrides Global Limit for frontend. </div>
    </div>
  </div>
</template>
<script>

import AGInput from "components/base/input.vue"
import {fetchSettings, saveSettings} from 'src/apis/settings'
export default {
  name: "AGSettingsFrontendConfiguration",
  components: {AGInput},

  watch: {
    frontendLimitSettings: {
      deep: true,
      handler(){
        if (this.frontendLimitSettings?.id){
          saveSettings(this.frontendLimitSettings, () => {'pass'})
        }
      }
    },

  },

  data(){
    return {
      frontendLimitSettings: null
    }
  },

  mounted(){
    fetchSettings(this.setSettings)
  },
  methods: {
    setSettings(settings, _loading){
      settings?.forEach(s => {
        if (s.name === 'MAX_FRONTEND_LIMIT'){
          this.frontendLimitSettings = s
        }
      })
    },
  }
}
</script>
