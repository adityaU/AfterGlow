<template>
  <teleport to="body">
    <AGModal
      class="!tw-fixed"
      size="small"
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
      :loading="loading"
      :loadingMessage="loadingMessage"
    >
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">
          Update Variable - {{ variableLocal.name }}
        </div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y tw-flex tw-flex-col tw-gap-2">
          <div class="tw-flex item-3070-columns">
            <div class="label">Type</div>
            <AGSelect
              :options="varTypeOptions"
              v-model:selected="variableLocal.var_type"
              description="Select a Type"
              canNotDeselect="true"
            />
          </div>
          <div class="tw-flex item-3070-columns">
            <div class="label">Default</div>
            <div>
              <AGInput
                placeholder="Default Value"
                v-model:value="variableLocal.default"
                v-if="
                  variableLocal.var_type === 'Integer' ||
                  variableLocal.var_type == 'String'
                "
              />
              <AGDatetimePicker
                class=""
                v-model:value="variableLocal.default"
                type="datetime"
                :clearCount="variableLocal.clearCount"
                v-if="variableLocal.var_type === 'Date'"
              />
              <div
                class="note tw-text-red-700"
                v-if="
                  variableLocal.hasOwnProperty('dafault') &&
                  variableLocal.default != null
                "
              >
                Variable must have a default value
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton
            class="tw-text-white tw-bg-primary tw-p-2"
            @clicked="($emit('done') || true) && $emit('update:open', false)"
          >
            Done
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>
</template>
<script>
import AGModal from 'components/utils/modal.vue';
import AGSelect from 'components/base/select.vue';
import AGButton from 'components/base/button.vue';
import AGDatetimePicker from 'components/base/inputDatePicker.vue';

import AGInput from 'components/base/input.vue';

import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default {
  name: 'AGTitleModal',
  components: { AGModal, AGButton, AGInput, AGSelect, AGDatetimePicker },
  props: ['open', 'variable'],

  watch: {
    variable: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(oldv, newv)) {
          this.variableLocal = cloneDeep(this.variable);
        }
      },
    },

    variableLocal: {
      deep: true,
      handler(newv, oldv) {
        this.$emit('update:variable', this.variableLocal);
      },
    },
  },

  computed: {
    variableType() {
      return this.variableLocal.var_type;
    },
  },

  data() {
    return {
      emailOptions: [],
      variableLocal: cloneDeep(this.variable || {}),
      varTypeOptions: ['String', 'Integer', 'Date'],
      session: sessionStore(),
    };
  },
};
</script>
