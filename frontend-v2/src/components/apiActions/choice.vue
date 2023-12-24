<template>
  <div>
    <Teleport to="body">
      <AGModal
        :show="open"
        @update:show="(val) => $emit('update:show', val)"
        :loading="loading"
        :loadingMessage="loadingMessage"
        size="small"
        noFooter="true"
      >
        <template #header>
          <div class="tw-text-2xl tw-text-primary tw-font-semibold tw-p-2">
            Select an Api Action Type
          </div>
        </template>
        <template #body>
          <div
            class="tw-flex tw-gap-1 tw-justify-center tw-items-center tw-p-5"
          >
            <div
              class="tw-border-2 tw-border-primary tw-p-2 tw-text-primary tw-rounded-2xl tw-cursor-pointer tw-font-semibold hover:tw-bg-primary hover:tw-text-white"
              @click="
                ($emit('update:open', false) || true) &&
                  $emit('update:showForm', true)
              "
            >
              With Form
            </div>
            <div
              class="tw-border-2 tw-border-primary tw-p-2 tw-text-primary tw-rounded-2xl tw-cursor-pointer tw-font-semibold hover:tw-bg-primary hover:tw-text-white"
              @click="
                ($emit('update:open', false) || true) &&
                  $emit('update:showNewApiAction', true)
              "
            >
              Without Form
            </div>
          </div>
        </template>
        <template #footer> footer </template>
      </AGModal>
    </Teleport>
  </div>
</template>

<script>
import AGModal from 'components/utils/modal.vue';
export default {
  components: { AGModal },
  props: ['open', 'showForm', 'showNewApiAction'],

  name: 'AGApiActionChoice',
};
</script>
