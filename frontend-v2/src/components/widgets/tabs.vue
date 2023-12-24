<template>
  <div class="tw-h-full">
    <div
      class="tw-flex tw-gap-1 tw-border-b-2 tw-h-fit tw-items-center"
      :style="tabsStyle"
      v-if="!tabsConfigLocal.hideTabs"
    >
      <template v-for="(tab, i) in tabsConfigLocal.tabs" :key="tab">
        <div
          class="tw-px-4 tw-py-2 tw-border-r tw-font-semibold tw-cursor-pointer tw-flex-1"
          @click="currentTabIndex = i"
          :style="currentTabStyle(i)"
        >
          {{ tab.name }}
        </div>
      </template>
      <div
        class="tw-flex tw-items-center tw-whitespace-nowrap tw-gap-2 tw-ml-3 tw-mr-4"
      >
        <div class="tw-cursor-pointer">
          <q-menu
            flat="true"
            transition-show="scale"
            transition-hide="scale"
            max-height="400px"
            :offset="[0, 5]"
            class="tw-rounded-2xl tw-border tw-overflow-hidden"
            @show="menuShow"
            @keydown="onKeydown"
          >
            <div class="card tw-grid tw-grid-cols-1 tw-divider-y">
              <div
                class="tw-py-1 tw-px-2 tw-whitespace-nowrap tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0 tw-cursor-pointer"
                v-if="currentUser.canEditDashboard"
                @click="openEditTabsModal = true"
              >
                <TableOptionsIcon size="16" class="icon-primary tw-mr-2" />
                <span class="">Configure Tabs</span>
              </div>
              <div
                @click="refreshKey += 1"
                class="tw-cursor-pointer tw-py-1 tw-px-2 tw-block tw-w-full hover:tw-bg-primary hover:tw-text-white tw-text-ellipsis focus:tw-bg-primary focus:tw-text-white tw-border-b last:tw-border-b-0"
              >
                <RefreshIcon size="16" class="icon-primary tw-mr-2" />
                <span class="">Refresh</span>
              </div>
            </div>
          </q-menu>
          <Menu2Icon size="16" />
        </div>
        <slot />
      </div>
    </div>
    <div class="tw-overflow-auto tw-p-2">
      <AGDGrid
        :dashboardKey="dashboardKey"
        :gridClass="'tabs_' + widID"
        :key="{ d: dashboardKey, r: refreshKey }"
        isNested="true"
        class="tw-overflow-auto"
        v-if="currentTab?.dashboardID"
      />
      <div
        class="tw-flex tw-justify-center tw-items-center tw-h-full"
        v-if="!currentTab?.dashboardID"
      >
        No Dashboard is configured to show for this tab. Please configure it
        from tabs Configuration
      </div>
    </div>

    <AGEditTabsModal
      v-model:open="openEditTabsModal"
      v-model:tabsConfig="tabsConfigLocal"
    />
  </div>
</template>
<script>
import { cloneDeep, isEqual } from 'lodash';
import { fetchDashboard } from 'src/apis/dashboards';
import { sessionStore } from 'src/stores/session';
import { variableQuery } from 'stores/variableQuery';
import { defineAsyncComponent } from 'vue';

import AGEditTabsModal from 'components/widgets/editTabsModal.vue';

import {
  TableOptionsIcon,
  RefreshIcon,
  XIcon,
  Menu2Icon,
} from 'vue-tabler-icons';
import { currentUserStore } from 'src/stores/currentUser';
import {
  autoTextColor,
  getComplementaryColor,
} from 'src/helpers/colorGenerator';
const AGDGrid = defineAsyncComponent(() =>
  import('components/dashboard/dGrid.vue')
);
const varStore = variableQuery();

const session = sessionStore();
const currentUser = currentUserStore();
const newTabConfig = {
  tabs: [
    { name: 'Tab 1', conditionValue: 1, default: true, dashboardID: null },
    { name: 'Tab 2', conditionValue: 2, dashboardID: null },
    { name: 'Tab 3', conditionValue: 3, dashboardID: null },
  ],
  hideTabs: false,
  decidingParam: 'param',
};
export default {
  name: 'AGTabs',
  props: ['widgetConfiguration', 'widID', 'containerStyle'],

  components: {
    AGDGrid,
    AGEditTabsModal,
    TableOptionsIcon,
    RefreshIcon,
    Menu2Icon,
  },

  computed: {
    currentTab() {
      return this.tabsConfigLocal.tabs[this.currentTabIndex];
    },
    complementaryColor() {
      return getComplementaryColor(this.tabsStyle['background-color']);
    },
    tabsStyle() {
      let bgColor = this.containerStyle['background-color'];
      if (bgColor) {
        bgColor = bgColor.replace('!important', '').trim();
        return {
          'background-color': bgColor,
          color: autoTextColor(bgColor),
        };
      }
      return { 'background-color': 'rgb(var(--color-white))' };
    },
  },

  watch: {
    widgetConfiguration: {
      deep: true,
      handler() {
        if (
          !isEqual(this.widgetConfiguration?.tabsConfig, this.tabsConfigLocal)
        ) {
          this.tabsConfigLocal =
            this.widgetConfiguration?.tabsConfigLocal ||
            cloneDeep(newTabConfig);
        }
      },
    },
    tabsConfigLocal: {
      deep: true,
      handler() {
        if (!this.tabsConfigLocal[this.currentTabIndex]) {
          this.currentTabIndex = 0;
        }
        if (
          !isEqual(this.widgetConfiguration?.tabsConfig, this.tabsConfigLocal)
        ) {
          const widConfig = cloneDeep(this.widgetConfiguration) || {};
          widConfig.tabsConfig = this.tabsConfigLocal;
          this.$emit('update:widgetConfiguration', widConfig);
        }
      },
    },
    currentTab() {
      if (this.currentTab?.dashboardID) {
        fetchDashboard(
          this.currentTab.dashboardID,
          {},
          session.token,
          this.setDashboard
        );
        return;
      }
    },
    // currentTabIndex() {
    //   if (this.tabsConfigLocal.decidingParam) {
    //     const paramKey = varStore.hashed(this.tabsConfigLocal.decidingParam);
    //     const query = cloneDeep(this.$route.query) || {};
    //     query[paramKey] =
    //       this.tabsConfigLocal.tabs[this.currentTabIndex].conditionValue;
    //     this.$router.push({
    //       query: query,
    //     });
    //   }
    // },
  },

  data() {
    return {
      tabsConfigLocal:
        cloneDeep(this.widgetConfiguration?.tabsConfig) ||
        cloneDeep(newTabConfig),
      currentTabIndex: 0,
      dashboardKey: null,
      loading: false,
      openEditTabsModal: false,
      currentUser: currentUser,
      refreshKey: 0,
    };
  },

  mounted() {
    if (this.currentTab?.dashboardID) {
      fetchDashboard(
        this.currentTab.dashboardID,
        {},
        session.token,
        this.setDashboard
      );
    }
  },

  methods: {
    currentTabStyle(i) {
      if (i != this.currentTabIndex) {
        return {};
      }
      return {
        'border-bottom': '2px solid ' + this.complementaryColor,
        color: this.complementaryColor,
      };
    },
    setDashboard(d, l) {
      this.dashboardKey = d;
      this.loading = l;
    },
  },
};
</script>
