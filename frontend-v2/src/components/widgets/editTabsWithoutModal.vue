<template>
  <div class="tw-p-2 divide-y">
    <div class="label tw-text-xl">Tabs</div>
    <div
      class="tw-flex tw-gap-4"
      v-for="(tab, i) in tabsConfigLocal.tabs"
      :key="tab"
    >
      <div class="tw-flex-1">
        <div class="tw-mt-4 label">Name</div>
        <AGInput
          v-model:value="tab.name"
          placeholder="Tab Name"
          debounce="1000"
        />
        <div class="note">
          This Option is useful when you want to show different dashboards for
          different query param value
        </div>
      </div>
      <!-- <div class="tw-flex-1"> -->
      <!--   <div class="tw-mt-4 label">Param Value</div> -->
      <!--   <AGInput -->
      <!--     v-model:value="tab.conditionValue" -->
      <!--     placeholder="Tab Name" -->
      <!--   /> -->
      <!--   <div class="note"> -->
      <!--     This tab will be visible when param value is equal to param -->
      <!--     value in the url. -->
      <!--   </div> -->
      <!-- </div> -->
      <div class="tw-flex-1">
        <div class="tw-mt-4 label">Dashboard ID</div>
        <AGInput
          v-model:value="tab.dashboardID"
          placeholder="Dashboard ID"
          type="number"
          debounce="1000"
        />
        <div class="note"></div>
      </div>
      <!-- <div class="tw-flex-1"> -->
      <!--   <div class="tw-mt-4 label">Dashboard URL Params</div> -->
      <!--   <AGInput -->
      <!--     v-model:value="tab.dashboardParams" -->
      <!--     placeholder="?q_param1=2&q_param2=3" -->
      <!--   /> -->
      <!--   <div class="note"> -->
      <!--     Encoded dashbaord variables and their value. e.g. -->
      <!--     '?q_param1=2&q_param2=3' -->
      <!--   </div> -->
      <!-- </div> -->
      <div class="tw-mt-6" @click="remove(i)">
        <div
          class="tw-mt-4 label tw-uppercase tw-text-red-700 tw-cursor-pointer"
        >
          Remove
        </div>
      </div>
    </div>

    <div
      class="tw-uppercase tw-text-primary tw-cursor-pointer note"
      @click="addMoreTabs"
    >
      Add Another Tab
    </div>
    <!-- <div class="tw-mt-4 label">Deciding Param</div> -->
    <!-- <AGInput -->
    <!--   v-model:value="tabsConfigLocal.decidingParam" -->
    <!--   placeholder="Deciding Param" -->
    <!-- /> -->
    <!-- <div class="note"> -->
    <!--   this param (with q_ prefix) will be passed to url on tab click. So -->
    <!--   URLs will stick to the same tab when refreshed. -->
    <!-- </div> -->
    <!-- <div class="tw-mt-4 label">Hide Tabs</div> -->
    <!-- <AGBool v-model:value="tabsConfigLocal.hideTabs" /> -->
    <!-- <div class="note"> -->
    <!--   This Option is useful when you want to show different dashboards for -->
    <!--   different query param value -->
    <!-- </div> -->
  </div>
</template>

<script>
import AGModal from 'components/utils/modal.vue';
import AGInput from 'components/base/input.vue';
import AGButton from 'components/base/button.vue';
import AGHorizontalDivider from 'components/utils/horizontalDividerWithText.vue';
import { cloneDeep, isEqual } from 'lodash';

export default {
  name: 'AGEditTabs',
  props: ['open', 'tabsConfig'],
  components: { AGInput },

  watch: {
    tabsConfig: {
      deep: true,
      handler() {
        if (!isEqual(this.tabsConfig, this.tabsConfigLocal)) {
          this.tabsConfigLocal = this.tabsConfig;
        }
      },
    },
    tabsConfigLocal: {
      deep: true,
      handler() {
        if (!isEqual(this.tabsConfig, this.tabsConfigLocal)) {
          this.$emit('update:tabsConfig', this.tabsConfigLocal);
        }
      },
    },
  },
  data() {
    return { tabsConfigLocal: cloneDeep(this.tabsConfig) };
  },
  methods: {
    addMoreTabs() {
      this.tabsConfigLocal.tabs.push({
        name: 'Tab ' + (this.tabsConfigLocal.tabs.length + 1),
      });
    },
    remove(i) {
      this.tabsConfigLocal.tabs.splice(i, 1);
    },
  },
};
</script>
