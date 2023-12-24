<template>
  <div
    class="tw-border-b tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-4 tw-text-default/80 tw-bg-white"
    :class="editMode ? 'tw-h-[100px]' : 'tw-h-[45px]'"
    v-if="dashboardModel"
  >
    <div class="tw-flex-[1_1_20%] tw-font-bold tw-text-xl" v-if="!editMode">
      {{ dashboardModel.title }}
    </div>
    <div class="tw-flex tw-flex-col tw-gap-2 tw-flex-[1_1_20%]" v-if="editMode">
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-justify-between item-3070-columns"
      >
        <div class="label">Title</div>
        <AGInput
          v-model:value="dashboard.title"
          placeholder="Give it a name"
          class="tw-flex-1"
        />
      </div>
      <div
        class="tw-flex tw-gap-2 tw-items-center tw-justify-between item-3070-columns"
      >
        <div class="label">Description</div>
        <AGInput
          v-model:value="dashboard.description"
          placeholder="Give it a purpose"
          class="tw-flex-1"
        />
      </div>
    </div>
    <div class="tw-flex-[1_1_60%] tw-flex tw-justify-center">
      <div
        class="tw-text-primary tw-uppercase tw-cursor-pointer"
        @click="refresh"
      >
        Refresh
      </div>
    </div>
    <div
      class="tw-flex tw-gap-2 tw-flex-[1_1_20%] tw-stroke-default/20 tw-justify-end"
      v-if="!currentUser.canEditQuestion"
    ></div>
    <div
      class="tw-flex tw-gap-2 tw-flex-[1_1_20%] tw-stroke-default/20 tw-justify-end"
      v-if="currentUser.canEditQuestion"
    >
      <div
        class="tw-flex tw-gap-4 tw-leading-4 tw-items-center"
        v-if="editMode"
      >
        <div
          class="tw-font-semibold tw-text-primary tw-uppercase tw-cursor-pointer"
          @click="($emit('save') || true) && (editMode = false)"
        >
          Save
        </div>
        <div
          class="tw-font-semibold tw-text-default/80 tw-uppercase tw-cursor-pointer"
          @click="editMode = false"
        >
          cancel
        </div>
        <div
          class="tw-font-semibold tw-text-red-700 tw-uppercase tw-cursor-pointer"
          @click="openDeleteModal = true"
        >
          delete
        </div>
      </div>
      <div v-if="!editMode">
        <q-tooltip transition-show="scale" transition-hide="scale">
          Edit
        </q-tooltip>
        <EditIcon
          size="20"
          class="tw-stroke-default/80 tw-stroke-[1.5] tw-cursor-pointer"
          @click="editMode = true"
        />
      </div>
      <div :class="refreshTime ? 'icon-primary tw-stroke-white' : ''">
        <q-tooltip transition-show="scale" transition-hide="scale"
          >Auto Refresh Interval - {{ refreshTimeDisplay }}
        </q-tooltip>
        <RefreshIcon
          size="20"
          class="tw-stroke-[1.5] tw-cursor-pointer"
          :class="
            refreshTime
              ? 'tw-stroke-white hover:tw-stroke-default/80'
              : 'tw-stroke-default/80'
          "
        />

        <q-menu
          flat="true"
          transition-show="jump-down"
          transition-hide="jump-up"
          max-height="400px"
          class="tw-rounded-2xl tw-border tw-overflow-hidden"
          @show="menuShow"
          @keydown="onKeydown"
        >
          <template v-for="time in refreshTimes" :key="time">
            <div
              class="menu-item tw-py-2 tw-flex tw-items-center tw-border-b-0"
              @click="refreshTime = time.value"
              v-close-popup
            >
              <HourglassIcon size="20" class="icon-primary" />
              {{ time.name }}
            </div>
          </template>
        </q-menu>
      </div>
      <div>
        <q-tooltip transition-show="scale" transition-hide="scale">
          Add Widget
        </q-tooltip>
        <AppsIcon
          size="20"
          class="tw-stroke-default/80 tw-stroke-[1.5] tw-cursor-pointer"
          @click="openAddWidgetModal = true"
        />
      </div>
      <div>
        <q-tooltip transition-show="scale" transition-hide="scale"
          >Share
        </q-tooltip>
        <UploadIcon
          size="20"
          class="tw-stroke-default/80 tw-stroke-[1.5] tw-cursor-pointer"
          @click="openShareModal = true"
        />
      </div>
      <div>
        <q-tooltip transition-show="scale" transition-hide="scale"
          >Schedule Report
        </q-tooltip>
        <MailIcon
          size="20"
          class="tw-stroke-default/80 tw-stroke-[1.5] tw-cursor-pointer"
          @click="$emit('update:showScheduleReport', !showScheduleReport)"
        />
      </div>
      <div>
        <q-tooltip transition-show="scale" transition-hide="scale"
          >Fullscreen
        </q-tooltip>
        <MaximizeIcon
          size="20"
          class="tw-stroke-default/80 tw-stroke-[1.5] tw-cursor-pointer"
          @click="$emit('fullScreen')"
        />
      </div>
    </div>

    <AGShareDashboard
      v-model:open="openShareModal"
      v-model:entity="dashboard"
      :key="dashboard"
      entityName="Dashboard"
      v-if="dashboard.id"
      @save="$emit('save')"
    />
    <AGDeleteDashboardModal
      v-model:open="openDeleteModal"
      entityName="dashboard"
      :entityID="dashboard.id"
      :key="dashboard"
      v-if="dashboard.id"
      @deleted="deleted"
    />
    <AddWidgetModal
      v-model:open="openAddWidgetModal"
      :dashboard="dashboard"
      @addWidget="
        (data) => ($emit('addWidget', data) || true) && (this.editMode = true)
      "
    />
  </div>
</template>
<script>
import {
  EditIcon,
  RefreshIcon,
  MailIcon,
  UploadIcon,
  MaximizeIcon,
  HourglassIcon,
  AppsIcon,
} from 'vue-tabler-icons';
import AGInput from 'components/base/input.vue';
import AGShareDashboard from 'components/utils/shareEntity.vue';
import AGDeleteDashboardModal from 'components/utils/deleteEntityModal.vue';
import cloneDeep from 'lodash/cloneDeep';

import isEqual from 'lodash/isEqual';
import AddWidgetModal from 'components/dashboard/addWidget.vue';

import { variableQuery } from 'stores/variableQuery';
import { currentUserStore } from 'stores/currentUser';
const currentUser = currentUserStore();
export default {
  name: 'AGDashboardHeader',
  props: ['dashboardModel', 'showScheduleReport', 'editModeModel'],
  components: {
    EditIcon,
    RefreshIcon,
    MailIcon,
    UploadIcon,
    MaximizeIcon,
    HourglassIcon,
    AGInput,
    AGShareDashboard,
    AGDeleteDashboardModal,
    AddWidgetModal,
    AppsIcon,
  },

  watch: {
    editMode() {
      this.$emit('update:editModeModel', this.editMode);
    },
    dashboardModel: {
      deep: true,
      handler() {
        if (!isEqual(this.dashboard, this.dashboardModel)) {
          this.dashboard = cloneDeep(this.dashboardModel);
        }
      },
    },
    dashboard: {
      deep: true,
      handler(newValue, oldValue) {
        if (!isEqual(this.dashboard, this.dashboardModel)) {
          this.$emit('update:dashboardModel', this.dashboard);
        }
      },
    },

    refreshTime() {
      if (this.refreshTime === 0 && this.refreshTimeTimer) {
        clearInterval(this.refreshTimeTimer);
        return;
      }
      this.refreshTimeTimer = setInterval(() => {
        this.refresh();
      }, this.refreshTime * 1000);
    },
  },
  computed: {
    refreshTimeDisplay() {
      let disp = '';
      this.refreshTimes.forEach((v) => {
        if (v.value === this.refreshTime) {
          disp = v.name;
        }
      });
      return disp;
    },
  },
  data() {
    return {
      editMode: false,
      currentUser: currentUser,
      dashboard: cloneDeep(this.dashboardModel || {}),
      refreshTime: 0,
      openShareModal: false,
      openDeleteModal: false,
      refreshTimeTimer: null,
      varStore: variableQuery(),
      openAddWidgetModal: false,
      refreshTimes: [
        { name: 'Never', value: 0 },
        { name: '5 Seconds', value: 5 },
        { name: '10 Seconds', value: 10 },
        { name: '30 Seconds', value: 30 },
        { name: '1 Minute', value: 60 },
        { name: '5 Minutes', value: 300 },
        { name: '15 Minutes', value: 900 },
        { name: '30 Minutes', value: 1800 },
      ],
    };
  },
  methods: {
    deleted() {
      window.location.pathname = '/dashboards';
    },
    refresh() {
      this.varStore.updateQuery(this.$router);
      window.postMessage({
        message: 'ag_refresh_dashboard',
        payload: '{}',
      });
    },
  },
};
</script>
