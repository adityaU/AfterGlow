<template>
  <div class="tw-w-full">
    <div class="tw-grid tw-grid-cols-11">
      <div class="tw-col-span-5 tw-pr-1">
        <AGInput
          label="Name"
          placeholder="Header Key"
          class="tw-mb-1 tw-rounded-r-none"
          v-model:value="name"
        />
      </div>
      <div class="tw-col-span-5 tw-pl-1">
        <AGInput
          label="Name"
          placeholder="Variable Value "
          class="tw-mb-1"
          v-model:value="value"
        />
      </div>
      <AGButton
        class="tw-border-0 tw-text-primary tw-px-0 tw-text-red-500"
        @clicked="'pass';"
      >
        DELETE
      </AGButton>
    </div>
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGButton from 'components/base/button.vue';
export default {
  name: 'AGSystemVariables',
  components: { AGInput, AGButton },

  data() {
    return {};
  },

  mounted() {},
  methods: {},
};
</script>
