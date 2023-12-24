<template>
  <AGModal
    :show="open"
    @update:show="(val) => $emit('update:show', val)"
    :loading="loading"
    :loadingMessage="loadingMessage"
    size="small"
    bodyClass="tw"
  >
    <template #header>
      <div
        class="tw-w-full tw-border-b-primary tw-border-b-2 tw-p-4 tw-text-primary tw-font-semibold tw-text-2xl tw-flex tw-items-center"
      >
        <div class="tw-flex-[1_1_80%]">Schedule Report</div>
        <div class="tw-flex-[1_1_10%] tw-flex tw-items-center">
          <AGBool v-model:val="isActive" :label="Active" />
        </div>
      </div>
    </template>
    <template #body>
      <div class="tw-p-4">
        <AGLoader :text="loadingText" v-if="loading" />
        <div v-if="!loading">
          <div class="label">Email Subject</div>
          <AGInput
            v-model:value="subject"
            label="Email Subject"
            placeholder="Enter email subject"
          />
          <AGSchedulerTime
            v-model:every="every"
            v-model:timeUnit="timeUnit"
            v-model:timeDetails="timeDetails"
          />

          <div
            class="label tw-text-primary tw-p-2 tw-cursor-pointer"
            @click="editNoteModalOpen = true"
          >
            Edit Email Content
          </div>

          <!-- <div class="label">Timezone</div> -->
          <!-- <Multiselect -->
          <!--   :classes="multiselectCss" -->
          <!--   :v-model:modelValue="timezone" -->
          <!--   placeholder="Search a timezone" -->
          <!--   :close-on-select="true" -->
          <!--   :filter-results="false" -->
          <!--   :min-chars="1" -->
          <!--   :resolve-on-load="false" -->
          <!--   :delay="0" -->
          <!--   :searchable="true" -->
          <!--   :options="searchTimezones" -->
          <!-- /> -->
          <Multiselect
            :classes="multiselectCss"
            mode="tags"
            :object="true"
            :modelValue="
              recipients.map((item) => ({
                value: item,
                label: item,
              })) || []
            "
            @update:modelValue="
              recipients = $event.map((option) => option.label)
            "
            placeholder="Search emails or teams"
            :close-on-select="false"
            :filter-results="false"
            :min-chars="1"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            :options="searchUsers"
            createOption
            @create="addNewEmail"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="tw-flex tw-justify-end tw-gap-2 tw-p-2 tw-border-t">
        <AGButton class="" @click="$emit('update:open', false)"
          >Cancel</AGButton
        >
        <AGButton class="">
          <a :href="previewUrl" target="_" class=""> Preview </a>
        </AGButton>
        <AGButton class="tw-bg-primary tw-text-white" @click="save"
          >Save</AGButton
        >
      </div>
    </template>
  </AGModal>

  <AGNote
    v-model:content="noteContent"
    v-model:open="editNoteModalOpen"
    :id="noteId"
    :query="query"
    @save="saveNote"
    :key="noteContent"
  />
</template>

<script>
import AGSchedulerTime from 'components/schedulers/time.vue';
import AGBool from 'components/base/bool.vue';
import AGButton from 'components/base/button.vue';
import AGLoader from 'components/utils/loader.vue';
import AGModal from 'components/utils/modal.vue';
import AGInput from 'components/base/input.vue';

import AGNote from 'components/widgets/editNote.vue';

import Multiselect from '@vueform/multiselect';
import multiselectClasses from 'src/helpers/multiselectCss.ts';
import { saveSchedule, fetchSchedule } from 'src/apis/schedule';
import { fetchRecipients } from 'src/apis/recipients';
import { sessionStore } from 'stores/session';

const session = sessionStore();
export default {
  name: 'AGScheduleDashbaord',
  components: {
    AGSchedulerTime,
    AGBool,
    AGButton,
    Multiselect,
    AGLoader,
    AGModal,
    AGInput,
    AGNote,
  },
  props: [
    'entityID',
    'open',
    'entityName',
    'entityTitle',
    'hideEmailContentEditor',
    'hidePreviewButton',
  ],

  data() {
    return {
      every: 1,
      timeUnit: 'Day',
      timeDetails: null,
      recipients: [],
      isActive: true,
      timezone: null,
      loading: false,
      multiselectCss: multiselectClasses,
      subject: `Afterglow: Your Report for ${this.entityName.replace(
        /s$/,
        ''
      )}: ${this.entityTitle}`,
      noteID: null,
      editNoteModalOpen: false,
      noteContent: null,
    };
  },

  computed: {
    previewUrl() {
      return (
        '/frontend/' +
        this.entityName +
        '/' +
        this.entityID +
        '/html?token=' +
        session.token
      );
    },
  },

  mounted() {
    this.fetchScheduledJob();
  },

  methods: {
    addNewEmail(email) {
      if (!email) return true;
      email.value
        .split(',')
        .map((e) => e.trim())
        .forEach((email) => {
          if (this.validateEmail(email)) {
            this.recipients.push(email);
          }
        });
      return true;
    },
    async searchUsers(q) {
      return fetchRecipients(q, session.token, (emailOptions) => {
        return emailOptions.map((email) => {
          return { label: email, value: email };
        });
      });
    },

    validateEmail(email) {
      if (email === 'all') {
        return true;
      }
      if (
        /^[\w.!#$%&’*+\-\/=?\^`{|}~]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        return true;
      } else if (/^".+"@team/.test(email)) {
        return true;
      }
      return false;
    },

    setSchedule(schedule, loading) {
      this.loading = loading;
      if (schedule) {
        this.every = schedule.every;
        this.timeUnit = schedule.time_unit;
        this.recipients = schedule.recipients || [];
        this.subject = schedule.subject;
        (this.isActive = schedule.is_active),
          (this.timezone = schedule.timezone);
        this.timeDetails = {};
        this.timeDetails[this.timeUnit] = schedule.time_details;
        this.noteContent = schedule.email_content;
      }
      if (!loading) {
        this.loadingText = 'Fetching';
      }
    },

    fetchScheduledJob() {
      fetchSchedule(
        this.entityID,
        this.entityName,
        session.token,
        this.setSchedule
      );
    },
    // searchTimezones(q) {
    //   return fetch(
    //     'https://api.timezonedb.com/v2.1/list-time-zone?key=5K2ZGZ4Y3O7Z&format=json&zone=' +
    //       q
    //   )
    //     .then((res) => res.json())
    //     .then((res) => {
    //       return res.zones.map((zone) => {
    //         return { label: zone.zoneName, value: zone.zoneName };
    //       });
    //     });
    // },

    saveNote(html) {
      this.noteContent = html;
      // saveNote(
      //   this.noteID,
      //   { content: this.noteContent },
      //   session.token,
      //   this.setNote
      // );
    },

    save() {
      const payload = {
        every: this.every,
        time_unit: this.timeUnit,
        time_details: this.timeDetails[this.timeUnit],
        is_active: this.isActive,
        recipients: this.recipients.filter((email) =>
          this.validateEmail(email)
        ),
        subject: this.subject,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        email_content: this.noteContent,
      };
      this.loadingText = 'Saving';
      saveSchedule(
        this.entityID,
        this.entityName,
        payload,
        session.token,
        this.setSchedule
      );

      this.$emit('update:open', false);
    },
  },
};
</script>
