<template>
  <div class="tw-text-xl tw-h-full tw-w-full tw-flex tw-text-default" >
  <div class="tw-m-auto">
    <LoaderIcon size=48 class="tw-animate-spin tw-m-auto"  />
    <div class="">{{text}}</div>
    </div>
  </div>
</template>

<script>
import { LoaderIcon } from 'vue-tabler-icons';
export default {

  name: 'AGLoader',
  props: ["text"],
  components: {LoaderIcon}
  
}
</script>
