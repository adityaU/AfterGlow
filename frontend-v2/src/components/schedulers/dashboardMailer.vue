<template>
  <div>
    <AGLoader :text="loadingText" v-if="loading"/> 
    <div v-if="!loading">
      <div class="tw-w-full tw-border-b-primary tw-border-b-2 tw-p-2 tw-text-primary tw-font-semibold tw-text-2xl tw-flex tw-items-center">
        <div class="tw-flex-[1_1_80%]">Schedule Report</div>
        <div class="tw-flex-[1_1_10%] tw-flex tw-items-center"> 
          <AGBool v-model:val="isActive" :label="Active" />
        </div>
      </div>
      <AGSchedulerTime v-model:every="every" v-model:timeUnit="timeUnit" v-model:timeDetails="timeDetails" />
      <AGSearchSelect v-model:selected="recipients"
        :queryFunction="searchUsers"
        :options="emailOptions"
        includeQuery=true
        disableLocalSearch="true"
        :selectedValidator="validateEmail"
        label="Send to" 
        description="Enter few email or teams" class="tw-p-2" />
      <div class="tw-flex tw-justify-end tw-gap-2 tw-p-2 tw-border-t"> 
        <AGButton class="" @click="$emit('hideSchedule')">Cancel</AGButton>
        <a :href="previewUrl" target="_" class="tw-text-base tw-border tw-p-1 tw-font-semibold"> Preview </a>
        <AGButton class="tw-bg-primary tw-text-white" @click="save">Save</AGButton>
      </div>
    </div>
  </div>
</template>

<script>
import AGSchedulerTime from 'components/schedulers/time.vue'
import AGSearchSelect from 'components/base/searchSelect.vue'
import AGBool from 'components/base/bool.vue'
import AGButton from 'components/base/button.vue'
import AGLoader from 'components/utils/loader.vue'
import {saveDashboardSchedule, fetchDashboardSchedule} from 'src/apis/schedule'
import {fetchRecipients} from 'src/apis/recipients'
export default {
  name: "AGScheduleDashbaord",
  components: {AGSchedulerTime, AGSearchSelect, AGBool, AGButton, AGLoader},
  props: ['query', 'dashboardID'],

  data(){
    return {
      emailOptions: [],
      every: 1,
      timeUnit: 'Day',
      timeDetails: null,
      recipients: [],
      isActive: true,
      timezone: null,
      loading: false,
    }
  },

  computed: {
    previewUrl(){
      return "/frontend/dashboards/" + this.dashboardID + '/html?token=' + this.query.token
    }
  },

  mounted() {
    this.fetchScheduledJob()
  },

  methods: {
    searchUsers(q){
      fetchRecipients(q, this.query.token, (emailOptions) => {
        this.emailOptions = emailOptions
        this.emailOptions.push(q)
      })
    },

    validateEmail(email){
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return (true)
      }else if(/^".+"@team/.test(email)){
        return (true)
      }
      return (false)
    },

    setSchedule(schedule, loading ){
      this.loading = loading
      if (schedule){
        this.every = schedule.every
        this.timeUnit = schedule.time_unit
        this.recipients = schedule.recipients
        this.isActive = schedule.is_active,
        this.timezone = schedule.timezone
        this.timeDetails = {}
        this.timeDetails[this.timeUnit] = schedule.time_details
      }
      if (!loading){
        this.loadingText = "Fetching"
      }
    },

    fetchScheduledJob(){
      fetchDashboardSchedule(this.dashboardID, this.query.token, this.setSchedule)
    },

    save(){
      const payload = { 
        every: this.every,
        time_unit: this.timeUnit,
        time_details: this.timeDetails[this.timeUnit],
        is_active: this.isActive,
        recipients: this.recipients.filter(email => this.validateEmail(email)),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
      this.loadingText = "Saving"
      saveDashboardSchedule(this.dashboardID, payload, this.query.token, this.setSchedule)


    }
  },
}
</script>
