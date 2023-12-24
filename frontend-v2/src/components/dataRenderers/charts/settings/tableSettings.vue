<template>
  <div class="tw-divide-y">
    <AGStagedContainer :stages="stages" :currentStage="currentStage">
      <template #header>
        <div
          class="tw-p-2 tw-text-primary tw-flex tw-items-center tw-gap-2"
          v-if="currentStage == 1"
        >
          <div class="tw-flex tw-items-center tw-gap-2 tw-flex-1">
            <ArrowLeftIcon
              size="16"
              class="tw-cursor-pointer"
              @click="((currentStage = 0) || true) && (editingColumn = null)"
            />
            <div
              class="tw-text-primary tw-font-semibold"
              @click="((currentStage = 0) || true) && (editingColumn = null)"
            >
              {{ editingColumn.name }}
            </div>
          </div>
        </div>
        <div
          class="tw-p-2 tw-text-primary tw-flex tw-items-center tw-gap-2"
          v-if="currentStage == 2"
        >
          <div class="tw-flex tw-items-center tw-gap-2 tw-flex-1">
            <ArrowLeftIcon
              size="16"
              class="tw-cursor-pointer"
              @click="((currentStage = 0) || true) && (editingApiAction = null)"
            />
            <div
              class="tw-text-primary tw-font-semibold"
              @click="((currentStage = 0) || true) && (editingApiAction = null)"
            >
              {{ editingApiAction.name }}
            </div>
          </div>
        </div>
      </template>
      <template #S1>
        <div class="tw-w-full" v-if="settingsLocal">
          <draggable
            class="tw-divide-y"
            v-model="settingsLocal.columns"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            item-key="order"
          >
            <template #item="{ element }">
              <div class="tw-flex tw-items-center tw-p-2 tw-gap-2">
                <div class="">
                  <div class="tw-cursor-pointer" v-if="!allHidden">
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Reorder</q-tooltip
                    >
                    <MenuIcon
                      class="tw-w-5 tw-h-5 tw-stroke-primary tw-inline"
                    />
                  </div>
                </div>
                <div class="">
                  <div class="tw-flex tw-items-center">
                    <div
                      class="text-icon-primary tw-inline-block"
                      v-if="!element.apiAction"
                    >
                      C
                    </div>
                    <div
                      class="text-icon-primary tw-inline-block tw-bg-red-900"
                      v-if="element.apiAction"
                    >
                      A
                    </div>
                    <div class="tw-flex tw-items-center tw-gap-1 tw-flex-wrap">
                      {{ element.name }}
                      <div>as</div>
                      <div
                        class="tw-border tw-cursor-pointer tw-rounded-2xl tw-px-4 tw-py-1"
                      >
                        {{ element.displayName || element.name }}
                        <q-menu
                          flat="true"
                          transition-show="scale"
                          transition-hide="scale"
                          max-height="400px"
                          :offset="[0, 5]"
                          class="tw-rounded-full tw-border tw-overflow-hidden"
                          @show="menuShow"
                          @keydown="onKeydown"
                        >
                          <AGInput
                            v-model:value="element.displayName"
                            class="tw-block"
                            invisible="true"
                            debounce="300"
                          />
                        </q-menu>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-1"
                >
                  <div
                    class="tw-cursor-pointer"
                    @click="
                      ((editingApiAction = element.details) || true) &&
                        (newApiActionModalOpen = true)
                    "
                    v-if="element.apiAction"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Edit API Action
                    </q-tooltip>
                    <EditIcon class="tw-stroke-primary" size="16" />
                  </div>
                  <div
                    class="tw-cursor-pointer"
                    @click="
                      ((editingApiAction = element.details) || true) &&
                        (deleteApiActionModalOpen = true)
                    "
                    v-if="element.apiAction"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Delete API Action
                    </q-tooltip>
                    <XIcon class="tw-stroke-red-500" size="16" />
                  </div>

                  <div
                    class="tw-cursor-pointer tw-text-primary"
                    v-if="!element.apiAction"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale"
                      >Copy Paste Formatting</q-tooltip
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
                        @click="copyFormattingConfig(element)"
                        v-close-popup
                      >
                        Copy Column Formatting
                      </div>
                      <div
                        class="menu-item"
                        @click="pasteFormattingConfig(element)"
                        v-close-popup
                      >
                        Paste Column Formatting
                      </div>
                      <div
                        class="menu-item"
                        @click="resetFormatting(element)"
                        v-close-popup
                      >
                        Reset Formatting
                      </div>
                    </q-menu>
                  </div>

                  <div
                    class="tw-cursor-pointer"
                    @click="
                      ((currentStage = 2) || true) &&
                        (editingApiAction = element)
                    "
                    v-if="element.apiAction"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Api Action Formatting
                    </q-tooltip>
                    <BaselineIcon
                      size="16"
                      :class="
                        element.show ? 'tw-stroke-primary' : 'tw-stroke-default'
                      "
                    />
                  </div>

                  <div
                    class="tw-cursor-pointer"
                    @click="
                      ((currentStage = 1) || true) && (editingColumn = element)
                    "
                    v-if="!element.apiAction"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Column Formatting
                    </q-tooltip>
                    <BaselineIcon
                      size="16"
                      :class="
                        element.show ? 'tw-stroke-primary' : 'tw-stroke-default'
                      "
                    />
                  </div>
                  <div
                    class="tw-cursor-pointer"
                    @click="element.showLocalFilter = !element.showLocalFilter"
                    v-if="!element.apiAction"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      {{
                        element.showLocalFilter
                          ? 'Hide Local Filter'
                          : 'Show Local Filter'
                      }}
                      - Local Filters are also visible on dashboards.
                    </q-tooltip>
                    <FilterIcon
                      size="16"
                      class="tw-stroke-primary"
                      v-if="element.showLocalFilter"
                    />
                    <FilterOffIcon
                      size="16"
                      class="tw-stroke-primary"
                      v-if="!element.showLocalFilter"
                    />
                  </div>
                  <div
                    class="tw-cursor-pointer"
                    @click="element.show = !element.show"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      {{ element.show ? 'Hide' : 'Show' }}
                    </q-tooltip>
                    <EyeIcon
                      size="16"
                      v-if="element.show"
                      :class="
                        element.show ? 'tw-stroke-primary' : 'tw-stroke-default'
                      "
                    />

                    <EyeOffIcon
                      size="16"
                      v-if="!element.show"
                      :class="
                        element.show ? 'tw-stroke-primary' : 'tw-stroke-default'
                      "
                    />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          <NewApiAction
            v-model:open="newApiActionModalOpen"
            :apiAction="editingApiAction"
            :queryKey="queryKey"
            :visualizationID="visualizationID"
            :questionID="questionID"
            :key="{
              apiAction: editingApiAction,
              key: newApiActionFormModalOpen,
            }"
            @editForm="
              (newApiActionFormModalOpen = true) &&
                (newApiActionModalOpen = false)
            "
            @update:apiAction="$emit('updateApiActions')"
          />

          <NewApiActionChoice
            v-model:open="newApiActionChoiceModalOpen"
            v-model:showForm="newApiActionFormModalOpen"
            v-model:showNewApiAction="newApiActionModalOpen"
            :key="editingApiAction"
          />
          <NewApiActionForm
            v-model:open="newApiActionFormModalOpen"
            :queryKey="queryKey"
            v-model:showNewApiAction="newApiActionModalOpen"
            v-model:form="editingApiAction.display_settings.form"
            :columns="columns"
            :colDetails="colDetails"
            :key="newApiActionFormModalOpen"
            v-if="editingApiAction?.display_settings"
          />
          <DeleteApiAction
            v-model:open="deleteApiActionModalOpen"
            :apiActionID="editingApiAction && editingApiAction.id"
            :queryKey="queryKey"
            :key="editingApiAction && editingApiAction.id"
            @update:apiAction="$emit('updateApiActions')"
          />
          <AGButton
            class="tw-border-0 tw-text-primary tw-font-semibold tw-float-right"
            @clicked="
              ((editingApiAction = cloneDeep(newApiAction)) || true) &&
                (newApiActionChoiceModalOpen = true)
            "
            v-if="questionID != null && questionID != 'null'"
          >
            <PlusIcon class="tw-inline" size="14" /> API Action
          </AGButton>
        </div>
      </template>

      <template #S2>
        <AGConditionalFormattingSettings
          v-model:settings="editingColumn.formattingSettings"
          :columnName="editingColumn.name"
          :key="editingColumn"
          :colDetails="colDetails"
        />
      </template>
      <template #S3>
        <AGDataFormattingSetting
          class="tw-mt-2"
          v-model:settings="editingApiAction.formattingSettings"
          dataType="text"
        />
      </template>
    </AGStagedContainer>
    <AGToast :type="toastType" v-model:show="toastShow">
      {{ toastText }}
    </AGToast>
  </div>
</template>

<script>
import {
  MenuIcon,
  Menu2Icon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  EditIcon,
  XIcon,
  BaselineIcon,
  ArrowLeftIcon,
  FilterIcon,
  FilterOffIcon,
} from 'vue-tabler-icons';

import NewApiAction from 'components/apiActions/new.vue';
import NewApiActionForm from 'components/apiActions/newForm.vue';
import NewApiActionChoice from 'components/apiActions/choice.vue';
import DeleteApiAction from 'components/apiActions/delete.vue';
import AGButton from 'components/base/button.vue';
import AGStagedContainer from 'components/base/stagedContainer.vue';
import AGConditionalFormattingSettings from 'components/widgets/tableWidgets/conditional/settings.vue';
import AGDataFormattingSetting from 'components/widgets/tableWidgets/dataFormatting/settings.vue';
import AGInput from 'components/base/input.vue';
import AGToast from 'components/utils/toast.vue';

import draggable from 'vuedraggable';

import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'TableSettings',
  components: {
    draggable,
    MenuIcon,
    Menu2Icon,
    EyeIcon,
    EyeOffIcon,
    PlusIcon,
    ArrowLeftIcon,
    BaselineIcon,
    NewApiAction,
    AGButton,
    EditIcon,
    DeleteApiAction,
    XIcon,
    AGStagedContainer,
    AGConditionalFormattingSettings,
    AGInput,
    AGToast,
    AGDataFormattingSetting,
    NewApiActionChoice,
    NewApiActionForm,
    FilterIcon,
    FilterOffIcon,
  },
  props: [
    'columns',
    'settings',
    'apiActionsQuesLevel',
    'queryKey',
    'visualizationID',
    'questionID',
    'colDetails',
    'allHidden',
    'guessed_formats',
  ],

  computed: {
    newApiAction() {
      return {
        display_settings: {
          renderForm: false,
          form: {},
        },
      };
    },
  },

  data() {
    let settings = cloneDeep(this.settings);
    let settingsLocal = this.setupColumns(settings);
    this.$emit('settings', settingsLocal);
    return {
      currentStage: 0,
      cloneDeep: cloneDeep,
      settingsLocal: settingsLocal,
      newApiActionModalOpen: false,
      newApiActionChoiceModalOpen: false,
      newApiActionFormModalOpen: false,
      deleteApiActionModalOpen: false,
      editingColumn: null,
      editingApiAction: null,
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      },
      stages: [{ name: 'S1' }, { name: 'S2' }, { name: 'S3' }],
      toastShow: false,
      toastText: null,
      toastType: null,
    };
  },
  watch: {
    newApiActionFormModalOpen() {
      if (this.newApiActionFormModalOpen) {
        this.editingApiAction &&
          (this.editingApiAction.display_settings.renderForm = true);
      }
    },
    columns: {
      deep: true,
      handler() {
        this.settingsLocal = this.setupColumns(this.settingsLocal);
      },
    },

    editingColumn() {
      this.settingsLocal.towardsBase = true;
    },

    apiActionsVizLevel: {
      deep: true,
      handler() {
        this.settingsLocal = this.setupColumns(this.settingsLocal);
      },
    },
    apiActionsQuesLevel: {
      deep: true,
      handler() {
        this.settingsLocal = this.setupColumns(this.settingsLocal);
      },
    },
    settingsLocal: {
      handler() {
        this.$emit('settings', this.settingsLocal);
      },
      deep: true,
    },
  },

  methods: {
    copyFormattingConfig(column) {
      if (!column.formattingSettings) {
        navigator.clipboard.writeText(null);
        return;
      }
      navigator.clipboard.writeText(JSON.stringify(column.formattingSettings));
    },
    pasteFormattingConfig(column) {
      navigator.clipboard.readText().then((settings) => {
        if (!this.validateFormatting(settings)) {
          return;
        }
        column.formattingSettings = JSON.parse(settings);
      });
    },
    resetFormatting(column) {
      column.formattingSettings = null;
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
        this.showToast('critical', 'Invalid Settings');
        return false;
      }
      if (!settings || !Array.isArray(settings)) {
        this.showToast('critical', 'Invalid Settings');
        return false;
      }
      let isValid = true;
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
      settings &&
        Array.isArray(settings) &&
        settings.forEach((data, i) => {
          mustHaves.forEach((key) => {
            if (
              Object.entries(data.apply)
                .map((el) => el[0])
                .indexOf(key) < 0
            ) {
              this.showToast(
                'critical',
                `Invalid Settings: Key: ${key} missing from Entry: #${i} `
              );
              isValid = false;
              return;
            }
          });
          if (!isValid) {
            return;
          }
        });
      return isValid;
    },
    setUpUrl(colSettings, item) {
      let taggables =
        this.guessed_formats
          ?.filter((item) => item.format == 'url')
          .map((item) => item.column) || [];
      if (taggables.indexOf(item) >= 0) {
        colSettings.formattingSettings = [
          {
            default: true,
            operation: '=',
            value: null,
            apply: {
              type: 'Url',
              textColor: 'var(--color-primary)',
              backgroundColor: 'transparent',
              displayText: '{{columnValue}}',
              url: '{{columnValue}}',
              imageShape: 'round',
              ratingColor: 'rgb(var(--color-default))',
              maximum: 5,
              progressMaximum: 100,
              progressColor: 'rgb(var(--color-default))',
              borderColor: '#fff',
              containerBorderColor: 'transparent',
              containerBorderRadius: '0',
              containerBorderPosition: [],
              containerBackgroundColor: 'transparent',
              containerBorderThickness: 0,
              parentBackgroundColor: 'transparent',
              fontSize: 1,
              fontWeight: 'normal',
              imageHeight: 3,
              imageWidth: 3,
              imageBorderRadius: 0.125,
              horizontalAlignment: 'left',
              verticalAlignment: 'center',
              showLabel: false,
              labelFontSize: '1rem',
              labelFontWeight: 'semibold',
              labelPosition: 'left-center',
              labelColor: 'rgb(var(--color-default))',
              paddingX: 1,
              paddingY: 0.5,
              iconGap: 0.5,
              openInNewTab: true,
              underline: false,
            },
            show: true,
          },
        ];
      }
    },
    setUpRating(colSettings, item) {
      let taggables =
        this.guessed_formats
          ?.filter((item) => item.format == 'rating')
          .map((item) => item.column) || [];
      if (taggables.indexOf(item) >= 0) {
        colSettings.formattingSettings = [
          {
            default: true,
            operation: '=',
            value: null,
            apply: {
              type: 'Rating',
              textColor: 'inherit',
              backgroundColor: 'transparent',
              displayText: '{{columnValue}}',
              url: '{{columnValue}}',
              imageShape: 'round',
              ratingColor: 'var(--color-primary)',
              maximum: 5,
              progressMaximum: 100,
              progressColor: 'rgb(var(--color-default))',
              borderColor: '#fff',
              containerBorderColor: 'transparent',
              containerBorderRadius: '0',
              containerBorderPosition: [],
              containerBackgroundColor: 'transparent',
              containerBorderThickness: 0,
              parentBackgroundColor: 'transparent',
              fontSize: 1,
              fontWeight: 'normal',
              imageHeight: 3,
              imageWidth: 3,
              imageBorderRadius: 0.125,
              horizontalAlignment: 'left',
              verticalAlignment: 'center',
              showLabel: false,
              labelFontSize: '1rem',
              labelFontWeight: 'semibold',
              labelPosition: 'left-center',
              labelColor: 'var(--color-default)',
              paddingX: 1,
              paddingY: 0.5,
              iconGap: 0.5,
              openInNewTab: true,
              underline: false,
            },
            show: true,
          },
        ];
      }
    },
    setUpPhone(colSettings, item) {
      let taggables =
        this.guessed_formats
          ?.filter((item) => item.format == 'phone')
          .map((item) => item.column) || [];
      if (taggables.indexOf(item) >= 0) {
        colSettings.formattingSettings = [
          {
            default: true,
            operation: '=',
            value: null,
            apply: {
              type: 'Text',
              textColor: 'inherit',
              backgroundColor: 'transparent',
              displayText: '{{columnValue}}',
              url: '{{columnValue}}',
              imageShape: 'round',
              ratingColor: 'var(--color-default)',
              maximum: 5,
              progressMaximum: 100,
              progressColor: 'var(--color-default)',
              borderColor: '#fff',
              containerBorderColor: 'transparent',
              containerBorderRadius: '0',
              containerBorderPosition: [],
              containerBackgroundColor: 'transparent',
              containerBorderThickness: 0,
              parentBackgroundColor: 'transparent',
              fontSize: 1,
              fontWeight: 'normal',
              imageHeight: 3,
              imageWidth: 3,
              imageBorderRadius: 0.125,
              horizontalAlignment: 'left',
              verticalAlignment: 'center',
              showLabel: false,
              labelFontSize: '1rem',
              labelFontWeight: 'semibold',
              labelPosition: 'left-center',
              labelColor: 'var(--color-default)',
              paddingX: 1,
              paddingY: 0.5,
              iconGap: 0.5,
              openInNewTab: true,
              underline: false,
              prefix: {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-phone" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path> </svg>',
                color: 'var(--color-default)',
              },
            },
            show: true,
          },
        ];
      }
    },
    setupEmail(colSettings, item) {
      let taggables =
        this.guessed_formats
          ?.filter((item) => item.format == 'email')
          .map((item) => item.column) || [];
      if (taggables.indexOf(item) >= 0) {
        colSettings.formattingSettings = [
          {
            default: true,
            operation: '=',
            value: null,
            apply: {
              type: 'Text',
              textColor: 'inherit',
              backgroundColor: 'transparent',
              displayText: '{{columnValue}}',
              url: '{{columnValue}}',
              imageShape: 'round',
              ratingColor: 'var(--color-default)',
              maximum: 5,
              progressMaximum: 100,
              progressColor: 'var(--color-default)',
              borderColor: '#fff',
              containerBorderColor: 'transparent',
              containerBorderRadius: '0',
              containerBorderPosition: [],
              containerBackgroundColor: 'transparent',
              containerBorderThickness: 0,
              parentBackgroundColor: 'transparent',
              fontSize: 1,
              fontWeight: 'normal',
              imageHeight: 3,
              imageWidth: 3,
              imageBorderRadius: 0.125,
              horizontalAlignment: 'left',
              verticalAlignment: 'center',
              showLabel: false,
              labelFontSize: '1rem',
              labelFontWeight: 'semibold',
              labelPosition: 'left-center',
              labelColor: 'var(--color-default)',
              paddingX: 1,
              paddingY: 0.5,
              iconGap: 0.25,
              openInNewTab: true,
              underline: false,
              prefix: {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler icon-tabler-mail-forward" width="16px" height="16px" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>   <path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5"></path>   <path d="M3 6l9 6l9 -6"></path>   <path d="M15 18h6"></path>   <path d="M18 15l3 3l-3 3"></path> </svg>',
                color: 'var(--color-default)',
              },
            },
            show: true,
          },
        ];
      }
    },
    setupTaggables(colSettings, item) {
      let taggables =
        this.guessed_formats
          ?.filter((item) => item.format == 'tag')
          .map((item) => item.column) || [];
      if (taggables.indexOf(item) >= 0) {
        colSettings.formattingSettings = [
          {
            default: true,
            operation: '=',
            value: null,
            apply: {
              type: 'Tag',
              textColor: 'auto',
              backgroundColor: 'random',
              displayText: '{{columnValue}}',
              url: '{{columnValue}}',
              imageShape: 'round',
              ratingColor: 'var(--color-default)',
              maximum: 5,
              progressMaximum: 100,
              progressColor: 'var(--color-default)',
              borderColor: '#fff',
              containerBorderColor: 'transparent',
              containerBorderRadius: '0',
              containerBorderPosition: [],
              containerBackgroundColor: 'transparent',
              containerBorderThickness: 0,
              parentBackgroundColor: 'transparent',
              fontSize: 1,
              fontWeight: 'normal',
              imageHeight: 3,
              imageWidth: 3,
              imageBorderRadius: 0.125,
              horizontalAlignment: 'left',
              verticalAlignment: 'center',
              showLabel: false,
              labelFontSize: '1rem',
              labelFontWeight: 'semibold',
              labelPosition: 'left-center',
              labelColor: 'var(--color-default)',
              paddingX: 1,
              paddingY: 0.5,
              iconGap: 0.5,
              openInNewTab: true,
              underline: false,
            },
            show: false,
          },
        ];
      }
    },
    setupColumns(settings) {
      settings = cloneDeep(settings);
      const defaultShow = settings ? !this.allHidden : true;
      if (settings && settings.columns) {
        settings.columns = settings.columns.filter(
          (item) => this.columns.indexOf(item.name) >= 0 || item.apiAction
        );

        const existingColumns = settings.columns
          .filter((item) => !item.apiAction)
          .map((item) => item.name);
        let order = existingColumns.length;
        this.columns.forEach((col) => {
          if (existingColumns.indexOf(col) < 0) {
            let colSettings = {
              name: col,
              show: defaultShow,
              order: order + 1,
            };

            this.setupTaggables(colSettings, col);
            this.setUpUrl(colSettings, col);
            this.setUpRating(colSettings, col);
            this.setUpPhone(colSettings, col);
            this.setupEmail(colSettings, col);
            settings.columns.push();
            order += 1;
          }
        });
      } else {
        settings = {
          columns: this.columns
            ? this.columns.map((item, i) => {
                let colSettings = { name: item, show: defaultShow, order: i };
                this.setupTaggables(colSettings, item);
                this.setUpUrl(colSettings, item);
                this.setUpRating(colSettings, item);
                this.setUpPhone(colSettings, item);
                this.setupEmail(colSettings, item);
                return colSettings;
              })
            : [],
        };
      }

      if (this.apiActionsQuesLevel) {
        let order = settings.columns.length;
        const apiActionIDs =
          this.apiActionsQuesLevel &&
          this.apiActionsQuesLevel.map((aa) => aa.id);
        settings.columns = settings.columns.filter(
          (item) =>
            !item.apiAction || apiActionIDs.indexOf(item.apiActionID) >= 0
        );
        const existing = settings.columns
          .filter((col) => col.apiAction)
          .map((aa) => aa.apiActionID);
        this.apiActionsQuesLevel.forEach((apiAction) => {
          if (
            apiAction.visualization_id === null ||
            apiAction.visualization_id === this.visualizationID
          ) {
            if (existing.indexOf(apiAction.id) < 0) {
              settings.columns.push({
                name: apiAction.name,
                show: defaultShow,
                apiActionID: apiAction.id,
                order: order + 1,
                apiAction: true,
                details: apiAction,
              });
              order = order + 1;
            } else {
              let aa = settings.columns.filter(
                (col) => col.apiAction && col.apiActionID == apiAction.id
              )[0];
              aa.name = apiAction.name;
              aa.details = apiAction;
            }
          }
        });
      }
      settings.towardsBase = true;

      return settings;
    },
  },
};
</script>
