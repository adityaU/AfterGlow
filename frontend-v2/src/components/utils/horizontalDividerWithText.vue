<template>
  <div class="tw-w-full tw-flex tw-items-center"> 
    <div class="tw-border-t tw-flex-1"></div> 
    <div class="tw-mx-2 tw-font-semibold">{{text}}</div>
    <div class="tw-border-t tw-flex-1"></div>
  </div>
</template>

<script>
export default {
  name: 'AGHorizontalDivider',
  props: ['text']
}
</script>
