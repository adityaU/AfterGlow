<template>

  <div class="body tw-relative " :style="containerStyle">
    <template v-for="field in form.fields" :key="field">
      <template v-if="field.show && (field.type != 'Button')">
        <div class="tw-flex tw-items-center tw-absolute" :style="fieldStyle(field)" >
          <div class="tw-w-full tw-h-full" v-if="field.type === 'Field'">
          <div class="tw-flex tw-items-center item-3070-columns tw-w-full tw-px-2  tw-flex-1"  >
            <div class="label">
              {{field.label}}
            </div>
            <component :is="inputTypesRendererMapping[field.inputType]"
              v-bind="field.rendererConfiguration"
              :value="displayValues[field.label]"
              :selected="displayValues[field.label]"
              @update:selected="val => updateFormValues(field, val)"
              @update:value="val => updateFormValues(field, val)"
              :key="formValues" />
          </div>
          <div class="note tw-ml-[30%] tw-pl-1" v-if="field.helpText">{{field.helpText}}</div>
          <div class="note tw-ml-[30%] tw-text-red-700 tw-pl-1" v-if="errorValues[field.label]">{{errorValues[field.label]}}</div>
          </div>

          <div class="tw-flex tw-items-center tw-w-full " v-if="field.type === 'Note'" >
            <AGNote v-model:id=field.noteID :queryKey="queryKey" />
          </div>
          <template  v-if="field.type === 'Divider'" >
            <template v-if="field.rendererConfiguration.orientation === 'horizontal'">
              <div class="tw-flex tw-items-center tw-w-full">
                <div class="tw-flex-1" :style="{'border-top': `1px solid ${field.rendererConfiguration.color}`, height: '1px', width: '100%'}"></div>
              </div>
            </template>
            <template v-if="field.rendererConfiguration.orientation === 'vertical'">
              <div class="tw-flex tw-justify-center tw-w-full tw-h-full">
                <div :style="{'border-left': `1px solid ${field.rendererConfiguration.color}`, width: '1px', height: '100%'}"></div>
              </div>
            </template>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import {inputTypesRendererMapping} from 'src/helpers/formConfig'
import AGNote from 'components/widgets/note.vue'
export default {
  name: "AGForm",
  props: ['form', 'submitLink', 'variables', 'outputForm', 'queryKey', 'validForm'],
  components: {AGNote},

  watch: {
    validFormLocal(){
      this.$emit('update:validForm', this.validFormLocal)
    },
    displayValues: {
      deep: true,
      handler(){
        this.$emit('update:outputForm', this.displayValues)
      }
    }
  },

  created(){
    this.$emit('update:outputForm', this.displayValues)
    this.$emit('update:validForm', this.validFormLocal)
  },


  computed: {
    errorValues(){
      this.displayValues
      const values = {}
      this.form.fields.forEach(f => {
        if ((f.type === 'Field') && f.show){
          values[f.label] = this.errorValue(f, this.formValues)
        }
      })
      return values
    },
    validFormLocal(){
      if (!this.errorValues) {return true} 
      const errors = Object.entries(this.errorValues).filter(v => v[1])
      if (errors.length > 0){return false}
      return true
    },
    displayValues(){
      this.updateDisplayValues
      const values = {}
      this.form.fields.forEach(f => {
        if ((f.type === 'Field') && f.show){
          values[f.label] = this.displayValue(f, this.formValues)
        }
      })
      return values
    },
    variablesMapping(){
      const vars = {}
      this.variables && this.variables.forEach(v => {
        vars[v.name] = this.isObject(v.value) ?  JSON.stringify(v.value, null, 2) : v.value
      })
      return vars
    },
    containerStyle(){
      let maxH = 0
      this.form.fields.forEach(f => {
        if ((f.y + f.h) > maxH && (f.type != "Button") && f.show){
          maxH = f.y + f.h
        }
      })

      return {height: (maxH*5) + 'px'}
    },
  },

  data(){
    return {
      inputTypesRendererMapping: inputTypesRendererMapping,
      formValues: {},
      updateDisplayValues: 0,
    }
  },
  methods: {
    errorValue(field, formValues){
      const value = formValues['form:' + field.label] || this.displayValues[field.label]
      if (!value && field.required){
        return `${field.label} is required`
      }
      if (!value) {
        return null
      }
      if (field.rendererConfiguration.validationType === 'email' && !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
        return 'Please enter a valid Email address'
      }

      if (field.rendererConfiguration.validationType === 'url' && !value.match(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)){
        return 'Please enter a valid url'
      }
      if (field.rendererConfiguration.validationType === 'Custom Regex' && !value.match(new RegExp(`${field.rendererConfiguration.validationRegex}`))){
        return field.rendererConfiguration.validationErrorText || 'Validation Failed.'
      }
    },
    displayValue(field, formValues){
      const possibleValue = this.format(field.initialValue, field.originalName)
      const formHasKey = formValues.hasOwnProperty("form:" + field.label)
      if (!formHasKey){
        return possibleValue
      }
      return formValues['form:' + field.label]
    },

    updateFormValues(field, val){
      this.formValues["form:" + field.label] = val
      this.updateDisplayValues += 1
    },
    isObject(val){
      return typeof val === 'object' &&
        !Array.isArray(val) &&
        val !== null
    },
    format(value, colName){
      return value && value.replace(`{{${colName}}}`, this.variablesMapping[colName] || '')
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
