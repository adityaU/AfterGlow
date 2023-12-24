<template>
  <div class="">
    <span class="label">
      {{ label }}
    </span>
    <BaseInput
      ref="input"
      class="tw-text-default"
      :value="value"
      :max="max"
      :min="min"
      @inputed="
        (val) => ($emit('inputed', val) || true) && $emit('update:value', val)
      "
      :placeholder="placeholder"
      :type="type"
    />
  </div>
</template>

<script>
import BaseInput from 'components/base/input.vue';
export default {
  name: 'AGInput',

  components: { BaseInput },
  props: ['label', 'placeholder', 'value', 'type', 'max', 'min'],

  methods: {
    menuShow() {
      this.$refs['input'].$el.focus();
    },
  },
};
</script>
