<template>
  <div>
    <div class="tw-pl-6 tw-pr-4 tw-py-2 tw-border-b">
      <div
        class="tw-flex tw-items-center tw-gap-2 tw-font-semibold"
        @click="accordionBehaviour('valueEssential')"
      >
        <ChevronRightIcon
          v-if="!valueEssential"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          v-if="valueEssential"
          size="14"
          class="tw-cursor-pointer"
        />
        Value Essentials
      </div>
      <div class="tw-pl-6 tw-mt-2" v-if="valueEssential">
        <AGSelect
          class="tw-flex tw-items-center item-3070-columns tw-mb-2"
          :options="widgetTypeOptions"
          v-model:selected="settingsLocal.type"
          label="Widget Type:"
          hideSearch="true"
          canNotDeselect="true"
        />

        <div v-if="['datetime', 'number'].indexOf(dataType) >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Format</div>
            <AGDataTypeFormats
              class="tw-p-0"
              v-model:format="settingsLocal.format"
              :dataType="dataType"
            />
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('displayText') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap">
            <div class="label tw-w-[30%]">Display Text</div>
            <AGInput
              class="tw-w-[70%]"
              v-model:value="settingsLocal.displayText"
              debounce="300"
            />

            <div class="note tw-w-[70%] tw-ml-[30%]">
              You can use {{ wrappedCollumnName }} in this field to show column
              value. Text Prefix and Suffix can be set here.
            </div>
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('openInNewTab') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap">
            <div class="label tw-w-[30%]">Open in New Tab</div>
            <AGBool v-model:value="settingsLocal.openInNewTab" />
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('underline') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap">
            <div class="label tw-w-[30%]">Show Underline</div>
            <AGBool v-model:value="settingsLocal.underline" />
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('url') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap">
            <div class="label tw-w-[30%]">Url</div>
            <AGInput class="tw-w-[70%]" v-model:value="settingsLocal.url" />
            <div class="note tw-w-[70%] tw-ml-[30%]">
              You can use {{ wrappedCollumnName }} to build url of the image.
              for example: https://cdn_url/{{ columnValue }}.png
            </div>
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('borderColor') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 tw-flex-wrap">
            <div class="label tw-w-[30%]">Border Color</div>
            <AGColorSelector
              naked="true"
              v-model:selectedColor="settingsLocal.borderColor"
              :additionalColors="additionalColors"
            />
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('imageShape') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Image Shape</div>
            <BoxSelect
              class="tw-px-0"
              v-model:selected="settingsLocal.imageShape"
              :options="imageShapeOptions"
            />
          </div>

          <div v-if="settingsLocal.imageShape === 'custom'">
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Image Width:</div>
              <q-slider
                class="tw-px-1"
                v-model="settingsLocal.imageWidth"
                step="1"
                :min="2"
                :max="100"
                color="primary"
                label
              />
            </div>
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Image height:</div>
              <q-slider
                class="tw-px-1"
                v-model="settingsLocal.imageHeight"
                step="1"
                :min="2"
                :max="100"
                color="primary"
                label
              />
            </div>
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Image Border Radius:</div>
              <q-slider
                class="tw-px-1"
                v-model="settingsLocal.imageBorderRadius"
                step="0.125"
                :min="0"
                :max="settingsLocal.imageHeight"
                color="primary"
                label
              />
            </div>
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('minMax') >= 0">
          <div class="tw-flex tw-flex-col">
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Color:</div>
              <AGColorSelector
                naked="true"
                v-model:selectedColor="settingsLocal.ratingColor"
                :additionalColors="additionalColors"
              />
            </div>

            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Maximum</div>
              <AGInput
                naked="true"
                v-model:value="settingsLocal.maximum"
                type="number"
              />
            </div>
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('progressMinMax') >= 0">
          <div class="tw-flex tw-flex-col">
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Color:</div>
              <AGColorSelector
                naked="true"
                v-model:selectedColor="settingsLocal.progressColor"
                :additionalColors="additionalColors"
              />
            </div>

            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Maximum</div>
              <AGInput
                naked="true"
                v-model:value="settingsLocal.progressMaximum"
                type="number"
              />
            </div>
          </div>
        </div>
        <div v-if="settingsOptions.indexOf('colors') >= 0">
          <div class="tw-flex tw-flex-col">
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Background Color:</div>
              <AGColorSelector
                naked="true"
                v-model:selectedColor="settingsLocal.backgroundColor"
                :additionalColors="additionalBackgroundColors"
                allowRandom="true"
              />
            </div>

            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Text Color:</div>
              <AGColorSelector
                naked="true"
                v-model:selectedColor="settingsLocal.textColor"
                :additionalColors="additionalColors"
                allowRandom="true"
                allowAuto="true"
              />
            </div>
          </div>
        </div>

        <div v-if="settingsOptions.indexOf('prefixSuffix') >= 0">
          <div class="tw-flex tw-flex-col" v-if="settingsLocal.prefix">
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Prefix Icon:</div>
              <AGIconSelector v-model:selected="settingsLocal.prefix.icon" />
            </div>
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Prefix Icon Color:</div>
              <AGColorSelector
                naked="true"
                v-model:selectedColor="settingsLocal.prefix.color"
                :additionalColors="additionalColors"
                allowAuto="true"
                allowRandom="true"
              />
            </div>
          </div>
          <div class="tw-flex tw-flex-col" v-if="settingsLocal.suffix">
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Suffix Icon:</div>
              <AGIconSelector v-model:selected="settingsLocal.suffix.icon" />
            </div>
            <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
              <div class="label">Suffix Icon Color:</div>
              <AGColorSelector
                naked="true"
                v-model:selectedColor="settingsLocal.suffix.color"
                :additionalColors="additionalColors"
                allowAuto="true"
                allowRandom="true"
              />
            </div>
          </div>
          <div
            class="tw-flex tw-items-center tw-mb-2 item-3070-columns"
            v-if="settingsLocal.prefix || settingsLocal.suffix"
          >
            <div class="label">Gap Between Icon and Text:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.iconGap"
              step="0.125"
              :min="0"
              :max="10"
              color="primary"
              label
            />
          </div>

          <div class="tw-flex tw-justify-end tw-gap-2">
            <div
              class="tw-cursor-pointer tw-text-primary tw-font-semibold tw-text-sm"
              @click="addPrefix"
              v-if="!settingsLocal.prefix"
            >
              Add Prefix Icon
            </div>
            <div
              class="tw-cursor-pointer tw-text-primary tw-font-semibold tw-text-sm"
              @click="addSuffix"
              v-if="!settingsLocal.suffix"
            >
              Add Suffix Icon
            </div>
            <div
              class="tw-cursor-pointer tw-text-red-700 tw-font-semibold tw-text-sm"
              @click="removePrefix"
              v-if="settingsLocal.prefix"
            >
              Remove Prefix Icon
            </div>
            <div
              class="tw-cursor-pointer tw-text-red-700 tw-font-semibold tw-text-sm"
              @click="removeSuffix"
              v-if="settingsLocal.suffix"
            >
              Remove Suffix Icon
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tw-pl-6 tw-pr-4 tw-py-2 tw-border-b">
      <div
        class="tw-flex tw-items-center tw-gap-2 tw-font-semibold"
        @click="accordionBehaviour('valueAdvancedFormatting')"
      >
        <ChevronRightIcon
          v-if="!valueAdvancedFormatting"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          v-if="valueAdvancedFormatting"
          size="14"
          class="tw-cursor-pointer"
        />
        Value Advanced
      </div>
      <div class="tw-pl-6 tw-mt-2" v-if="valueAdvancedFormatting">
        <div v-if="settingsOptions.indexOf('fontOptions') >= 0">
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Font Size:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.fontSize"
              step="0.125"
              :min="0"
              :max="10"
              color="primary"
              label
            />
          </div>
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Font Weight:</div>
            <BoxSelect
              class="tw-px-0"
              v-model:selected="settingsLocal.fontWeight"
              :options="fontWeightOptions"
            />
          </div>
        </div>

        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Padding X:</div>
          <q-slider
            class="tw-px-1"
            v-model="settingsLocal.paddingX"
            step="0.125"
            :min="0"
            :max="10"
            color="primary"
            label
          />
        </div>
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Padding Y:</div>
          <q-slider
            class="tw-px-1"
            v-model="settingsLocal.paddingY"
            step="0.125"
            :min="0"
            :max="10"
            color="primary"
            label
          />
        </div>

        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Horizontally Align:</div>
          <BoxSelect
            class="tw-px-0"
            v-model:selected="settingsLocal.horizontalAlignment"
            :options="horizontalAlignmentOptions"
          />
        </div>
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Vertically Align:</div>
          <BoxSelect
            class="tw-px-0"
            v-model:selected="settingsLocal.verticalAlignment"
            :options="verticalAlignmentOptions"
          />
        </div>
      </div>
    </div>

    <div class="tw-pl-6 tw-pr-4 tw-py-2 tw-border-b">
      <div
        class="tw-flex tw-items-center tw-gap-2 tw-font-semibold"
        @click="accordionBehaviour('labelFormatting')"
      >
        <ChevronRightIcon
          v-if="!labelFormatting"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          v-if="labelFormatting"
          size="14"
          class="tw-cursor-pointer"
        />
        Label
      </div>
      <div class="tw-pl-6 tw-mt-2" v-if="labelFormatting">
        <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
          <div class="label">Show Label:</div>
          <AGBool v-model:val="settingsLocal.showLabel" />
        </div>
        <div class="" v-if="settingsLocal.showLabel">
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Label Font Size:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.labelFontSize"
              step="0.125"
              :min="0"
              :max="10"
              color="primary"
              label
            />
          </div>
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Label Font Weight:</div>
            <BoxSelect
              class="tw-px-0"
              v-model:selected="settingsLocal.labelFontWeight"
              :options="fontWeightOptions"
            />
          </div>
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Label Color:</div>
            <AGColorSelector
              naked="true"
              v-model:selectedColor="settingsLocal.labelColor"
              :additionalColors="additionalColors"
            />
          </div>
          <AGSelect
            class="tw-flex tw-items-center item-3070-columns tw-mb-2"
            :options="labelPositionOptions"
            v-model:selected="settingsLocal.labelPosition"
            label="Label Position:"
            hideSearch="true"
            canNotDeselect="true"
          />
        </div>
      </div>
    </div>

    <div class="tw-pl-6 tw-pr-4 tw-pt-2">
      <div
        class="tw-flex tw-items-center tw-gap-2 tw-font-semibold"
        @click="accordionBehaviour('containerFormatting')"
      >
        <ChevronRightIcon
          v-if="!containerFormatting"
          size="14"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          v-if="containerFormatting"
          size="14"
          class="tw-cursor-pointer"
        />
        Container
      </div>
      <div class="tw-pl-6 tw-mt-2" v-if="containerFormatting">
        <div class="">
          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Container Background Color:</div>
            <AGColorSelector
              naked="true"
              v-model:selectedColor="settingsLocal.containerBackgroundColor"
              :additionalColors="additionalBackgroundColors"
              allowRandom="true"
            />
          </div>

          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Container Border Position:</div>
            <BoxSelect
              class="tw-px-0"
              v-model:selected="settingsLocal.containerBorderPosition"
              :options="borderPositionOptions"
              multi="true"
            />
          </div>

          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Container Border Color:</div>
            <AGColorSelector
              naked="true"
              v-model:selectedColor="settingsLocal.containerBorderColor"
              :additionalColors="additionalBackgroundColors"
              allowRandom="true"
            />
          </div>

          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Container Border Thickness:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.containerBorderThickness"
              step="1"
              :min="0"
              :max="10"
              color="primary"
              label
            />
          </div>

          <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns">
            <div class="label">Container Border Radius:</div>
            <q-slider
              class="tw-px-1"
              v-model="settingsLocal.containerBorderRadius"
              step="0.25"
              :min="0"
              :max="4"
              color="primary"
              label
            />
          </div>
          <!-- <div class="tw-flex tw-items-center tw-mb-2 item-3070-columns" > -->
          <!--   <div class="label" > -->
          <!--     Parent Background Color: -->
          <!--   </div> -->
          <!--   <AGColorSelector naked=true v-model:selectedColor="settingsLocal.parentBackgroundColor" :additionalColors="additionalBackgroundColors" /> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import AGInput from 'components/base/input.vue';
import AGBool from 'components/base/bool.vue';
import AGIconSelector from 'components/base/iconSelector.vue';
import AGColorSelector from 'components/base/colorSelector.vue';
import AGDataTypeFormats from 'components/widgets/tableWidgets/dataFormatting/dataTypeformats.vue';
import AGSelect from 'components/base/select.vue';
import BoxSelect from 'components/base/boxSelect.vue';

import { ChevronRightIcon, ChevronDownIcon } from 'vue-tabler-icons';

const settingsOptions = {
  Image: ['url', 'imageShape', 'borderColor'],
  Text: ['prefixSuffix', 'colors', 'displayText', 'fontOptions'],
  Url: [
    'prefixSuffix',
    'colors',
    'displayText',
    'fontOptions',
    'openInNewTab',
    'underline',
  ],
  Rating: ['minMax'],
  Tag: ['prefixSuffix', 'colors', 'displayText', 'fontOptions'],
  Button: ['prefixSuffix', 'colors', 'displayText', 'fontOptions'],
  'Progress Bar': ['progressMinMax'],
};
const newSettings = {
  type: 'Text',
  textColor: 'inherit',
  backgroundColor: 'transparent',
  displayText: '{{columnValue}}',
  url: '{{columnValue}}',
  imageShape: 'round',
  ratingColor: '#6e7687',
  maximum: 5,
  progressMaximum: 100,
  progressColor: '#6e7687',
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
  labelColor: '#6e7687',
  paddingX: 1,
  paddingY: 0.5,
  iconGap: 0.5,
  openInNewTab: true,
  underline: false,
};

const possibleWidgets = {
  datetime: ['Text', 'Tag'],
  number: ['Text', 'Rating', 'Tag', 'Progress Bar', 'Url'],
  boolean: ['Text', 'Tag'],
  text: ['Text', 'Tag', 'Image', 'Button', 'Url'],
};
export default {
  name: 'AGConditionalFormattingSettings',
  components: {
    AGInput,
    AGBool,
    AGIconSelector,
    AGColorSelector,
    AGSelect,
    BoxSelect,
    AGDataTypeFormats,
    ChevronDownIcon,
    ChevronRightIcon,
  },
  props: ['settings', 'dataType', 'displayName'],
  watch: {
    settingsLocal: {
      deep: true,
      handler() {
        this.$emit('update:settings', this.settingsLocal);
      },
    },
  },

  computed: {
    settingsOptions() {
      return settingsOptions[this.settingsLocal.type];
    },
    widgetTypeOptions() {
      return possibleWidgets[this.dataType];
    },
  },
  data() {
    return {
      valueEssential: true,
      valueAdvancedFormatting: false,
      containerFormatting: false,
      labelFormatting: false,
      settingsLocal: this.settings
        ? { ...cloneDeep(newSettings), ...cloneDeep(this.settings) }
        : cloneDeep(newSettings),
      wrappedCollumnName: '{{columnValue}}',
      additionalColors: ['white', '#6e7687', '#f5f7fb', '#e5e7eb'],
      additionalBackgroundColors: [
        'transparent',
        'white',
        '#6e7687',
        '#f5f7fb',
        '#e5e7eb',
      ],
      borderPositionOptions: ['left', 'right', 'top', 'bottom'].map((v) => {
        return { name: v, value: v };
      }),
      fontWeightOptions: ['normal', 'semibold', 'bold'].map((v) => {
        return { name: v, value: v };
      }),
      imageShapeOptions: ['round', 'square', 'custom'].map((v) => {
        return { name: v, value: v };
      }),
      horizontalAlignmentOptions: ['left', 'center', 'right'].map((v) => {
        return { name: v, value: v };
      }),
      verticalAlignmentOptions: ['top', 'center', 'bottom'].map((v) => {
        return { name: v, value: v };
      }),
      labelPositionOptions: [
        'left-top',
        'left-center',
        'left-bottom',
        'right-top',
        'right-center',
        'right-bottom',
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    };
  },

  methods: {
    addPrefix() {
      this.settingsLocal.prefix = { icon: null, color: '#6e7687' };
    },
    addSuffix() {
      this.settingsLocal.suffix = { icon: null, color: '#6e7687' };
    },
    removePrefix() {
      delete this.settingsLocal.prefix;
    },
    removeSuffix() {
      delete this.settingsLocal.suffix;
    },
    resetFormatting() {
      this.settingsLocal = cloneDeep(newSettings);
    },
    pasteFormatting(setting) {
      this.settingsLocal = setting;
    },
    accordionBehaviour(value) {
      if (this[value]) {
        this[value] = !this[value];
        return;
      }

      this.labelFormatting = false;
      this.containerFormatting = false;
      this.valueEssential = false;
      this.valueAdvancedFormatting = false;

      this[value] = true;
    },
  },
};
</script>
