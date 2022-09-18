<template>
  <span class="fit"><slot></slot></span>
</template>

<script>
import fitty from "fitty";

export default {
  name: "FitText",
  props: {
    options: {
      type: Object,
      required: false,
      default() {
        return {
          minSize: 16,
          maxSize: 512,
          multiLine: true
        };
      }
    }
  },
  data() {
    return {
      $_fitty: undefined
    };
  },
  unmounted() {
   
    this.$_fitty && this.$_fitty.unsubscribe();
  },
  mounted() {
    this.$_fitty = fitty(this.$el, this.options);
  }
};
</script>

<style scoped>
.fit {
  display: inline-block;
  white-space: nowrap;
}
</style>

