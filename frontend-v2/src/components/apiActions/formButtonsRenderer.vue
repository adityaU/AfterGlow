<template>
  <div class="tw-p-2">
    <div class="body tw-relative " :style="containerStyle">
      <template v-for="field in form.fields" :key="field">
        <template v-if="field.show && (field.type === 'Button')">
          <div class="tw-flex tw-items-center tw-absolute" :style="fieldStyle(field)" >
            <template  v-if="field.type === 'Button'" >
              <AGButton class="tw-w-full tw-h-full" :style="{color: field.rendererConfiguration.textColor, 'background-color' : field.rendererConfiguration.backgroundColor}" 
                @click="reset()" v-if="field.originalName === 'cancel'" >
                {{field.label}} </AGButton>
              <AGButton class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center" :class="!validForm ? 'tw-opacity-50 tw-cursor-not-allowed' : ''" :style="{color: field.rendererConfiguration.textColor, 'background-color' : field.rendererConfiguration.backgroundColor}" 
                v-if="field.originalName === 'submit'" >
                <AGApiActionLink :variables="variablesWithFormData" :link="strippedLink" :queryKey="queryKey" v-if="validForm" /> 
                <div class="" v-if="!validForm">{{field.label}}</div>
              </AGButton>
            </template>
          </div>
        </template>

      </template>
    </div>
  </div>
</template>

<script>

import AGApiActionLink from 'components/apiActions/link.vue'
import AGButton from 'components/base/button.vue'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "AGFormButtons",
  props: ['form', 'show', 'apiAction', 'queryKey', 'outputForm', 'variables', 'validForm'],
  components: {AGButton, AGApiActionLink},
  computed:{
    variablesWithFormData(){
      let vars = cloneDeep(this.variables) || []
      if (!this.outputForm) { return vars}
      Object.entries(this.outputForm).forEach(v => {
        vars.push({name: `form:${v[0]}`, value: v[1]})
      })
      return vars
    },
    strippedLink(){
      const submitButtons = this?.form?.fields?.filter(f => (f.originalName === 'submit') && (f.show))  
      const field = submitButtons?.length > 0 ? submitButtons[0] : null  
      if (!this.apiAction) { return null}
      let link = cloneDeep(this.apiAction) 
      link.details.display_settings.renderForm = false
      link.details.name = field && field.label
      link.value = field && field.label
      link.formattingSettings = null
      link.details.color = 'inherit'
      return link
    },
    containerStyle(){
      let maxH = 0
      this.form.fields.forEach(f => {
        if ((f.y + f.h) > maxH && (f.type === "Button")){
          maxH = f.y + f.h
        }
      })

      return {height: (maxH*5) + 'px'}
    },
  },
  methods: {
    reset(){
      this.$emit('reset')
      this.$emit('update:show', false)
      return
    },

    fieldStyle(field){
      if (!field){ return field}
      return {
        width: 100*(field.w/512) + "%",
        height: (field.h * 5) + 'px',
        left: 100*(field.x/512) + "%",
        top: (field.y*5) + 'px'
      } 
    }
  }

}
</script>
