<template>
  <div>
    <div class="tw-flex tw-gap-2 tw-px-2 tw-py-2 tw-items-center tw-flex-wrap tw-border-b">
      <span class="label tw-whitespace-nowrap">Repeat every</span>
      <AGInput :value="every" @update:value="(value) => $emit('update:every', value)" type="number" class="tw-w-[100px]" min=1 />
      <AGSelect :options="timeUnitOptions" :selected="timeUnit" @update:selected="(value) => $emit('update:timeUnit', value)" class="tw-w-[100px]" canNotDeselect="true" />
    </div>

    <div v-if="timeUnit === 'Day'">
      <div v-for="ddo, index in timeDets[timeUnit]" :key="ddo" class="tw-flex tw-flex-grow-1 tw-gap-1 tw-justify-start tw-items-center tw-p-2 tw-border-b tw-flex-wrap">

        <div class="label">At</div>
        <div class="tw-flex tw-items-center tw-gap-1">
          <span class="label">Hour:</span>
          <AGInput v-model:value="ddo.hour" type="number" min=1 max=12 />
        </div>
        <div class="tw-flex tw-items-center tw-gap-1 tw-ml-3">
          <span class="label">Minute:</span>
          <AGInput v-model:value="ddo.minute" type="number" min=0 max=59 />
        </div>
        <div class="tw-flex tw-items-center tw-gap-1 tw-ml-3">
          <AGSelect v-model:selected="ddo.am" :options="amOptions" canNotDeselect="true"/>
        </div>
        <div class="label tw-text-red-700 tw-p-2 tw-cursor-pointer tw-ml-auto" @click="deleteFrom(timeDets[timeUnit], index)" v-if="timeDets[timeUnit].length != 1">Remove</div>
      </div>
      <div class="label tw-text-primary tw-p-2 tw-cursor-pointer" @click="addNew('Day')">Add More</div>
    </div>

    <div v-if="timeUnit === 'Week'" class="tw-p-2">
      <div v-for="ddo, index in timeDets[timeUnit]" :key="ddo">
        <div class="label">On</div>
        <BoxSelect :options="dayOfWeekOptions" v-model:selected="ddo.day" />
        <div class="tw-flex tw-flex-grow-1 tw-gap-1 tw-justify-start tw-items-center tw-p-2 tw-border-b">
          <div class="label tw-px-2">At</div>
          <div class="tw-flex tw-items-center tw-gap-1">
            <span class="label">Hour:</span>
            <AGInput v-model:value="ddo.hour" type="number" min=0 max=12 />
          </div>
          <div class="tw-flex tw-items-center tw-gap-1 tw-ml-3">
            <span class="label">Minute:</span>
            <AGInput v-model:value="ddo.minute" type="number" min=0 max=59 />
          </div>
          <div class="tw-flex tw-items-center tw-gap-1 tw-ml-3">
            <AGSelect v-model:selected="ddo.am" :options="amOptions" canNotDeselect="true"/>
          </div>
          <div class="label tw-text-red-700 tw-p-2 tw-cursor-pointer tw-ml-auto" @click="deleteFrom(timeDets[timeUnit], index)" v-if="timeDets[timeUnit].length != 1">Remove</div>
        </div>
      </div>
      <div class="label tw-text-primary tw-p-2 tw-cursor-pointer" @click="addNew('Week')">Add More</div>
    </div>
    <div v-if="timeUnit === 'Month'" class="tw-p-2">
      <div v-for="ddo, index in timeDets[timeUnit]" :key="ddo">
        <div class="tw-flex tw-flex-grow-1 tw-gap-1 tw-justify-start tw-items-center tw-p-2">
          <div class="label">On</div>
          <AGInput v-model:value="ddo.date" type="number" min=1 max=31 /> <span class="label">
            {{dateSuffix(ddo.date)}}
          </span>
        </div>
        <div class="tw-flex tw-flex-grow-1 tw-gap-1 tw-justify-start tw-items-center tw-p-2 tw-border-b">

          <div class="label tw-px-2">At</div>
          <div class="tw-flex tw-items-center tw-gap-1">
            <span class="label">Hour:</span>
            <AGInput v-model:value="ddo.hour" type="number" min=0 max=12 />
          </div>
          <div class="tw-flex tw-items-center tw-gap-1 tw-ml-3">
            <span class="label">Minute:</span>
            <AGInput v-model:value="ddo.minute" type="number" min=0 max=59 />
          </div>
          <div class="tw-flex tw-items-center tw-gap-1 tw-ml-3">
            <AGSelect v-model:selected="ddo.am" :options="amOptions" canNotDeselect="true"/>
          </div>
          <div class="label tw-text-red-700 tw-p-2 tw-cursor-pointer tw-ml-auto" @click="deleteFrom(timeDets[timeUnit], index)" v-if="timeDets[timeUnit].length != 1">Remove</div>
        </div>
      </div>
      <div class="label tw-text-primary tw-p-2 tw-cursor-pointer" @click="addNew('Month')">Add More</div>
    </div>
    <div v-if="timeUnit === 'Hour'">
      <div v-for="ddo, index in timeDets[timeUnit]" :key="ddo" class="tw-flex tw-p-2 tw-items-center tw-gap-2 tw-border-b tw-justify-start"  >
        <span class="label">At </span>
        <AGInput v-model:value="ddo.minute" type="number" min=0 max=59 />
        <span class="label">
          {{dateSuffix(ddo.minute)}} minute
        </span>
        <div class="label tw-text-red-700 tw-p-2 tw-cursor-pointer tw-ml-auto" @click="deleteFrom(timeDets[timeUnit], index)" v-if="timeDets[timeUnit].length != 1">Remove</div>
      </div>
      <div class="label tw-text-primary tw-p-2 tw-cursor-pointer" @click="addNew('Hour')">Add More</div>
    </div>
  </div>


</template>

<script>
import AGInput from 'components/base/input.vue'
import AGSelect from 'components/base/select.vue'
import BoxSelect from 'components/base/boxSelect.vue'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

const newDayTimeUnitOption = {
  hour: 12,
  minute: 0,
  am: 'AM'
}
const newMonthTimeUnitOption = {
  date: 1,
  hour: 12,
  minute: 0,
  am: 'AM'
}
const newWeekTimeUnitOption = {
  day: "Monday",
  hour: 12,
  minute: 0,
  am: 'AM'
}
const newHourTimeUnitOption = {
  minute: 0,
}
export default {
  name: 'AGSchedulerTime',
  components: {AGInput, AGSelect, BoxSelect},
  props: ['every', 'timeUnit', 'timeDetails'],

  data(){

    return {
      timeUnitOptions: ['Month', 'Week', 'Day', 'Hour'],
      timeDets: this.timeDetails || {
        Day: [cloneDeep(newDayTimeUnitOption)],
        Week: [cloneDeep(newWeekTimeUnitOption)],
        Month: [cloneDeep(newMonthTimeUnitOption)],
        Hour: [cloneDeep(newHourTimeUnitOption)],
      },
      dayOfWeekOptions: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => {
        return {name: d, value: d}
      }),
      amOptions: ['AM', 'PM']
    }  
  },


  watch: {
    timeUnit(){
      if (this.timeUnit == 'Day'){
        this.timeDets[this.timeUnit] = this.timeDetails[this.timeUnit] || [cloneDeep(newDayTimeUnitOption)]
      }else if(this.timeUnit == 'Week'){
        this.timeDets[this.timeUnit] = this.timeDetails[this.timeUnit] || [cloneDeep(newWeekTimeUnitOption)]
      }else if(this.timeUnit == 'Month'){
        this.timeDets[this.timeUnit] = this.timeDetails[this.timeUnit] || [cloneDeep(newMonthTimeUnitOption)]
      }else if(this.timeUnit == 'Hour'){
        this.timeDets[this.timeUnit] = this.timeDetails[this.timeUnit] || [cloneDeep(newHourTimeUnitOption)]
      }

      this.updateTimeDetails()
    },

    timeDets: {
      deep: true,
      handler(){
        this.updateTimeDetails()
      }
    }
  },

  mounted() {
    this.updateTimeDetails()
  },

  methods: {
    updateTimeDetails(){
      this.$emit('update:timeDetails', this.timeDets)
    },
    addNew(timeUnit){
      if (timeUnit === 'Hour'){
        this.timeDets[this.timeUnit].push(cloneDeep(newHourTimeUnitOption))
        return
      }
      if (timeUnit === 'Day'){
        this.timeDets[this.timeUnit].push(cloneDeep(newDayTimeUnitOption))
        return
      }
      if (timeUnit === 'Week'){
        this.timeDets[this.timeUnit].push(cloneDeep(newWeekTimeUnitOption))
        return
      }
      if (timeUnit === 'Month'){
        this.timeDets[this.timeUnit].push(cloneDeep(newMonthTimeUnitOption))
        return
      }

    },
    deleteFrom(arr, index){
      arr.splice(index, 1)
    },
    dateSuffix(date) {
      var j = date % 10,
      k = date % 100;
      if (j == 1 && k != 11) {
        return "st";
      }
      if (j == 2 && k != 12) {
        return "nd";
      }
      if (j == 3 && k != 13) {
        return "rd";
      }
      return "th";

    },
  }
}
</script>
