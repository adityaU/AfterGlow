<style lang="scss">
.grid-widget .overlay {
  display: none;
}
.grid-widget:hover .overlay {
  display: flex;
}
.custom-list-grid-stack > .grid-stack-item {
  $gridstack-columns: 512;

  min-width: 100% / $gridstack-columns;

  @for $i from 0 through $gridstack-columns {
    &[gs-w='#{$i}'] {
      width: (100% / $gridstack-columns) * $i;
    }
    &[gs-x='#{$i}'] {
      left: (100% / $gridstack-columns) * $i;
    }
    &[gs-min-w='#{$i}'] {
      min-width: (100% / $gridstack-columns) * $i;
    }
    &[gs-max-w='#{$i}'] {
      max-width: (100% / $gridstack-columns) * $i;
    }
  }
}

.custom-list-grid-stack > .grid-stack-item > .grid-stack-item-content {
  inset: 0px !important;
}

.custom-list-grid-stack td {
  max-width: 100% !important;
  width: 100%;
  white-space: normal;
}
</style>
<template>
  <div>
    <div class="tw-pl-6 tw-pr-4 tw-py-2 tw-border-b">
      <div
        class="tw-flex tw-items-center tw-gap-2 tw-font-semibold"
        @click="accordionBehaviour('showData')"
      >
        <ChevronRightIcon
          v-if="!showData"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon v-if="showData" size="14" class="tw-cursor-pointer" />
        Data & API Actions
      </div>
      <div class="tw-pl-6 tw-mt-2" v-if="showData">
        <AGTableSettings
          class="tw-bg-white tw-overflow-auto tw-rounded-sm"
          @settings="(val) => updateSettings(val)"
          :columns="columns"
          :rows="rows"
          :colDetails="colDetails"
          :queryKey="queryKey"
          :apiActionsQuesLevel="apiActionsQuesLevel"
          :additionalProps="additionalProps"
          :questionID="questionID"
          :visualizationID="visualizationID"
          :settings="settingsLocal"
          @updateApiActions="$emit('updateApiActions')"
          allHidden="true"
        />
      </div>
    </div>
    <!-- <div class="tw-pl-6 tw-pr-4 tw-py-2 tw-border-b" > -->
    <!--   <div class="tw-flex tw-items-center tw-gap-2 tw-font-semibold" @click="accordionBehaviour('showStaticElements')"> -->
    <!--     <ChevronRightIcon v-if="!showStaticElements" size="14" class="tw-cursor-pointer"/> -->
    <!--     <ChevronDownIcon v-if="showStaticElements"   size="14" class="tw-cursor-pointer"/> -->
    <!--     Static Elements -->
    <!--   </div> -->
    <!--   <div class="tw-pl-6  tw-mt-2" v-if="showStaticElements"> -->
    <!--     <div class="" v-for="element in settingsLocal.staticElements" :key="element"> -->
    <!--     <div class="tw-flex" > -->
    <!--       icon -->
    <!--         {{element.name}} as {{element.displayName || element.name}}  -->
    <!--     </div> -->
    <!--     <div class="tw-flex tw-justify-end tw-text-primary tw-text-sm tw-font-semibold tw-cursor-pointer" @click="addStaticElement()"> -->
    <!--       + Add Element -->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </div> -->
    <div class="tw-pl-6 tw-pr-4 tw-py-2 tw-border-b">
      <div
        class="tw-flex tw-items-center tw-gap-2 tw-font-semibold"
        @click="accordionBehaviour('showFormattingOptions')"
      >
        <ChevronRightIcon
          v-if="!showFormattingOptions"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          v-if="showFormattingOptions"
          size="14"
          class="tw-cursor-pointer"
        />
        Formatting Options
      </div>
      <div class="tw-pl-6 tw-mt-2" v-if="showFormattingOptions">
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Shadow:</div>
          <BoxSelect
            class="tw-px-0"
            v-model:selected="settingsLocal.formattingSettings.boxShadow"
            :options="boxShadowOptions"
          />
        </div>

        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Show Border:</div>
          <AGBool v-model:val="settingsLocal.formattingSettings.showBorder" />
        </div>
        <template v-if="settingsLocal.formattingSettings.showBorder">
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Border Thickness:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.formattingSettings.borderThickness"
              step="1"
              :min="0"
              :max="10"
              color="primary"
              label
            />
          </div>
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Border Radius:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.formattingSettings.borderRadius"
              step="1"
              :min="0"
              :max="10"
              color="primary"
              label
            />
          </div>
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Border Color:</div>
            <AGColorSelector
              naked="true"
              v-model:selectedColor="
                settingsLocal.formattingSettings.borderColor
              "
            />
          </div>
        </template>
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Background Color:</div>
          <AGColorSelector
            naked="true"
            v-model:selectedColor="
              settingsLocal.formattingSettings.backgroundColor
            "
          />
        </div>
        <AGSelect
          class="tw-flex tw-items-center item-3070-columns tw-mb-2"
          :options="justifyOptions"
          v-model:selected="settingsLocal.formattingSettings.justifyContainer"
          label="Container Items Alignment"
          hideSearch="true"
          canNotDeselect="true"
        />
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Container Items Gap:</div>
          <q-slider
            class="tw-px-1"
            v-model="settingsLocal.formattingSettings.gap"
            step="0.125"
            :min="0"
            :max="10"
            color="primary"
            label
          />
        </div>
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Page Size</div>
          <AGInput
            placeholder="Page Size"
            v-model:value="settingsLocal.formattingSettings.pageSize"
            type="number"
            debounce="300"
          />
        </div>
        <AGSelect
          class="tw-flex tw-items-center item-3070-columns tw-mb-2"
          :options="justifyOptions"
          v-model:selected="
            settingsLocal.formattingSettings.justifyLocalFilters
          "
          label="Local Filters Position"
          hideSearch="true"
          canNotDeselect="true"
        />
      </div>
    </div>
    <Teleport to="#settings-container">
      <div class="tw-flex tw-items-center tw-justify-center tw-min-h-[50px]">
        Consider this space your canvas, where you have the freedom to visually
        organize the column data or API Actions in any format you desire through
        dragging and resizing items. A preview of how your data will appear will
        be displayed below the canvas.
      </div>
      <div
        class="tw-p-2 tw-border tw-my-2 tw-border-t tw-bg-white tw-rounded-2xl"
        ref="canvas"
      >
        <div
          class="custom-list-grid-stack grid-stack tw-h-full tw-w-full tw-flex tw-min-h-[100px]"
          :class="gridClass"
          ref="grid"
        >
          <div
            class="tw-bg-secondary tw-absolute tw-left-0 tw-right-0 tw-top-0 tw-bottom-0 tw-flex tw-items-center tw-justify-center tw-text-2xl tw-text-default/50"
          >
            Canvas
          </div>
          <div
            class=""
            :style="{
              ...settingsLocal.widgetContainerStyle,
              ...(settingsLocal.widgetStaticStyle || {}),
            }"
          ></div>
          <template v-for="widget in widgets" :key="widget">
            <template v-if="widget.show">
              <GridWidget
                v-bind="widget"
                v-model:widID="widget.widID"
                :id="widID(widget)"
                class="grid-widget"
              >
                <div
                  class="overlay tw-font-semibold tw-absolute tw-left-0 tw-right-0 tw-bottom-0 tw-top-0 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-primary/80 tw-cursor-pointer tw-text-white"
                >
                  {{ widget.name }}
                  <ArrowsMoveIcon size="16" />
                </div>
                <template v-if="!widget.apiAction && widget.show">
                  <AGTDRenderer
                    :colDetails="colDetails"
                    :value="
                      firstRow[widget.name] && firstRow[widget.name].value
                    "
                    :columns="widgets"
                    :index="index(widget.name)"
                    showFilters="false"
                    isColumnObject="true"
                    :formattingSettings="widget.formattingSettings"
                  />
                </template>
                <template v-if="widget.apiAction && widget.show">
                  <ApiActionLink
                    :link="makeLink(widget)"
                    :queryKey="queryKey"
                  />
                </template>
              </GridWidget>
            </template>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script>
import AGTableSettings from 'components/dataRenderers/charts/settings/tableSettings.vue';
import BoxSelect from 'components/base/boxSelect.vue';
import AGBool from 'components/base/bool.vue';
import AGSelect from 'components/base/select.vue';
import AGColorSelector from 'components/base/colorSelector.vue';
import AGInput from 'components/base/input.vue';

import AGTDRenderer from 'components/dataRenderers/charts/td/renderer.vue';
import ApiActionLink from 'components/apiActions/linkWithFormModal.vue';
import GridWidget from 'components/dataRenderers/charts/customListWidget.vue';

import { ArrowsMoveIcon } from 'vue-tabler-icons';
import 'gridstack/dist/gridstack.min.css';
import GridStack from 'gridstack/dist/gridstack-all';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

import { ChevronDownIcon, ChevronRightIcon } from 'vue-tabler-icons';

const containerShadows = {
  none: 'none',
  small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
  large: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
  'extra-large': '0 20px 25px -5px rgb(0 0 0 / 0.05)',
};

const newContainerFormatting = {
  boxShadow: 'none',
  showBorder: true,
  borderColor: 'var(--color-tertiary)',
  borderRadius: 1,
  borderThickness: 1,
  backgroundColor: 'rgb(var(--color-white))',
  justifyContainer: 'center',
  gap: 2,
  pageSize: 12,
  justifyLocalFilters: 'center',
};
export default {
  name: 'AGCustomListComponentSettings',
  props: [
    'columns',
    'rows',
    'colDetails',
    'queryKey',
    'apiActionsQuesLevel',
    'additionalProps',
    'questionID',
    'visualizationID',
    'settings',
    'size',
  ],
  components: {
    AGTableSettings,
    AGInput,
    AGBool,
    BoxSelect,
    AGSelect,
    ChevronRightIcon,
    ChevronDownIcon,
    AGColorSelector,
    ArrowsMoveIcon,
    AGTDRenderer,
    ApiActionLink,
    GridWidget,
  },
  created() {
    debounce(() => {
      this.setWidgetContainerStyle();
    }, 300)();
  },
  watch: {
    widgets: {
      deep: true,
      handler() {
        this.setFirstRow();
        this.$nextTick(() => {
          // this.makeWidgets()
          this.setGrid();
          this.setWidgetContainerStyle();
        });
      },
    },
    rows() {
      this.setFirstRow();
    },
    formattingSettings: {
      deep: true,
      handler() {
        this.setWidgetStaticStyle();
      },
    },

    size() {
      debounce(() => {
        this.setWidgetContainerStyle();
      }, 300)();
    },

    createrContainerDim: {
      deep: true,
      handler() {
        this.setWidgetStaticStyle();
      },
    },

    settingsLocal: {
      deep: true,
      handler() {
        this.$emit('settings', this.settingsLocal);
      },
    },
  },

  computed: {
    widgets() {
      return this.settingsLocal && this.settingsLocal.widgets;
    },
    formattingSettings() {
      return this.settingsLocal && this.settingsLocal.formattingSettings;
    },
    createrContainerDim() {
      return this.settingsLocal && this.settingsLocal.createrContainerDim;
    },
  },
  data() {
    const formattingSettings = this.settings
      ? {
          ...cloneDeep(newContainerFormatting),
          ...(this.settings.formattingSettings || {}),
        }
      : cloneDeep(newContainerFormatting);
    return {
      firstRow: {},
      editMode: true,
      grid: null,
      widgetContainerStyle: this.settings?.widgetContainerStyle || {},
      showFormattingOptions: false,
      showData: true,
      justifyOptions: [
        'start',
        'end',
        'center',
        'space-around',
        'space-between',
      ],
      settingsLocal: this.settings
        ? { ...this.settings, ...{ formattingSettings: formattingSettings } }
        : { formattingSettings: formattingSettings },
      boxShadowOptions: ['none', 'small', 'medium', 'large', 'extra-large'].map(
        (v) => {
          return { name: v, value: v };
        }
      ),
    };
  },

  methods: {
    index(columnName) {
      return (
        this.widgets && this.widgets.map((w) => w.name).indexOf(columnName)
      );
    },
    setWidgets() {
      const widgets = this.settingsLocal.widgets
        ? cloneDeep(this.settingsLocal.widgets)
        : [];
      const settingsColumns =
        this.settingsLocal && this.settingsLocal.columns
          ? cloneDeep(this.settingsLocal.columns)
          : [];
      let existingWidgetsMap = {};
      widgets.forEach((w) => {
        existingWidgetsMap[w.name] = w;
      });

      let maxHeight = 0;
      const newWidgets = settingsColumns.map((el) => {
        if (!el.show) {
          return el;
        }
        el.x =
          existingWidgetsMap[el.name] &&
          existingWidgetsMap[el.name].hasOwnProperty('x')
            ? existingWidgetsMap[el.name].x
            : 0;
        el.y =
          existingWidgetsMap[el.name] &&
          existingWidgetsMap[el.name].hasOwnProperty('y')
            ? existingWidgetsMap[el.name].y
            : maxHeight;
        el.w =
          existingWidgetsMap[el.name] &&
          existingWidgetsMap[el.name].hasOwnProperty('w')
            ? existingWidgetsMap[el.name].w
            : 96;
        el.h =
          existingWidgetsMap[el.name] &&
          existingWidgetsMap[el.name].hasOwnProperty('h')
            ? existingWidgetsMap[el.name].h
            : 10;
        maxHeight = el.y + el.h > maxHeight ? el.y + el.h : maxHeight;
        return el;
      });
      this.settingsLocal.widgets = newWidgets;
    },

    makeLink(w) {
      w.value = w.name;
      return w;
    },

    widID(widget) {
      const type = widget.apiAction
        ? `api-action-${widget.apiActionID}`
        : 'column';
      return `wid_${type}_${widget.name}`;
    },
    setWidgetContainerStyle() {
      let minX = Infinity;
      let minY = Infinity;
      let height = 0;
      let width = 0;

      this.widgets.forEach((w) => {
        minX = w.x < minX ? w.x : minX;
        minY = w.y < minY ? w.y : minY;
        height = w.y + w.h > height ? w.y + w.h : height;
        width = w.x + w.w > width ? w.x + w.w : width;
      });
      const canvasWidth = this.$refs['canvas']?.clientWidth || 0;
      this.settingsLocal.canvasWidth = canvasWidth;
      this.settingsLocal.createrContainerDim = {
        minX: minX * (1 / 512) * canvasWidth,
        minY: minY * 5,
        height: (height - minY) * 5,
        width: (width - minX) * (1 / 512) * canvasWidth,
      };
      this.settingsLocal.widgetContainerStyle = {
        position: 'absolute',
        top: minY * 5 + 'px',
        left: minX * (1 / 512) * canvasWidth + 'px',
        width: (width - minX) * (1 / 512) * canvasWidth + 'px',
        height: (height - minY) * 5 + 'px',
      };
    },
    setGrid() {
      this.$nextTick(() => {
        this.grid && this.grid.destroy(false);
        if (this.$refs['grid']) {
          this.grid = GridStack.init({
            cellHeight: '5',
            draggable: {
              handle: '.grid-drag',
            },
            float: true,
            resizable: {
              handles: 'n,ne,e,se,s,sw,w,nw',
            },
            column: 512,
          });
          this.grid && this.grid.on('resizestop', this.updateWidgets);
          this.grid && this.grid.on('dragstop', this.updateWidgets);
          this.grid && this.grid.setStatic(!this.editMode);
        }
      });
    },
    setWidgetStaticStyle() {
      if (
        !(
          this.settingsLocal &&
          this.settingsLocal.formattingSettings &&
          this.createrContainerDim
        )
      ) {
        return {};
      }

      const fs = this.settingsLocal.formattingSettings;
      let style = {};
      if (fs.showBorder) {
        style['border'] = `${fs.borderThickness || 1}px solid ${
          fs.borderColor
        }`;
        style['border-radius'] = fs.borderRadius + 'rem' || '0.125rem';
      }
      style['box-shadow'] = containerShadows[fs.boxShadow || 'none'];
      style['backgroundColor'] = fs.backgroundColor
        ? fs.backgroundColor
        : 'rgb(var(--color-white))';
      style['width'] = this.settingsLocal.widgetContainerStyle['width'];
      style['height'] = this.settingsLocal.widgetContainerStyle['height'];
      this.settingsLocal.widgetStaticStyle = style;
    },
    updateWidgets() {
      this.$nextTick(() => {
        let existingWidgetsMap = {};
        this.widgets.forEach((w) => {
          existingWidgetsMap[this.widID(w)] = w;
        });

        const widgets =
          this.grid &&
          this.grid.engine.nodes.map((gn, i) => {
            let w = existingWidgetsMap[gn.id];
            w.x = gn.x;
            w.y = gn.y;
            w.w = gn.w;
            w.h = gn.h;
            return w;
          });
        this.settingsLocal.widgets = widgets || [];
      });
    },
    setFirstRow() {
      let firstRow = {};
      this.settingsLocal &&
        this.settingsLocal.columns.forEach((element) => {
          if (!element.show) {
            return;
          }
          if (!element.apiAction) {
            let columnIndex = this.columns.indexOf(element.name);
            firstRow[element.name] = {
              conf: element,
              value: this.rows[0][columnIndex],
            };
          } else {
            firstRow[element.name] = {
              conf: element,
              value: element.name,
              name: element.name,
              details: element.details,
            };
          }
        });
      this.firstRow = firstRow;
    },

    updateSettings(val) {
      debounce(() => {
        this.settingsLocal = {
          ...this.settingsLocal,
          ...{ columns: val.columns || [] },
        };
        this.setWidgets();
      }, 100)();
    },

    addStaticElement() {
      if (!this.settingsLocal.staticElements) {
        this.settingsLocal.staticElements = [];
      }
      this.settingsLocal.staticElements.push(cloneDeep(newStaticElement));
    },

    accordionBehaviour(value) {
      if (this[value]) {
        this[value] = !this[value];
        return;
      }

      this.showData = false;
      this.showFormattingOptions = false;
      this.showStaticElements = false;

      this[value] = true;
    },
  },
};
</script>
