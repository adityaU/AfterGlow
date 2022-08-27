<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>
