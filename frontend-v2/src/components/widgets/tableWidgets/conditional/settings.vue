<template>
  <div>
    <div
      class="tw-border-b first:tw-border-t tw-pr-2 tw-py-2"
      v-for="(setting, i) in settingsLocal"
      :key="setting"
    >
      <div class="tw-flex tw-items-center tw-gap-2 tw-px-2">
        <ChevronRightIcon
          v-if="!setting.show"
          @click="setting.show = true"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          v-if="setting.show"
          @click="setting.show = false"
          size="14"
          class="tw-cursor-pointer"
        />
        <div
          class="tw-flex tw-gap-1 tw-items-center tw-font-semibold"
          v-if="!setting.default"
        >
          When
          <div class="tw-inline">
            {{ columnName }}
          </div>
          value
          <div class="tw-border tw-p-0.5 tw-leading-4">
            {{ setting.operation || 'empty' }}
            <q-menu
              flat="true"
              transition-show="scale"
              transition-hide="scale"
              max-height="400px"
              :offset="[0, 5]"
              class="tw-rounded-2xl tw-border tw-overflow-hidden"
              @show="menuShow"
              @keydown="onKeydown"
              auto-close
            >
              <BoxSelect
                class="tw-leading-4"
                v-model:selected="setting.operation"
                :options="operationValues"
              />
            </q-menu>
          </div>
          <div
            class=""
            v-if="['is not NULL', 'is NULL'].indexOf(setting.operation) < 0"
          >
            <div v-if="dataType == 'datetime'">
              <div class="tw-border tw-p-0.5 tw-leading-4">
                {{ dateDisplayText || 'empty' }}
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
                  <AGDatePicker
                    v-model:value="setting.value"
                    v-model:displayText="dateDisplayText"
                  />
                </q-menu>
              </div>
            </div>
            <div v-if="dataType == 'text'">
              <div class="tw-border tw-p-0.5 tw-leading-4">
                {{ setting.value || 'empty' }}
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
                  <AGInput
                    v-model:value="setting.value"
                    class="tw-block"
                    invisible="true"
                  />
                </q-menu>
              </div>
            </div>
            <div v-if="dataType == 'number'">
              <div class="tw-border tw-p-0.5 tw-leading-4">
                {{ setting.value || 'empty' }}
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
                  <AGInput
                    v-model:value="setting.value"
                    class="tw-block"
                    invisible="true"
                    type="number"
                  />
                </q-menu>
              </div>
            </div>
            <div v-if="dataType == 'boolean'">
              <div class="tw-border tw-p-0.5 tw-leading-4">
                {{
                  (setting.value != null && setting.value.toString()) || 'empty'
                }}
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
                  <BoxSelect
                    v-model:selected="setting.value"
                    :options="booleanOptions"
                  />
                </q-menu>
              </div>
            </div>
          </div>
        </div>
        <div class="tw-flex tw-font-semibold" v-if="setting.default">
          default:
        </div>
        <div
          class="tw-cursor-pointer tw-text-red-700 tw-font-semibold tw-flex tw-flex-1 tw-gap-2 tw-justify-end tw-text-sm tw-items-center"
        >
          <div v-if="!setting.default" @click="remove(i)">Remove</div>
          <div class="tw-cursor-pointer tw-text-primary">
            <q-tooltip transition-show="scale" transition-hide="scale"
              >Formatting Actions</q-tooltip
            >
            <Menu2Icon size="16" />
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
              <div
                class="menu-item"
                @click="copyFormattingConfig(setting)"
                v-close-popup
              >
                Copy Condition Formatting
              </div>
              <div
                class="menu-item"
                @click="pasteFormattingConfig(setting)"
                v-close-popup
              >
                Paste Condition Formatting
              </div>
              <div
                class="menu-item"
                @click="resetFormatting(setting)"
                v-close-popup
              >
                Clear Formatting
              </div>
            </q-menu>
          </div>
        </div>
      </div>
      <div v-if="setting.show" class="tw-w-full">
        <AGDataFormattingSetting
          class="tw-mt-2"
          v-model:settings="setting.apply"
          :dataType="dataType"
          :conditionHash="conditionHash(setting)"
          :ref="conditionHash(setting)"
        />
      </div>
    </div>
    <div
      class="tw-font-semibold tw-text-primary tw-py-2 tw-px-4 tw-text-sm tw-text-right tw-cursor-pointer"
      @click="addNewCondition"
    >
      + Add Condition
    </div>
    <AGToast :type="toastType" v-model:show="toastShow">
      {{ toastText }}
    </AGToast>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import AGDatePicker from 'components/base/datePicker.vue';
import AGToast from 'components/utils/toast.vue';
import { findDataType, operatorOptions } from 'src/helpers/dataTypes';
import AGInput from 'components/base/input.vue';
import BoxSelect from 'components/base/boxSelect.vue';
import { ChevronDownIcon, ChevronRightIcon, Menu2Icon } from 'vue-tabler-icons';
import AGDataFormattingSetting from 'components/widgets/tableWidgets/dataFormatting/settings.vue';
import hash from 'src/helpers/syncHash';

const newCondition = {
  default: true,
  operation: '=',
  value: null,
  apply: null,
  show: true,
};
export default {
  name: 'AGConditionalFormattingSettings',
  components: {
    AGInput,
    BoxSelect,
    ChevronRightIcon,
    ChevronDownIcon,
    AGDatePicker,
    AGDataFormattingSetting,
    Menu2Icon,
    AGToast,
  },
  props: ['settings', 'columnName', 'colDetails'],
  watch: {
    settingsLocal: {
      deep: true,
      handler() {
        this.$emit('update:settings', this.settingsLocal);
      },
    },
  },
  computed: {
    dataType() {
      return findDataType(this.colDetails, this.columnName);
    },
  },

  mounted() {
    this.$emit('update:settings', this.settingsLocal);
  },

  data() {
    return {
      defaultOperation: '=',
      booleanOptions: [true, false].map((v) => {
        return { name: v, value: v };
      }),
      operationValues: operatorOptions[
        findDataType(this.colDetails, this.columnName)
      ].map((v) => {
        return { name: v, value: v };
      }),
      settingsLocal: this.settings
        ? cloneDeep(this.settings)
        : [cloneDeep(newCondition)],
      dateDisplayText: null,
      toastShow: null,
      toastText: null,
      toastType: null,
    };
  },

  methods: {
    conditionHash(cond) {
      cond = cloneDeep(cond);
      delete cond['apply'];
      return 'cond_' + hash(JSON.stringify(cond)).slice(0, 10);
    },

    copyFormattingConfig(setting) {
      if (!setting.apply) {
        navigator.clipboard.writeText(null);
        return;
      }
      navigator.clipboard.writeText(JSON.stringify(setting.apply));
    },
    pasteFormattingConfig(setting) {
      navigator.clipboard.readText().then((settings) => {
        if (!this.validateFormatting(settings)) {
          return;
        }
        this.$refs[this.conditionHash(setting)][0].pasteFormatting(
          JSON.parse(settings)
        );
      });
    },
    resetFormatting(setting) {
      this.$refs[this.conditionHash(setting)][0].resetFormatting();
    },
    showToast(type, text) {
      this.toastShow = true;
      this.toastText = text;
      this.toastType = type;
    },

    validateFormatting(settings) {
      try {
        settings = JSON.parse(settings);
      } catch (e) {
        this.showToast('critical', 'Invalid Fromatting');
        return false;
      }
      let isValid = true;
      let settingKeys = Object.entries(settings).map((v) => v[0]);
      const mustHaves = [
        'type',
        'textColor',
        'backgroundColor',
        'displayText',
        'url',
        'imageShape',
        'ratingColor',
        'maximum',
        'progressMaximum',
        'progressColor',
        'borderColor',
      ];
      mustHaves.forEach((key) => {
        if (settingKeys.indexOf(key) < 0) {
          this.showToast(
            'critical',
            `Invalid Fromatting: Key: ${data[0]} missing `
          );
          isValid = false;
          return;
        }
      });
      return isValid;
    },
    addNewCondition() {
      let condition = cloneDeep(newCondition);
      condition.default = false;
      condition.show = true;
      this.settingsLocal.push(condition);
    },
    remove(i) {
      this.settingsLocal.splice(i, 1);
    },
  },
};
</script>
