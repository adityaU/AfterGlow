<style scoped>
.group .edit {
  visibility: hidden;
}
.group:hover .edit {
  visibility: visible;
}
.group .delete {
  visibility: hidden;
}
.group:hover .delete {
  visibility: visible;
}
</style>
<template>
  <div
    class="tw-bg-secondary tw-border-b-2 tw-border-b-primary tw-flex tw-items-center"
  >
    <div
      class="group tw-p-2 tw-font-semibold tw-cursor-pointer tw-flex-[0_1_20%] tw-flex tw-items-center tw-min-w-[50px] tw-max-w-[20%] tw-rounded-t-xl"
      v-for="(viz, index) in visualizationsLocal"
      :key="viz"
      :class="
        viz.current
          ? 'tw-bg-primary tw-text-white hover:tw-bg-primary/80 tw-border-primary tw-border-2 hover:tw-border-primary/80 tw-min-w-[15%]'
          : 'tw-border-r tw-border-2 tw-bg-white tw-border-b-white'
      "
      @click="setCurrentViz(viz)"
    >
      <component
        :is="icon(viz.rendererType).icon"
        class=""
        :class="icon(viz.rendererType).isIconRotated ? 'tw-rotate-90' : ''"
        size="14"
      />
      <span
        class="tw-ml-2 tw-capitalize tw-whitespace-nowrap tw-text-ellipsis tw-overflow-hidden tw-block tw-flex-[1_1_100%]"
        v-if="!viz.edit"
        >{{ viz.name }}</span
      >
      <span
        class="edit tw-ml-2 tw-capitalize tw-my-auto hover:tw-text-primary tw-self-end"
        v-if="!viz.edit && (!viz.id || currentUser.canEditQuestion)"
        @click.stop="(viz.edit = true) && focusInput(index)"
      >
        <EditIcon size="10" />
      </span>
      <span
        class="delete tw-ml-2 tw-capitalize tw-my-auto hover:tw-text-primary tw-self-end"
        v-if="!viz.edit && (!viz.id || currentUser.canEditQuestion)"
        @click.stop="$emit('deleteViz', index)"
      >
        <XIcon size="10" />
      </span>

      <span class="tw-ml-2" v-if="viz.edit">
        <BaseInput
          invisible="true"
          :value="viz.name"
          @inputed="(val) => (viz.name = val)"
          @keyup.enter="viz.edit = false"
          :ref="'input_' + index"
          class="tw-bg-transparent"
          placeholder="A Meaningful name"
          @click.stop="stopPropagation"
        />
      </span>
      <span
        class="tw-ml-2 tw-capitalize tw-my-auto hover:tw-text-primary tw-self-end"
        v-if="viz.edit"
        @click="viz.edit = false"
      >
        <CheckIcon size="10" />
      </span>
    </div>
    <div
      class="tw-p-2 tw-font-semibold tw-text-primary tw-cursor-pointer tw-flex tw-items-center"
      @click="addNewViz"
      v-if="
        currentUser.canEditQuestion ||
        (quesConfig && quesConfig.can_viewers_see_in_new_visualization)
      "
    >
      <PlusIcon class="tw-inline tw-my-auto" size="14" />
      <span class="tw-ml-2 tw-whitespace-nowrap">New visualization</span>
    </div>
    <div class="tw-flex-[1_1_5%] tw-text-right"><slot /></div>
  </div>
</template>

<script>
import { _ } from 'lodash';
import { rendererTypeIcons } from 'src/helpers/rendererConfig';
import { currentUserStore } from 'src/stores/currentUser';

import isEqual from 'lodash/isEqual';
import { PlusIcon, EditIcon, CheckIcon, XIcon } from 'vue-tabler-icons';
import BaseInput from 'components/base/input.vue';

const currentUser = currentUserStore();
export default {
  name: 'VisualizationLayout',

  props: ['visualizations', 'quesConfig'],

  components: { PlusIcon, EditIcon, CheckIcon, BaseInput, XIcon },

  watch: {
    visualizations: {
      deep: true,
      handler() {
        if (!isEqual(this.visualizations?.details, this.visualizationsLocal)) {
          this.visualizationsLocal = this.visualizations?.details;
        }
      },
    },

    visualizationsLocal: {
      deep: true,
      handler() {
        this.$emit('update:visualizations', {
          towardsVizLayout: false,
          details: this.visualizationsLocal,
        });
      },
    },
  },

  data() {
    const vizLocal = _.cloneDeep(this.visualizations.details);
    return {
      visualizationsLocal: vizLocal,
      currentUser: currentUser,
    };
  },

  methods: {
    icon(rendererType) {
      return rendererTypeIcons[rendererType] || rendererTypeIcons['table'];
    },
    addNewViz() {
      let viz = {
        rendererType: 'table',
        name: 'Visualization ' + (this.visualizationsLocal.length + 1),
      };
      this.visualizationsLocal.push(viz);
      this.setCurrentViz(viz);
    },
    focusInput(index) {
      setTimeout(() => {
        this.$refs['input_' + index][0].$el.focus();
      }, 500);
    },
    setCurrentViz(viz) {
      this.visualizationsLocal.forEach((viz) => (viz.current = false));
      viz.current = true;
      this.$emit('fetchVizResults', viz);
    },
  },
};
</script>
