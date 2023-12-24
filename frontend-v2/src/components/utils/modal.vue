<style scoped>
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-mask tw-fixed tw-inset-0 tw-bg-gray-900/90 tw-flex tw-z-[99999]"
      @click="$emit('update:show', false)"
    >
      <div class="tw-max-w-[95%] tw-max-w-[75%] tw-max-w-[35%] tw-hidden"></div>
      <div
        class="modal-container tw-bg-white tw-max-h-[95vh] tw-min-h-[300px] tw-min-w-[300px] tw-m-auto tw-border tw-flex"
        :class="sizeClass"
        v-if="loading"
        @click.stop=""
      >
        <AGLoader :text="loadingMessage" class="tw-m-auto" />
      </div>
      <div
        class="tw-flex tw-flex-col modal-container tw-bg-white tw-min-w-[300px] tw-max-h-[95vh] tw-max-w-[95%] tw-m-auto tw-rounded-2xl"
        :class="sizeClass"
        v-if="!loading"
        @click.stop=""
      >
        <div class="modal-header tw-border-b-2">
          <slot name="header" v-if="!noHeader">default header</slot>
        </div>

        <div
          class="tw-flex-1"
          :class="bodyClass ? bodyClass : 'tw-overflow-y-auto'"
        >
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer tw-border-t" v-if="!noFooter">
          <slot name="footer">
            <div class="tw-grid tw-grid-cols-12 tw-m-2">
              <div class="tw-col-span-11"></div>
              <div class="tw-col-span-1 tw-text-right">
                <AGButton
                  @click="$emit('update:show', false)"
                  class="tw-bg-primary tw-rounded-full tw-text-white hover:tw-bg-primary/80"
                  >Done</AGButton
                >
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import AGLoader from 'components/utils/loader.vue';
import AGButton from 'components/base/button.vue';
export default {
  name: 'AGModal',
  components: { AGLoader, AGButton },
  props: {
    show: Boolean,
    loading: Boolean,
    loadingMessage: String,
    size: String,
    noFooter: Boolean,
    noHeader: Boolean,
    bodyClass: String,
  },

  computed: {
    sizeClass() {
      if (this.size === 'medium') {
        return 'tw-min-w-[75%]';
      }
      if (this.size === 'small') {
        return 'tw-min-w-[35%]';
      }
      return 'tw-min-w-[95%]';
    },
  },
};
</script>
