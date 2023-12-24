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
  <Teleport to="body">
    <AGModal
      bodyClass="tw-grid tw-overflow-y-auto"
      :show="open"
      size="large"
      @update:show="(val) => $emit('update:show', val)"
      :loading="loading"
      :loadingMessage="loadingMessage"
      noHeader="true"
    >
      <template #footer>
        <div class="tw-flex tw-justify-end tw-p-2 tw-gap-2">
          <AGButton class="" @click="$emit('update:open', false)"
            >Cancel</AGButton
          >
          <AGButton
            class="tw-text-white tw-bg-primary"
            @click="
              ($emit('update:open', false) || true) &&
                $emit('update:showNewApiAction', true)
            "
          >
            Modify Submit Button API Action Configuration</AGButton
          >
        </div>
      </template>
      <template #body>
        <splitpanes
          class="pane-wrapper default-theme tw-flex"
          ref="chart-parent"
        >
          <pane :size="70" class="pane pane-left !tw-overflow-auto">
            <div class="tw-font-semibold tw-w-full tw-flex" :style="titleStyle">
              <div>{{ formTitle }}</div>
            </div>
            <div
              class="custom-list-grid-stack form-grid-stack grid-stack tw-h-fit tw-w-full tw-flex tw-min-h-[100px]"
              :class="gridClass"
              ref="grid"
            >
              <div
                class="tw-bg-secondary tw-absolute tw-left-0 tw-right-0 tw-top-0 tw-bottom-0 tw-flex tw-items-center tw-justify-center tw-text-2xl tw-text-default/50"
              >
                Fields
              </div>
              <template v-for="field in fields" :key="field">
                <template v-if="field.show && field.type != 'Button'">
                  <GridWidget
                    v-bind="field"
                    v-model:widID="field.label"
                    :id="field.label"
                    class="grid-widget"
                    :class="
                      editingField === field
                        ? 'tw-border-primary tw-border-2'
                        : 'nahi'
                    "
                  >
                    <div
                      class="overlay tw-z-10 tw-font-semibold tw-absolute tw-left-0 tw-right-0 tw-bottom-0 tw-top-0 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-primary/80 tw-cursor-pointer tw-text-white"
                    >
                      {{ field.label }}
                      <ArrowsMoveIcon size="16" />
                    </div>
                    <div
                      class="tw-w-full tw-h-full"
                      v-if="field.type === 'Field'"
                    >
                      <div
                        class="tw-flex tw-items-center item-3070-columns tw-w-full tw-px-2"
                      >
                        <div class="label">
                          {{ field.label }}
                        </div>
                        <component
                          :is="inputTypesRendererMapping[field.inputType]"
                          v-bind="field.rendererConfiguration"
                        ></component>
                      </div>
                      <div
                        class="note tw-ml-[30%] tw-pl-1"
                        v-if="field.helpText"
                      >
                        {{ field.helpText }}
                      </div>
                      <div
                        class="note tw-ml-[30%] tw-text-red-700 tw-pl-1"
                        v-if="
                          field.required ||
                          field.rendererConfiguration.validationType
                        "
                      >
                        Required / validation error will appear here.
                      </div>
                    </div>
                    <div
                      class="tw-flex tw-items-center item-3070-columns tw-w-full tw-p-2"
                      v-if="field.type === 'Note'"
                    >
                      <AGNote
                        v-model:id="field.noteID"
                        :queryKey="queryKey"
                        v-model:showEditor="field.showEditor"
                      />
                    </div>
                    <template v-if="field.type === 'Divider'">
                      <template
                        v-if="
                          field.rendererConfiguration.orientation ===
                          'horizontal'
                        "
                      >
                        <div class="tw-flex tw-items-center tw-w-full">
                          <div
                            class="tw-flex-1"
                            :style="{
                              'border-top': `1px solid ${field.rendererConfiguration.color}`,
                              height: '1px',
                              width: '100%',
                            }"
                          ></div>
                        </div>
                      </template>
                      <template
                        v-if="
                          field.rendererConfiguration.orientation === 'vertical'
                        "
                      >
                        <div class="tw-flex tw-justify-center tw-w-full">
                          <div
                            class=""
                            :style="{
                              'border-left': `1px solid ${field.rendererConfiguration.color}`,
                              width: '1px',
                              height: '100%',
                            }"
                          ></div>
                        </div>
                      </template>
                    </template>
                  </GridWidget>
                </template>
              </template>
            </div>

            <div
              class="custom-list-grid-stack form-button-grid-stack grid-stack tw-h-fit tw-w-full tw-flex tw-min-h-[100px]"
              :class="gridClass"
              ref="buttonGrid"
            >
              <div
                class="tw-bg-secondary tw-absolute tw-left-0 tw-right-0 tw-top-0 tw-bottom-0 tw-flex tw-items-center tw-justify-center tw-text-2xl tw-text-default/50"
              >
                Buttons
              </div>
              <template v-for="field in fields" :key="field">
                <template v-if="field.show && field.type === 'Button'">
                  <GridWidget
                    v-bind="field"
                    v-model:widID="field.label"
                    :id="field.label"
                    class="grid-widget"
                    :class="
                      editingField === field
                        ? 'tw-border-primary tw-border-2'
                        : 'nahi'
                    "
                  >
                    <div
                      class="overlay tw-z-10 tw-font-semibold tw-absolute tw-left-0 tw-right-0 tw-bottom-0 tw-top-0 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-primary/80 tw-cursor-pointer tw-text-white"
                    >
                      {{ field.label }}
                      <ArrowsMoveIcon size="16" />
                    </div>
                    <template v-if="field.type === 'Button'">
                      <AGButton
                        class="tw-w-full"
                        :style="{
                          color: field.rendererConfiguration.textColor,
                          'background-color':
                            field.rendererConfiguration.backgroundColor,
                        }"
                      >
                        {{ field.label }}
                      </AGButton>
                    </template>
                  </GridWidget>
                </template>
              </template>
            </div>
          </pane>
          <pane
            :size="30"
            ref="chart"
            class="pane pane-right !tw-border !tw-overflow-auto"
          >
            <div class="tw-bg-white tw-h-full">
              <template v-if="currentStage != 0">
                <div class="tw-flex tw-gap-2 tw-items-center tw-p-2">
                  <ArrowLeftIcon
                    size="16"
                    class="tw-stroke-primary tw-cursor-pointer"
                    @click="
                      ((currentStage = 0) || true) && (editingField = null)
                    "
                  />
                  <div
                    class="tw-text-primary tw-font-semibold"
                    v-if="editingField"
                  >
                    {{ editingField.label }}
                  </div>
                  <div
                    class="tw-text-primary tw-font-semibold"
                    v-if="currentStage === 2"
                  >
                    Form Title Formatting
                  </div>
                </div>
              </template>
              <AGStagedContainer :stages="stages" :currentStage="currentStage">
                <template #S1>
                  <div
                    class="tw-p-2 tw-border-b tw-font-semibold tw-text-primary"
                  >
                    Form Configuration
                  </div>
                  <div
                    class="tw-flex tw-items-center item-3070-columns tw-w-full tw-p-2 tw-border-b"
                  >
                    <div class="label">Modal Size</div>
                    <div class="tw-flex tw-items-center tw-gap-1">
                      <AGBoxSelect
                        v-model:selected="modalSize"
                        :options="modalSizeOptions"
                      />
                    </div>
                  </div>
                  <div
                    class="tw-flex tw-items-center item-3070-columns tw-w-full tw-p-2 tw-border-b"
                  >
                    <div class="label">Form Title</div>
                    <div class="tw-flex tw-items-center tw-gap-1">
                      <AGInput
                        v-model:value="formTitle"
                        class="tw-flex-1"
                        debounce="300"
                      />
                      <CodePlusIcon
                        size="16"
                        @click="currentStage = 2"
                        class="tw-stroke-primary"
                      />
                    </div>
                  </div>
                  <div
                    class="tw-flex tw-items-center tw-w-full tw-py-2 tw-px-2 tw-border-b last:tw-border-0"
                    v-for="field in fields"
                    :key="field"
                  >
                    <div class="tw-flex tw-gap-2 tw-items-center">
                      <div
                        class="text-icon-primary tw-inline-block"
                        v-if="field.type === 'Field'"
                      >
                        F
                      </div>
                      <div
                        class="text-icon-primary tw-inline-block tw-bg-red-700"
                        v-if="field.type === 'Button'"
                      >
                        B
                      </div>
                      <div
                        class="text-icon-primary tw-inline-block tw-bg-yellow-700"
                        v-if="field.type === 'Divider'"
                      >
                        D
                      </div>
                      <div
                        class="text-icon-primary tw-inline-block tw-bg-green-700"
                        v-if="field.type === 'Note'"
                      >
                        N
                      </div>
                      <div
                        class="tw-border tw-rounded-2xl tw-py-0.5 tw-leading-4 tw-px-1 tw-cursor-pointer"
                      >
                        {{ field.label }}
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
                          <AGInput v-model:value="field.label" />
                        </q-menu>
                      </div>
                      <template v-if="field.type == 'Field'">
                        as
                        <div
                          class="tw-border tw-rounded-2xl tw-py-0.5 tw-leading-4 tw-px-1 tw-cursor-pointer"
                        >
                          {{ field.inputType }}
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
                            <AGSelectOptions
                              :options="
                                typeBasedPossibleInputMapping[field.dataType]
                              "
                              :selected="field.inputType"
                              @select="
                                (val) =>
                                  ((field.inputType = val) || true) &&
                                  updateInputConfiguration(field, val)
                              "
                              hideSearch="true"
                            />
                          </q-menu>
                        </div>
                      </template>
                    </div>
                    <div
                      class="actions tw-flex tw-justify-end tw-flex-1 tw-gap-2"
                    >
                      <div
                        class="tw-cursor-pointer"
                        v-if="field.type === 'Field'"
                      >
                        <q-tooltip
                          class="tw-z-[200000]"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          Input Type Configuration
                        </q-tooltip>
                        <CodePlusIcon
                          class="tw-stroke-primary"
                          size="16"
                          @click="
                            ((currentStage = 1) || true) &&
                              (editingField = field)
                          "
                          v-if="field.show"
                        />
                      </div>

                      <div
                        class="tw-cursor-pointer"
                        v-if="field.type === 'Button'"
                      >
                        <q-tooltip
                          class="tw-z-[200000]"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          Button Configuration
                        </q-tooltip>
                        <CodePlusIcon
                          class="tw-stroke-primary"
                          size="16"
                          @click="
                            ((currentStage = 1) || true) &&
                              (editingField = field)
                          "
                          v-if="field.show"
                        />
                      </div>

                      <div
                        class="tw-cursor-pointer"
                        v-if="field.type === 'Divider'"
                      >
                        <q-tooltip
                          class="tw-z-[200000]"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          Divider Configuration
                        </q-tooltip>
                        <CodePlusIcon
                          class="tw-stroke-primary"
                          size="16"
                          @click="
                            ((currentStage = 1) || true) &&
                              (editingField = field)
                          "
                          v-if="field.show"
                        />
                      </div>
                      <div
                        class="tw-cursor-pointer"
                        v-if="field.type === 'Note'"
                      >
                        <q-tooltip
                          class="tw-z-[200000]"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          Edit Note
                        </q-tooltip>
                        <EditIcon
                          class="tw-stroke-primary"
                          size="16"
                          @click="field.showEditor = true"
                        />
                      </div>

                      <div class="tw-cursor-pointer" v-if="field.show">
                        <q-tooltip
                          class="tw-z-[200000]"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          Hide
                        </q-tooltip>
                        <EyeIcon
                          size="16"
                          class="tw-stroke-primary"
                          @click="
                            ((field.show = false) || true) && updateFields()
                          "
                        />
                      </div>
                      <div class="tw-cursor-pointer" v-if="!field.show">
                        <q-tooltip
                          class="tw-z-[200000]"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          Show
                        </q-tooltip>
                        <EyeOffIcon
                          size="16"
                          @click="
                            ((field.show = true) || true) && updateFields()
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <div class="tw-text-right">
                    <div
                      class="tw-w-fit tw-font-semibold tw-text-sm tw-cursor-pointer tw-text-primary tw-p-2"
                    >
                      + Add More Items
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
                          @click="addNewField()"
                          v-close-popup
                        >
                          Field
                        </div>
                        <div
                          class="menu-item"
                          @click="addDivider()"
                          v-close-popup
                        >
                          Divider
                        </div>
                        <div class="menu-item" @click="addNote()" v-close-popup>
                          Note
                        </div>
                      </q-menu>
                    </div>
                  </div>
                </template>
                <template #S3>
                  <div class="tw-p-2 tw-flex tw-flex-col tw-gap-2">
                    <div class="tw-flex item-3070-columns tw-items-center">
                      <div class="label">Color:</div>
                      <AGColorSelector
                        naked="true"
                        v-model:selectedColor="titleStyles.color"
                      />
                    </div>
                    <div class="tw-flex item-3070-columns tw-items-center">
                      <div class="label">Position:</div>
                      <AGBoxSelect
                        v-model:selected="titleStyles.position"
                        :options="positionOptions"
                      />
                    </div>
                    <div class="tw-flex item-3070-columns tw-items-center">
                      <div class="label">Font Size:</div>
                      <AGSlider
                        v-model:value="titleStyles.fontSize"
                        :min="0.25"
                        :max="4"
                        :step="0.125"
                      />
                    </div>
                    <div class="tw-flex item-3070-columns tw-items-center">
                      <div class="label">X Padding:</div>
                      <AGSlider
                        v-model:value="titleStyles.paddingX"
                        :min="0.25"
                        :max="4"
                        :step="0.125"
                      />
                    </div>
                    <div class="tw-flex item-3070-columns tw-items-center">
                      <div class="label">Y Padding:</div>
                      <AGSlider
                        v-model:value="titleStyles.paddingY"
                        :min="0.25"
                        :max="4"
                        :step="0.125"
                      />
                    </div>
                  </div>
                </template>
                <template #S2>
                  <div class="tw-p-2 tw-flex tw-flex-col tw-gap-2">
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="editingField.type === 'Field'"
                    >
                      <div class="label">Required?:</div>
                      <AGBool v-model:value="editingField.required" />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('max')"
                    >
                      <div class="label">Max Value:</div>
                      <AGInput
                        v-model:value="editingField.rendererConfiguration.max"
                        type="number"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('min')"
                    >
                      <div class="label">Min Value:</div>
                      <AGInput
                        v-model:value="editingField.rendererConfiguration.min"
                        type="number"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('step')"
                    >
                      <div class="label">Step:</div>
                      <AGInput
                        v-model:value="editingField.rendererConfiguration.step"
                        type="number"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('rows')"
                    >
                      <div class="label">Number of Rows:</div>
                      <AGInput
                        v-model:value="editingField.rendererConfiguration.rows"
                        type="number"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('backgroundColor')"
                    >
                      <div class="label">Background Color:</div>
                      <AGColorSelector
                        naked="true"
                        v-model:selectedColor="
                          editingField.rendererConfiguration.backgroundColor
                        "
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('textColor')"
                    >
                      <div class="label">Text Color:</div>
                      <AGColorSelector
                        naked="true"
                        v-model:selectedColor="
                          editingField.rendererConfiguration.textColor
                        "
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('orientation')"
                    >
                      <div class="label">Orientation:</div>
                      <AGBoxSelect
                        class="tw-pl-0"
                        v-model:selected="
                          editingField.rendererConfiguration.orientation
                        "
                        :options="orientationOptions"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('color')"
                    >
                      <div class="label">Color:</div>
                      <AGColorSelector
                        class="tw-pl-0"
                        naked="true"
                        v-model:selectedColor="
                          editingField.rendererConfiguration.color
                        "
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('options')"
                    >
                      <div class="label">Options:</div>
                      <div>
                        <AGArrayInput
                          class="tw-pl-0"
                          naked="true"
                          :isObject="
                            editingField.rendererConfiguration.isOptionsObject
                          "
                          v-model:value="
                            editingField.rendererConfiguration.options
                          "
                        />
                        <div class="note">
                          Comma separated options. ex: '1, 2'
                        </div>
                      </div>
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="editingField.type === 'Field'"
                    >
                      <div class="label">Pre Populated Value:</div>
                      <AGInput v-model:value="editingField.initialValue" />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="editingField.type === 'Field'"
                    >
                      <div class="label">Help Text:</div>
                      <AGInput
                        v-model:value="editingField.helpText"
                        debounce="300"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="has('validationType')"
                    >
                      <div class="label">Validation:</div>
                      <AGSelect
                        v-model:selected="
                          editingField.rendererConfiguration.validationType
                        "
                        :options="['email', 'url', 'Custom Regex']"
                        hideSearch="true"
                        description="Select a Validation"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center tw-flex-1"
                      v-if="
                        editingField.type === 'Field' &&
                        editingField.rendererConfiguration.validationType ===
                          'Custom Regex' &&
                        has('validationType')
                      "
                    >
                      <div class="label">Regex:</div>
                      <AGInput
                        class="tw-inline-block"
                        v-model:value="
                          editingField.rendererConfiguration.validationRegex
                        "
                        placeholder="Enter Regex without starting and ending /"
                        debounce="300"
                      />
                    </div>
                    <div
                      class="tw-flex item-3070-columns tw-items-center"
                      v-if="
                        editingField.type === 'Field' &&
                        editingField.rendererConfiguration.validationType ===
                          'Custom Regex' &&
                        has('validationType')
                      "
                    >
                      <div class="label">Error Text:</div>
                      <AGInput
                        v-model:value="
                          editingField.rendererConfiguration.validationErrorText
                        "
                        placeholder="Enter Error Text to show for failed validation"
                        debounce="300"
                      />
                    </div>
                  </div>
                </template>
              </AGStagedContainer>
            </div>
          </pane>
        </splitpanes>
      </template>
    </AGModal>
  </Teleport>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

import {
  inputTypesRendererMapping,
  titleStyle as titleStylesGenerator,
} from 'src/helpers/formConfig';

import AGInput from 'components/base/input.vue';
import AGBoxSelect from 'components/base/boxSelect.vue';
import AGColorSelector from 'components/base/colorSelector.vue';
import AGSlider from 'components/base/slider.vue';
import AGStagedContainer from 'components/base/stagedContainer.vue';
import AGButton from 'components/base/button.vue';
import AGArrayInput from 'components/base/arrayInput.vue';
import GridWidget from 'components/dataRenderers/charts/customListWidget.vue';
import AGNote from 'components/widgets/note.vue';
import AGSelect from 'components/base/select.vue';
import AGBool from 'components/base/bool.vue';

import AGSelectOptions from 'components/base/selectOptions.vue';

import 'gridstack/dist/gridstack.min.css';
import GridStack from 'gridstack/dist/gridstack-all';

import {
  ArrowsMoveIcon,
  EyeIcon,
  EyeOffIcon,
  CodePlusIcon,
  ArrowLeftIcon,
  EditIcon,
} from 'vue-tabler-icons';

import { findDataType } from 'src/helpers/dataTypes';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const buttonConfiguration = {
  backgroundColor: 'transparent',
  textColor: 'rgb(var(--color-default))',
};

const titleStyles = {
  color: 'var(--color-primary)',
  fontSize: 2,
  position: 'left',
  paddingX: 1,
  paddingY: 1,
};
const dividerConfiguration = {
  orientation: 'horizontal',
  color: 'var(--color-tertiary)',
};

const typeBasedPossibleInputMapping = {
  text: [
    'Text Input',
    'Text Input Large',
    'Single Value Selector',
    'Single Value Box Selector',
    'Color Selector',
    'Icon Selector',
  ],
  boolean: ['True/ False Selector'],
  number: ['Number Input', 'Number Slider'],
  datetime: ['Date & Time Selector', 'Date Selector'],
  any: [
    'Text Input',
    'Text Input Large',
    'Single Value Selector',
    'Single Value Box Selector',
    'Color Selector',
    'Icon Selector',
    'True/ False Selector',
    'Number Input',
    'Number Slider',
    'Date & Time Selector',
    'Date Selector',
  ],
};

const typeBasedDefaultInputMapping = {
  text: 'Text Input',
  boolean: 'True/ False Selector',
  number: 'Number Input',
  datetime: 'Date & Time Selector',
};

const defaultInputTypeConfiguration = {
  'Text Input': { validationType: null },
  'Text Input Large': { rows: 10, validationType: null },
  'Number Input': { max: Infinity, min: -Infinity },
  'True/ False Selector': {},
  'Single Value Selector': {
    isOptionsObject: false,
    options: ['Option 1', 'Option 2'],
  },
  'Single Value Box Selector': {
    isOptionsObject: true,
    options: ['Option 1', 'Option 2'].map((v) => {
      return { name: v, value: v };
    }),
  },
  'Multi Value Selector': {
    isOptionsObject: false,
    options: ['Option 1', 'Option 2'],
  },
  'Multi Value Box Selector': {
    isOptionsObject: true,
    options: ['Option 1', 'Option 2'].map((v) => {
      return { name: v, value: v };
    }),
  },
  'Color Selector': {},
  'Icon Selector': {},
  'Search Selector': { question: null },
  'Number Slider': { min: 0, Max: 100, step: 1 },
  'Date & Time Selector': {},
  'Date Selector': {},
};

const additionalPropsForInputType = {
  'Text Input': {},
  'Text Input Large': { textArea: true },
  'Number Input': { type: 'number' },
  'True/ False Selector': {},
  'Single Value Selector': { hideSearch: true },
  'Single Value Box Selector': {},
  'Multi Value Selector': { multi: true },
  'Multi Value Box Selector': { multi: true },
  'Color Selector': { naked: true },
  'Icon Selector': {},
  'Search Selector': {},
  'Number Slider': {},
  'Date & Time Selector': { type: 'datetime' },
  'Date Selector': { type: 'date' },
};

import { isEmptyObject } from '@intlify/shared';

import AGModal from 'components/utils/modal.vue';
export default {
  name: 'AGNewForm',
  props: [
    'open',
    'columns',
    'colDetails',
    'showNewApiAction',
    'form',
    'queryKey',
  ],
  components: {
    AGArrayInput,
    AGInput,
    AGSlider,
    AGSelectOptions,
    AGColorSelector,
    AGBoxSelect,
    AGStagedContainer,
    AGButton,
    AGModal,
    GridWidget,
    AGNote,
    EditIcon,
    AGSelect,
    AGBool,
    ArrowLeftIcon,
    ArrowsMoveIcon,
    EyeIcon,
    EyeOffIcon,
    CodePlusIcon,
    Splitpanes,
    Pane,
  },
  data() {
    const fields = this.columns ? this.newFieldsFromColumns(this.columns) : [];
    return {
      showFields: [],
      formTitle: this.form && this.form.title ? this.form.title : '',
      titleStyles:
        this.form && this.form.titleStyles
          ? this.form.titleStyles
          : cloneDeep(titleStyles),
      modalSize:
        this.form && this.form.modalSize ? this.form.modalSize : 'small',
      fields: this.form ? this.mergeFields(fields, this.form.fields) : fields,
      inputTypesRendererMapping: inputTypesRendererMapping,
      typeBasedPossibleInputMapping: typeBasedPossibleInputMapping,
      orientationOptions: ['horizontal', 'vertical'].map((v) => {
        return { name: v, value: v };
      }),
      positionOptions: ['left', 'center', 'right'].map((v) => {
        return { name: v, value: v };
      }),
      modalSizeOptions: ['small', 'medium', 'large'].map((v) => {
        return { name: v, value: v };
      }),
      grid: null,
      currentStage: 0,
      stages: [{ name: 'S1' }, { name: 'S2' }, { name: 'S3' }],
    };
  },
  watch: {
    modalSize() {
      this.$emit('update:form', this.makeForm());
    },
    formTitle() {
      this.$emit('update:form', this.makeForm());
    },
    titleStyle: {
      deep: true,
      handler() {
        this.$emit('update:form', this.makeForm());
      },
    },
    fields: {
      deep: true,
      handler() {
        this.setGrid();
        this.showFields = this.fields.map((f) => f.show);
        this.$emit('update:form', this.makeForm());
      },
    },
    showFields: {
      deep: true,
      handler(o, n) {
        if (!isEqual(o, n)) {
          this.updateFields();
        }
      },
    },
  },

  created() {
    this.setGrid();
    if (isEmptyObject(this.form)) {
      this.$emit('update:form', this.makeForm());
    }
  },

  computed: {
    titleStyle() {
      return titleStylesGenerator(this.titleStyles);
    },
    gridClass() {
      return 'tw-border-2 tw-border';
    },
  },

  methods: {
    mergeFields(a1, a2) {
      if (!a1 || !Array.isArray(a1)) {
        return a2 || [];
      }
      if (!a2 || !Array.isArray(a2)) {
        return a1 || [];
      }
      a1 = cloneDeep(a1);
      const a1Names = a1.map((f) => f.originalName);
      a2.forEach((f2) => {
        const index = a1Names.indexOf(f2.originalName);
        if (index < 0) {
          a1.push(f2);
        } else {
          a1[index] = f2;
        }
      });
      return a1;
    },
    makeForm() {
      return {
        title: this.formTitle,
        titleStyles: this.titleStyles,
        fields: this.fields,
        modalSize: this.modalSize || 'small',
      };
    },
    setGrid() {
      this.$nextTick(() => {
        this.grid && this.grid.destroy(false);
        if (this.$refs['grid']) {
          this.grid = GridStack.init(
            {
              cellHeight: '5',
              draggable: {
                handle: '.grid-drag',
              },
              resizable: {
                handles: 'e,w,s',
              },
              column: 512,
            },
            '.form-grid-stack'
          );
          this.grid && this.grid.on('resizestop', this.updateFields);
          this.grid && this.grid.on('dragstop', this.updateFields);
        }

        this.buttonGrid && this.buttonGrid.destroy(false);
        if (this.$refs['buttonGrid']) {
          this.buttonGrid = GridStack.init(
            {
              cellHeight: '5',
              draggable: {
                handle: '.grid-drag',
              },
              resizable: {
                handles: 'e,w,s',
              },
              column: 512,
            },
            '.form-button-grid-stack'
          );
          this.buttonGrid &&
            this.buttonGrid.on('resizestop', this.updateFields);
          this.buttonGrid && this.buttonGrid.on('dragstop', this.updateFields);
        }
      });
    },

    updateFields() {
      this.$nextTick(() => {
        let existingWidgetsMap = {};
        let existingButtonWidgetsMap = {};
        this.grid &&
          this.grid.engine.nodes.forEach((gn, i) => {
            existingWidgetsMap[gn.id] = gn;
          });

        this.buttonGrid &&
          this.buttonGrid.engine.nodes.forEach((gn, i) => {
            existingButtonWidgetsMap[gn.id] = gn;
          });
        const widgets = this.fields.map((f) => {
          let gn = null;
          if (f.type != 'Button') {
            gn = existingWidgetsMap[f.label];
          } else {
            gn = existingButtonWidgetsMap[f.label];
          }

          f.x = gn ? gn.x : 0;
          f.y = gn ? gn.y : 0;
          f.w = gn ? gn.w : 0;
          f.h = gn ? gn.h : 0;

          return f;
        });

        this.fields = widgets;
      });
    },

    newFieldsFromColumns(columns) {
      let fields = [];

      columns.forEach((col) => {
        const dataType = findDataType(this.colDetails, col);
        fields.push({
          label: col,
          initialValue: `{{${col}}}`,
          inputType: typeBasedDefaultInputMapping[dataType],
          rendererConfiguration: {
            ...defaultInputTypeConfiguration[
              typeBasedDefaultInputMapping[dataType]
            ],
            ...additionalPropsForInputType[
              typeBasedDefaultInputMapping[dataType]
            ],
          },
          dataType: dataType,
          originalName: col,
          type: 'Field',
          required: true,
          show: true,
        });
      });
      let existingWidgetsMap = {};

      let maxHeight = 0;
      fields = fields.map((el) => {
        if (!el.show) {
          return el;
        }
        el.x =
          existingWidgetsMap[el.label] &&
          existingWidgetsMap[el.label].hasOwnProperty('x')
            ? existingWidgetsMap[el.label].x
            : 0;
        el.y =
          existingWidgetsMap[el.label] &&
          existingWidgetsMap[el.label].hasOwnProperty('y')
            ? existingWidgetsMap[el.label].y
            : maxHeight;
        el.w =
          existingWidgetsMap[el.label] &&
          existingWidgetsMap[el.label].hasOwnProperty('w')
            ? existingWidgetsMap[el.label].w
            : 512;
        el.h =
          existingWidgetsMap[el.label] &&
          existingWidgetsMap[el.label].hasOwnProperty('h')
            ? existingWidgetsMap[el.label].h
            : 12;
        maxHeight = el.y + el.h > maxHeight ? el.y + el.h : maxHeight;
        return el;
      });

      const cancelButton = {
        label: 'Cancel',
        type: 'Button',
        originalName: 'cancel',
        rendererConfiguration: cloneDeep(buttonConfiguration),
        x: 0,
        y: 0,
        w: 512,
        h: 10,
        show: true,
      };
      const submitButton = {
        label: 'Submit',
        type: 'Button',
        originalName: 'submit',
        rendererConfiguration: {
          backgroundColor: 'var(--color-primary)',
          textColor: 'rgb(var(--color-white))',
        },
        x: 0,
        y: 10,
        w: 512,
        h: 10,
        show: true,
      };

      fields.push(cancelButton);
      fields.push(submitButton);
      return fields;
    },

    has(property) {
      return this.editingField?.rendererConfiguration.hasOwnProperty(property);
    },
    updateInputConfiguration(field, val) {
      field.rendererConfiguration = {
        ...defaultInputTypeConfiguration[val],
        ...additionalPropsForInputType[val],
      };
    },
    addNote() {
      let maxHeight = 0;
      this.fields.forEach((f) => {
        if (f.y + f.h > maxHeight) {
          maxHeight = f.y + f.h;
        }
      });

      let f = {
        label:
          'Note ' + (this.fields.filter((f) => f.type === 'Note').length + 1),
        type: 'Note',
        show: true,
        originalName:
          'Note ' + (this.fields.filter((f) => f.type === 'Note').length + 1),
        rendererConfiguration: cloneDeep(dividerConfiguration),
        x: 0,
        y: maxHeight,
        w: 512,
        h: 10,
      };
      this.fields.push(f);
    },
    addDivider() {
      let maxHeight = 0;
      this.fields.forEach((f) => {
        if (f.y + f.h > maxHeight) {
          maxHeight = f.y + f.h;
        }
      });

      let f = {
        label:
          'Divider ' +
          (this.fields.filter((f) => f.type === 'Divider').length + 1),
        type: 'Divider',
        show: true,
        originalName:
          'Divider ' +
          (this.fields.filter((f) => f.type === 'Divider').length + 1),
        rendererConfiguration: cloneDeep(dividerConfiguration),
        x: 0,
        y: maxHeight,
        w: 512,
        h: 10,
      };
      this.fields.push(f);
    },
    addNewField() {
      let maxHeight = 0;
      this.fields.forEach((f) => {
        if (f.y + f.h > maxHeight) {
          maxHeight = f.y + f.h;
        }
      });
      let f = {
        label:
          'Custom Field ' +
          (this.fields.filter((f) => f.type === 'Field').length + 1),
        inputType: 'Text Input',
        initialValue: null,
        show: true,
        originalName: 'Custom Field ' + (this.fields.length + 1),
        dataType: 'any',
        type: 'Field',
        x: 0,
        y: maxHeight,
        w: 512,
        h: 10,
      };
      this.updateInputConfiguration(f, 'Text Input');

      this.fields.push(f);
    },
  },
};
</script>
