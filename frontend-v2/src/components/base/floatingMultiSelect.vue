<template>

  <div class="tw-px-2">
    <slot class="tw-px-0.5" name="itemsSlot" />

    <div class="tw-inline-flex tw-flex-nowrap tw-px-0.5 tw-py-1">
      <div class="btn btn-full tw-px-2 tw-cursor-pointer">{{ '+' + label }}
        <slot name="menuSlot" />
      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: ["items", "label"]
}
</script>
