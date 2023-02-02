<template>
  <div>
    <div class="tw-py-2 tw-px-2">

      <BoxSelect :options="datetimeValueTypes" :selected="valueLocal.type" class="tw-text-center" isTab=true
        @selected="(val) => (valueLocal.type = val || true) && setDateTimeValueValue()" v-if="!type" />
      <div class="" v-if="!type && valueLocal.type === 'duration'" >
        <div class="tw-py-2">
          <AGInput :value="valueLocal.value.durationValue"
            @inputed="(val) => valueLocal.value.durationValue = val"
            type="number" ref="option_0" placeholder="30" />
          <BoxSelect :options="durationTypeOptions" class="tw-max-w-[400px]"
            :selected="valueLocal.value.durationType"
            @selected="(val) => valueLocal.value.durationType = val" />
          <BoxSelect :options="durationTenseOptions"
            :selected="valueLocal.value.durationTense"
            @selected="(val) => valueLocal.value.durationTense = val" />
        </div>
      </div>
      <div class="tw-inline-flex tw-mt-2" v-if="(valueLocal.type === 'datepicker') || type ">
        <q-date class="!tw-mr-1" flat=true v-model="valueLocal.value" :mask="datetimeFormat" color="primary" v-if="showDate" />
        <q-time class="!tw-ml-1" flat=true v-model="valueLocal.value" :mask="datetimeFormat" color="primary" v-if="showTime" />
      </div>
      <div class="tw-flex tw-justify-end tw-border-t tw-pt-2">
        <AGButton class="tw-border-primary tw-bg-primary tw-text-white hover:tw-bg-primary/80" @click="$emit('update:value', valueLocal)" v-close-popup>Done</AGButton>
      </div>
    </div>
  </div>
</template>

<script>
import AGInput from 'components/base/input.vue'
import AGButton from 'components/base/button.vue'
import BoxSelect from 'components/base/boxSelect.vue'
import {datetimeFormat} from 'src/mixins/filterMixins'
import {formatDatetime} from 'src/helpers/datetimeFormatting'
import cloneDeep from 'lodash/cloneDeep';

import { date } from 'quasar'

const newDatePickerValue = {
  type: "duration",
  value: {
    durationValue: 30,
    durationType: 'days',
    durationTense: 'ago' 
  }
}
export default {
  name: "AGDatePicker",
  props: ["value", "displayText",  "type"],
  components: { AGInput, BoxSelect, AGButton},
  watch: {
    displayTextLocal(){
      this.$emit('update:displayText', this.displayTextLocal)
    },
    valueLocal: {
      deep: true, 
      handler(){
        const date = this.makeValue()
        this.$emit('update:value', date )
        this.$emit('update:displayText', this.displayTextLocal)
      }
    }
  },

  computed: {
    showDate(){
      if (!this.type) {return true}
      if (this.type != 'time') {return true}
      return false
    },
    showTime(){
      if (!this.type) {return true}
      if (this.type != 'date') {return true}
      return false
    },
    displayTextLocal(){
      return this.makeDisplayText(this.valueLocal)
    },
    datetimeFormat(){
      return this.findDatetimeFormat(this.type)
    }
  },

  data(){

    const valueLocal =  this.makeValueLocal()
    this.$emit('update:displayText', this.makeDisplayText(valueLocal))
    return {
      datetimeValueTypes: ['duration', 'datepicker'].map((item) => { return { name: item, value: item } }),
      durationTypeOptions: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'].map((item) => { return { name: item, value: item } }),
      durationTenseOptions: ['ago', 'later'].map((item) => { return { name: item, value: item } }),
      valueLocal: valueLocal,
    }
  },

  methods: {
    findDatetimeFormat(type){
      if (type === 'date'){ return 'MMM DD, YYYY'}
      return datetimeFormat

    },
    makeDisplayText(valLocal){
      const val = valLocal 
      if (val.type == 'duration'){
        if (val.value.durationValue && val.value.durationType && val.value.durationTense) {
          return `${val.value.durationValue} ${val.value.durationType} ${val.value.durationTense}`
        }
        return 
      }
      return val.value
    },
    makeValue(){
      if (!this.type){
        return this.valueLocal 
      }

      const d = date.extractDate(this.valueLocal.value, this.datetimeFormat)
      return formatDatetime(d, 'ISO')
    },
    makeValueLocal(){
      if (!this.type){
        return this.value ? cloneDeep(this.value) : cloneDeep(newDatePickerValue)
      }
      let val = cloneDeep(this.value)
      if (val && (typeof(val) === 'string') && !val.match(/[z,Z]$/)){
        val = val + 'Z'
      }
      return cloneDeep({value: formatDatetime(val, this.findDatetimeFormat(this.type))})
    },
    setDateTimeValueValue() {
      if (this.valueLocal.type === 'duration') {
        this.valueLocal =  cloneDeep(newDatePickerValue)
      } else {
        this.valueLocal = {
          type: 'datepicker',
          value: formatDatetime(new Date(), this.datetimeFormat)
        }
      }

    },
  }
}
</script>
