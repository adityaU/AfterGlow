<template>
  <div >
    <div class="tw-flex tw-items-center tw-mb-2 tw-border-b tw-p-2 tw-pl-4">
      <div class="tw-font-semibold tw-text-primary">
        Container Configuration
      </div>
      <div class="tw-text-right tw-flex-1 tw-font-semibold tw-text-primary tw-text-sm">
        <span class="tw-cursor-pointer"  @click="$emit('hide')">hide</span>
      </div>
    </div>
    <div class="tw-pl-4 tw-p-2">

        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Shadow: 
          </div>
          <BoxSelect class="tw-px-0"  v-model:selected="formattingSettingsLocal.shadow" :options="boxShadowOptions" />
        </div>
      <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns" >
        <div class="label" >
          Container Background Color:
        </div>
        <AGColorSelector naked=true v-model:selectedColor="formattingSettingsLocal.backgroundColor" :additionalColors="additionalBackgroundColors" />
      </div>

      <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
        <div class="label" >
          Container Border Position: 
        </div>
        <BoxSelect class="tw-px-0"  v-model:selected="formattingSettingsLocal.borderPosition" :options="borderPositionOptions" multi=true />
      </div>

      <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns" >
        <div class="label" >
          Container Border Color:
        </div>
        <AGColorSelector naked=true v-model:selectedColor="formattingSettingsLocal.borderColor" :additionalColors="additionalBackgroundColors" />
      </div>

      <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
        <div class="label" >
          Container Border Thickness: 
        </div>
        <q-slider class="tw-px-1" v-model="formattingSettingsLocal.borderThickness" step="1" :min="0" :max="10" color="primary" label />
      </div>

      <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
        <div class="label" >
          Container Border Radius: 
        </div>
        <q-slider class="tw-px-1" v-model="formattingSettingsLocal.borderRadius" step="0.125" :min="0" :max="4" color="primary" label  />
      </div>
      <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
        <div class="label" >
          Gap around container: 
        </div>
        <q-slider class="tw-px-1" v-model="formattingSettingsLocal.gapAround" step="0.125" :min="0" :max="10" color="primary" label  />
      </div>

      <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
        <div class="label" >
          Show Header: 
        </div>
        <AGBool v-model:val="formattingSettingsLocal.showHeader"/>
      </div>


      <template v-if="formattingSettingsLocal.showHeader">
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns" >
          <div class="label" >
            Header Background Color:
          </div>
          <AGColorSelector naked=true v-model:selectedColor="formattingSettingsLocal.headerBackgroundColor" :additionalColors="additionalBackgroundColors" />
        </div>
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns" >
          <div class="label" >
            Header Text Color:
          </div>
          <AGColorSelector naked=true v-model:selectedColor="formattingSettingsLocal.headerTextColor" :additionalColors="additionalBackgroundColors" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>

import cloneDeep from 'lodash/cloneDeep'
import BoxSelect from 'components/base/boxSelect.vue'
import AGColorSelector from 'components/base/colorSelector.vue'
import AGBool from 'components/base/bool.vue'

const newDashboardContainerSettings = {
  borderPosition: ['left', 'right', 'top', 'bottom'],
  borderThickness: 1,
  borderRadius: 0.125,
  borderColor: '#e5e7eb',
  shadow: 'small',
  gapAround: 0.125,
  backgroundColor: 'white',
  showHeader: true,
  headerBackgroundColor: 'white',
  headerTextColor: '#6e7687'
}
export default {
  name: 'AGDashbaordContainerSettings',
  props: ['formattingSettings'],
  components: {BoxSelect, AGColorSelector, AGBool},
  watch: {
    formattingSettingsLocal: {
      deep: true,
      handler(){
        this.$emit('update:formattingSettings', this.formattingSettingsLocal)
      }
    }
  },
  data(){
    return {
      formattingSettingsLocal: this.formattingSettings ? {...cloneDeep(newDashboardContainerSettings), ...cloneDeep(this.formattingSettings)} : cloneDeep(newDashboardContainerSettings),
      additionalColors: ["white", "#6e7687", "#f5f7fb", "#e5e7eb"], 
      additionalBackgroundColors: ['transparent',"white", "#6e7687", "#f5f7fb", "#e5e7eb"],
      borderPositionOptions: ['left', 'right', 'top', 'bottom'].map(v => {
        return {name: v, value: v}
      }),
      boxShadowOptions: ['none', 'small', 'medium', 'large', 'extra-large'].map(v => {
        return {name: v, value: v}
      }),

    }
  }
}
</script>
