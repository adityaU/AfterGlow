<template>
  <div class="tw-text-primary tw-font-semibold tw-p-2 tw-border-b">Variables</div>

  <AGStagedContainer :stages="stages" :currentStage="currentStage">
    <template #header>
      <div class="tw-p-2 tw-text-primary  tw-flex tw-items-center tw-gap-2" v-if="currentStage == 1">
        <div class="tw-flex tw-items-center tw-gap-2 tw-flex-1"  >

          <ArrowLeftIcon size="16" class="tw-cursor-pointer" @click="((currentStage = 0) || true) && ((editingSettingName = null) || true) && ((editingSetting = null) || true)" /> 
          <div class="tw-text-primary tw-font-semibold" @click="((currentStage = 0) || true) && ((editingSettingName = null) || true) && ((editingSetting = null) || true)">{{editingSettingName}}</div>
        </div>
      </div>
    </template>

    <template #S2>
      <div class="tw-p-2 tw-pl-8">
        <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap"> 
          <div class="label tw-w-[30%]" >
            Text Color: 
          </div>
          <AGColorSelector naked=true v-model:selectedColor="editingSetting.textColor" :additionalColors="additionalBackgroundColors" />
        </div>
        <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap"> 
          <div class="label tw-w-[30%]" >
            Background Color: 
          </div>
          <AGColorSelector naked=true v-model:selectedColor="editingSetting.backgroundColor" :additionalColors="additionalBackgroundColors" />
        </div>
        <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap"> 
          <div class="label tw-w-[30%]" >
            Border Color: 
          </div>
          <AGColorSelector naked=true v-model:selectedColor="editingSetting.borderColor" :additionalColors="additionalBackgroundColors" />
        </div>
        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Border Thickness: 
          </div>
          <q-slider class="tw-px-1" v-model="editingSetting.borderThickness" step="1" :min="0" :max="15" color="primary" label />
        </div>
        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Font Size: 
          </div>
          <q-slider class="tw-px-1" v-model="editingSetting.fontSize" step="0.125" :min="0.5" :max="4" color="primary" label />
        </div>

        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Font Weight: 
          </div>
          <BoxSelect class="tw-px-0"  v-model:selected="editingSetting.fontWeight" :options="fontWeightOptions" />
        </div>
        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Padding X: 
          </div>
          <q-slider class="tw-px-1" v-model="editingSetting.paddingX" step="0.125" :min="0.5" :max="4" color="primary" label />
        </div>
        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Padding Y: 
          </div>
          <q-slider class="tw-px-1" v-model="editingSetting.paddingY" step="0.125" :min="0.5" :max="4" color="primary" label />
        </div>
        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Icon: 
          </div>
          <AGIconSelector v-model:selected="editingSetting.icon" />
        </div>
        <div class="tw-flex tw-items-center  tw-mb-2 item-3070-columns">
          <div class="label" >
            Hide Text: 
          </div>
          <AGBool v-model:val="editingSetting.iconOnly"/>
        </div>
      </div>
    </template>
    <template #S3>
      Visualization list
    </template>
    <template #S1>
      <div class="tw-flex tw-flex-col">
        <div class="tw-pb-1">
          <template v-for="vp in variablePanes" :key="vp">
            <div class="tw-flex tw-px-2 tw-py-1 tw-items-center tw-border-b">
              <div class="tw-flex tw-gap-2 tw-flex-1 tw-items-center tw-cursor-pointer" @click="vp.displayShow = !vp.displayShow">
                <ChevronDownIcon v-if="vp.displayShow"  size=16 />
                <ChevronRightIcon v-if="!vp.displayShow" size=16 />
                {{vp.additionalParams.name}}
              </div>
              <EyeIcon size=16 v-if="vp.show" class="tw-stroke-primary tw-cursor-pointer" @click="vp.show = !vp.show" />
              <EyeOffIcon class="tw-cursor-pointer" size=16 v-if="!vp.show" @click="vp.show = !vp.show" />
            </div>
            <template v-if="vp.displayShow">
              <div class="tw-flex tw-pr-2 tw-py-1 tw-pl-4 tw-items-center tw-border-b" v-for="v in possibleVariables" :key="v" >
                <div class="tw-flex tw-flex-1 tw-gap-2">
                  <VariableIcon class="icon-primary" /> 
                  {{v.name}}
                </div>
                <EyeIcon class="tw-stroke-primary tw-cursor-pointer" size=16 v-if=" index(vp, v.name) >= 0" @click="removeFromList(vp, v.name)" />
                <EyeOffIcon class="tw-cursor-pointer" size=16 v-if="index(vp, v.name) < 0" @click="addToList(vp, v)" />
              </div>
              <div class="tw-flex tw-pr-2 tw-py-1 tw-pl-4 tw-items-center tw-border-b" >
                <div class="tw-flex tw-flex-1 tw-gap-2 tw-items-center">
                  <ClearAllIcon class="icon-primary tw-bg-red-700" /> 
                  <div>
                    <div class="tw-border tw-leading-4 tw-rounded-sm tw-px-2 tw-py-0.5 tw-cursor-pointer"> {{vp.additionalParams.clearButtonName}} </div>

                    <q-menu flat=true transition-show="jump-down" transition-hide="jump-up" max-height="400px"
                      class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                      @show="menuShow" @keydown="onKeydown" fit>
                      <AGInput placeholder="Enter Clear Button Name" v-model:value="vp.additionalParams.clearButtonName" debounce=300 />
                    </q-menu>
                  </div>
                </div>
                <BaselineIcon class="tw-stroke-primary tw-cursor-pointer" size=16 @click="((currentStage = 1) || true) && (editingSettingName = 'Clear Button') && (editingSetting = vp.additionalParams.clearButtonFormatting)" />
                <EyeIcon class="tw-stroke-primary tw-cursor-pointer" size=16 v-if="vp.additionalParams.showClearButton" @click="vp.additionalParams.showClearButton = false" />
                <EyeOffIcon class="tw-cursor-pointer" size=16 v-if="!vp.additionalParams.showClearButton" @click="vp.additionalParams.showClearButton = true" />
              </div>
              <div class="tw-flex tw-pr-2 tw-py-1 tw-pl-4 tw-items-center tw-border-b" >
                <div class="tw-flex tw-flex-1 tw-gap-2 tw-items-center">
                  <ArrowBackUpIcon class="icon-primary tw-bg-red-700" /> 
                  <div>
                    <div class="tw-border tw-leading-4 tw-rounded-sm tw-px-2 tw-py-0.5 tw-cursor-pointer"> {{vp.additionalParams.resetButtonName}} </div>

                    <q-menu flat=true transition-show="jump-down" transition-hide="jump-up" max-height="400px"
                      class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                      @show="menuShow" @keydown="onKeydown" fit>
                      <AGInput placeholder="Enter Reset Button Name" v-model:value="vp.additionalParams.resetButtonName" debounce=300 />
                    </q-menu>
                  </div>
                </div>
                <BaselineIcon class="tw-stroke-primary tw-cursor-pointer" size=16 @click="((currentStage = 1) || true) && (editingSettingName = 'Reset Button') && (editingSetting = vp.additionalParams.resetButtonFormatting)" />
                <EyeIcon class="tw-stroke-primary tw-cursor-pointer" size=16 v-if="vp.additionalParams.showResetButton" @click="vp.additionalParams.showResetButton = false" />
                <EyeOffIcon class="tw-cursor-pointer" size=16 v-if="!vp.additionalParams.showResetButton" @click="vp.additionalParams.showResetButton = true" />
              </div>
              <div class="tw-flex tw-pr-2 tw-py-1 tw-pl-4 tw-items-center tw-border-b" >
                <div class="tw-flex tw-flex-1 tw-gap-2 tw-items-center">
                  <RefreshIcon class="icon-primary tw-bg-red-700" /> 
                  <div>
                    <div class="tw-border tw-leading-4 tw-rounded-sm tw-px-2 tw-py-0.5 tw-cursor-pointer"> {{vp.additionalParams.buttonName}} </div>

                    <q-menu flat=true transition-show="jump-down" transition-hide="jump-up" max-height="400px"
                      class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                      @show="menuShow" @keydown="onKeydown" fit>
                      <AGInput placeholder="Enter Refresh Button Name" v-model:value="vp.additionalParams.buttonName" debounce=300 />
                    </q-menu>
                  </div>
                </div>
                <BaselineIcon class="tw-stroke-primary tw-cursor-pointer" size=16 @click="((currentStage = 1) || true) && (editingSettingName = 'Refresh Button') && (editingSetting = vp.additionalParams.refreshButtonFormatting)" ></BaselineIcon>
                <EyeIcon class="tw-stroke-primary tw-cursor-pointer" size=16 v-if="vp.additionalParams.showRefreshButton" @click="vp.additionalParams.showRefreshButton = false" />
                <EyeOffIcon class="tw-cursor-pointer" size=16 v-if="!vp.additionalParams.showRefreshButton" @click="vp.additionalParams.showRefreshButton = true" />
              </div>
            </template>
          </template >
              <div class="tw-font-semibold tw-text-primary tw-p-2" @click="addVariablePane" > + Add Another Variable Row </div>
        </div>
      </div>
    </template>
  </AGStagedContainer>
</template>

<script>
import {randomID} from 'src/helpers/random'
import AGStagedContainer from 'components/base/stagedContainer.vue'
import AGColorSelector from 'components/base/colorSelector.vue'
import AGIconSelector from 'components/base/iconSelector.vue'
import BoxSelect from 'components/base/boxSelect.vue'
import AGBool from 'components/base/bool.vue'
import {fetchPossibleVariables, fetchVariables, addVariable, deleteVariable} from 'src/apis/dashboards'
import {EyeIcon, EyeOffIcon, VariableIcon, ChevronDownIcon, ChevronRightIcon, RefreshIcon, BaselineIcon, ArrowLeftIcon, ArrowBackUpIcon, ClearAllIcon} from 'vue-tabler-icons'
import cloneDeep from 'lodash/cloneDeep'
import AGInput from 'components/base/input.vue'

import {newVariablePane} from 'src/helpers/variables'


import {createApp, h} from 'vue'
export default {
  name: "AGVariablePane",
  props: ['dashboard'],
  components: {
    EyeOffIcon, EyeIcon, VariableIcon, ChevronRightIcon, ChevronDownIcon, RefreshIcon, BaselineIcon, ArrowLeftIcon, ArrowBackUpIcon, ClearAllIcon, AGInput, AGStagedContainer,
    AGColorSelector, BoxSelect, AGIconSelector, AGBool
  },

  watch: {
    variablePanes: {
      deep: true,
      handler(){
        let variablePanes = cloneDeep(this.variablePanes)
        variablePanes = this.variablePanes.filter(vp => vp.show)
        this.$emit('addVariablePane', variablePanes)
      }
    }
  },

  mounted(){
    this.loading = true
    fetchPossibleVariables(this.dashboard.id, (variables, loading)=> {
      this.possibleVariables = variables
      this.saveToVariableMap(variables)
      if (this.dashboard.variables?.data?.length > 0){
        this.loading = loading
        fetchVariables( this.dashboard.variables.data.map(v => v.id), (variables, loading) => {
          this.existingVariables = variables
          this.saveToVariableMap(variables)
          this.loading = loading
        })
      }
    })
  },

  data(){
    const varPanes = this.dashboard?.settings?.widgets?.filter(w => w.type === 'variablePane').map(vp => {
      vp.show = true 
      return vp
    }) || []
    return {
      variablePanes: varPanes.length > 0 ? varPanes : [newVariablePane([])] ,
      possibleVariables: [],
      existingVariables: [],
      variablesMap: {},
      additionalBackgroundColors: ['transparent',"white", "#6e7687", "#f5f7fb", "#e5e7eb"],
      fontWeightOptions: ['normal', 'semibold', 'bold'].map(v => {
        return {name: v, value: v}
      }),
      currentStage: 0,
      stages: [{name: "S1"}, {name: "S2"}]
    }
  },
  methods: {
    index(vp, name){
      return vp.additionalParams.variableIDs.map(id => this.variablesMap[id]).map(v => v && v.name).indexOf(name)
    },
    saveToVariableMap(variables){
      variables && variables.forEach(v => {
        this.variablesMap[v.id.toString()] = v
      })
    },
    addToList(vp, v){
      addVariable(v, this.dashboard.id, (variable, _loading) => {
        if (variable){
          this.saveToVariableMap([variable])
          vp.additionalParams.variableIDs.push(variable.id)
        }

      })
    },

    removeFromList(vp, name){
      const index = this.index(vp, name)
      const id = vp.additionalParams.variableIDs[index]
      deleteVariable(id, (deleted , _)=> {
        deleted && vp.additionalParams.variableIDs.splice(index, 1) 
      })
    },

    addVariablePane(){
      this.variablePanes.push(newVariablePane(this.variablePanes))
    }

  },
}
</script>
