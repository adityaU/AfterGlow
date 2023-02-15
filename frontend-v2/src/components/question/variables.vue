<template>
  <div class="tw-flex-1 tw-flex">
    <template v-for="variable in variablesLocal" :key="variable">
      <div class="tw-flex tw-items-center tw-m-1"> 
        <div class="tw-flex tw-items-center tw-cursor-pointer tw-leading-4">
          <div class="tw-flex ">
            <div class="tw-bg-primary/90 tw-text-white tw-px-2 tw-py-1 tw-rounded-l-sm">{{variable.name}}</div>
            <div class="tw-bg-primary tw-text-white tw-px-2 tw-py-1 tw-rounded-r-sm" :class="currentUser.canEditQuestion ? '' : 'tw-rounded-sm'"  v-if="variable.var_type === 'String' || variable.var_type === 'Integer' " >{{variable.value != null ? variable.value : variable.default}}</div>
            <AGDatetimePicker class="tw-bg-primary tw-text-white tw-px-2 tw-py-1 tw-rounded-r-sm tw-border-0" v-model:value=variable.value type="datetime" :clearCount="variable.clearCount" v-if="variable.var_type === 'Date'"/>
            <q-menu flat=true transition-show="jump-down" transition-hide="jump-up" max-height="400px"
              class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
              @show="menuShow" @keydown="onKeydown" fit  v-if="variable.var_type === 'String' || variable.var_type === 'Integer' " >
              <AGInput :placeholder="'Enter ' +  variable.name " v-model:value="variable.value" />
            </q-menu>
          </div>
        </div>
        <div class="tw-rounded-r-sm tw-bg-primary/60 tw-py-1 tw-px-2 tw-cursor-pointer" v-if="currentUser.canEditQuestion" @click="(openVariableEditingModal = true) && (editingVariable = variable)" >
          <EditIcon size="16" class="tw-stroke-white" />
        </div>
      </div>
    </template>
    <AGVariableEditingModal v-model:open="openVariableEditingModal" v-model:variable="editingVariable" @done="variableEditDone" />
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue'
import AGDatetimePicker from 'components/base/inputDatePicker.vue'
import AGVariableEditingModal from 'components/question/variableEditingModal.vue'

import {EditIcon} from 'vue-tabler-icons'
import {currentUserStore} from 'stores/currentUser'
import {randomID} from 'src/helpers/random'

const currentUser = currentUserStore()
import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'
export default {
  name: 'AGQuestionVariables',
  components: {AGDatetimePicker, AGInput, EditIcon, AGVariableEditingModal},
  props: ['variables', 'code'],



  watch: {
    code(){
      this.setUpVariables()
    },

    variables: {
      deep: true,
      handler(newv, oldv ){
        if (!isEqual(oldv, newv)){
          this.variablesLocal = this.variables
        } 
      }
    },

    variablesLocal: {
      deep: true,
      handler(newv, oldv ){
        if (!isEqual(oldv, newv)){
          this.$emit('update:variables', this.variablesLocal)
        } 
      }
    },
  },

  data() {
    return {
      variablesLocal: this.variables || [],
      currentUser: currentUser,
      openVariableEditingModal: false,
      editingVariable: null
    }
  },
  methods: {
    variableEditDone(){
      this.variablesLocal = this.variablesLocal.filter(v => v.id != this.editingVariable.id)
      this.variablesLocal.push(this.editingVariable)
    },
    setUpVariables(){

      debounce( () => {
        if (!this.code){
          return 
        }
        const matches = this.code.match(/{{\W*.+?\W*}}/g)

        let allVariables = []
        const variableNames = this.variablesLocal.map(v => v.name)


        matches?.forEach(m => {
          const varName = m.replaceAll('{', "").replaceAll('}', "").trim()
          allVariables.push(varName)
          if (variableNames.indexOf(varName) < 0){
            const generatedID = randomID() * 1000000000
            console.log(generatedID, "Generated_ID")
            this.variablesLocal.push({
              name: varName,
              id: generatedID,
              var_type: 'String',
              default: '0',
            })
          }
        })

        variableNames.forEach((v, i) => {
          if (allVariables.indexOf(v) < 0){
            this.variablesLocal.splice(i, 1)
          }
        })

      }, 500)()


    }
  }
}
</script>
