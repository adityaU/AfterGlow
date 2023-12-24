<template>
  <div class="tw-flex tw-items-center">
    <div class="tw-flex-1 tw-flex">
      <template v-for="variable in variables" :key="variable">
        <div
          class="tw-flex tw-items-center tw-m-1 tw-cursor-pointer tw-leading-4"
        >
          <div class="tw-flex">
            <div
              class="tw-bg-primary/90 tw-text-white tw-px-4 tw-py-2 tw-rounded-l-sm"
            >
              {{ variable.name }}
            </div>
            <div
              class="tw-bg-primary tw-text-white tw-px-4 tw-py-2 tw-rounded-r-sm"
              v-if="
                variable.var_type === 'String' ||
                variable.var_type === 'Integer'
              "
            >
              {{ variable.value != null ? variable.value : variable.default }}
            </div>
            <AGDatetimePicker
              class="tw-bg-primary tw-text-white tw-px-4 tw-py-2 tw-rounded-r-sm tw-border-0"
              v-model:value="variable.value"
              type="datetime"
              :clearCount="variable.clearCount"
              v-if="variable.var_type === 'Date'"
            />
            <q-menu
              flat="true"
              transition-show="jump-down"
              transition-hide="jump-up"
              max-height="400px"
              class="tw-rounded-full tw-border tw-overflow-hidden"
              @show="menuShow"
              @keydown="onKeydown"
              fit
              v-if="
                variable.var_type === 'String' ||
                variable.var_type === 'Integer'
              "
            >
              <AGInput
                :placeholder="'Enter ' + variable.name"
                v-model:value="variable.value"
              />
            </q-menu>
          </div>
        </div>
      </template>
    </div>
    <div class="tw-px-2 tw-flex tw-gap-1">
      <AGButton
        class="hover:tw-bg-default/80 tw-leading-4"
        :style="clearButtonStyle"
        v-if="showClearButton"
        @click="clear()"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          v-if="clearButtonFormatting.iconOnly"
        >
          {{ clearButtonName }}
        </q-tooltip>
        <div class="tw-flex tw-items-center tw-gap-1">
          <div v-html="clearButtonFormatting.icon"></div>
          <div v-if="!clearButtonFormatting.iconOnly">
            {{ clearButtonName }}
          </div>
        </div>
      </AGButton>
      <AGButton
        class="hover:tw-bg-default/80 tw-leading-4"
        :style="resetButtonStyle"
        v-if="showResetButton"
        @click="reset()"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          v-if="resetButtonFormatting.iconOnly"
        >
          {{ resetButtonName }}
        </q-tooltip>
        <div class="tw-flex tw-items-center tw-gap-1">
          <div v-html="resetButtonFormatting.icon"></div>
          <div v-if="!resetButtonFormatting.iconOnly">
            {{ resetButtonName }}
          </div>
        </div>
      </AGButton>
      <AGButton
        class="hover:tw-bg-default/80 tw-leading-4"
        :style="refreshButtonStyle"
        v-if="showRefreshButton"
        @click="refresh()"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          v-if="refreshButtonFormatting.iconOnly"
        >
          {{ buttonName }}
        </q-tooltip>
        <div class="tw-flex tw-items-center tw-gap-1">
          <div v-html="refreshButtonFormatting.icon"></div>
          <div v-if="!refreshButtonFormatting.iconOnly">{{ buttonName }}</div>
        </div>
      </AGButton>
    </div>
    <div
      class="tw-flex tw-items-center tw-whitespace-nowrap tw-gap-2 tw-absolute tw-p-2 tw-right-1 tw-top-1 tw-z-10 tw-bg-white tw-rounded-2xl tw-border"
      v-if="editMode"
    >
      <slot />
    </div>
  </div>
</template>
<script>
import { fetchVariables } from 'src/apis/dashboards';
import AGInput from 'components/base/input.vue';
import AGButton from 'components/base/button.vue';
import AGDatetimePicker from 'components/base/inputDatePicker.vue';
import { variableQuery } from 'stores/variableQuery';
export default {
  name: 'AGVariables',
  props: [
    'variableIDs',
    'editMode',
    'showRefreshButton',
    'buttonName',
    'showClearButton',
    'showResetButton',
    'clearButtonName',
    'resetButtonName',
    'refreshButtonFormatting',
    'clearButtonFormatting',
    'resetButtonFormatting',
  ],
  components: { AGInput, AGButton, AGDatetimePicker },
  watch: {
    variableIDs: {
      deep: true,
      handler() {
        this.setVariables();
      },
    },
    variables: {
      deep: true,
      handler() {
        this.variables &&
          this.variables.forEach((v) => {
            this.varStore.push(
              v.name,
              v.value || v.value === '' ? v.value : v.default
            );
          });
      },
    },
  },
  data() {
    return {
      variables: [],
      varStore: variableQuery(),
    };
  },

  mounted() {
    this.setVariables();
  },

  computed: {
    resetButtonStyle() {
      return this.buttonStyle(this.resetButtonFormatting);
    },
    clearButtonStyle() {
      return this.buttonStyle(this.clearButtonFormatting);
    },
    refreshButtonStyle() {
      return this.buttonStyle(this.refreshButtonFormatting);
    },
  },

  methods: {
    buttonStyle(formatting) {
      if (!formatting) {
        return {};
      }
      let style = {};
      style['color'] = formatting.textColor
        ? formatting.textColor
        : 'rgb(var(--color-white))';
      style['background-color'] = formatting.backgroundColor
        ? formatting.backgroundColor
        : 'var(--color-primary)';
      style['border-color'] = formatting.borderColor
        ? formatting.borderColor
        : 'var(--color-primary)';
      style['border-width'] = formatting.hasOwnProperty('borderThickness')
        ? formatting.borderThickness + 'px'
        : '1px';
      style['font-size'] = formatting.hasOwnProperty('fontSize')
        ? formatting.fontSize + 'rem'
        : '1rem';
      style['padding-top'] = formatting.hasOwnProperty('paddingY')
        ? formatting.paddingY + 'rem'
        : '0.5rem';
      style['padding-bottom'] = formatting.hasOwnProperty('paddingY')
        ? formatting.paddingY + 'rem'
        : '0.5rem';
      style['padding-left'] = formatting.hasOwnProperty('paddingX')
        ? formatting.paddingX + 'rem'
        : '1rem';
      style['padding-right'] = formatting.hasOwnProperty('paddingX')
        ? formatting.paddingX + 'rem'
        : '1rem';
      style['font-weight'] = formatting.fontWeight
        ? formatting.fontWeight === 'semibold'
          ? 600
          : formatting.fontSize
        : 600;
      return style;
    },
    refresh() {
      this.varStore.updateQuery(this.$router);
      window.postMessage({
        message: 'ag_refresh_dashboard',
        payload: JSON.stringify({ changed: this.variables.map((v) => v.name) }),
      });
    },

    clear() {
      this.variables.forEach((v) => {
        v.value = '';
        if (v.var_type == 'Date') {
          v.clearCount = v.hasOwnProperty('clearCount') ? v.clearCount + 1 : 0;
        }
      });
    },

    reset() {
      this.variables.forEach((v) => {
        v.value = null;
      });
    },
    setVariables() {
      fetchVariables(this.variableIDs, (variables, loading) => {
        this.variables =
          variables &&
          variables.map((v) => {
            v.value = this.varStore.get(this.varStore.hashed(v.name));
            return v;
          });
      });
    },
  },
};
</script>
