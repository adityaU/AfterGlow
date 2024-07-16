<template>
  <q-menu
    flat="true"
    transition-show="scale"
    transition-hide="scale"
    class="tw-rounded-2xl tw-border tw-overflow-hidden"
    max-height="90vh"
    @show="menuShow"
    @keydown="onKeydown"
    anchor="center end"
    self="center start"
  >
    <div class="tw-flex tw-flex-col tw-max-h-[inherit]">
      <slot name="header" />
      <div class="tw-overflow-auto tw-max-h-[80vh]">
        <template v-for="(stage, i) in stages" :key="stage">
          <slot :name="stage.name" v-if="currentStage === i" />
        </template>
      </div>
      <slot name="footer" />
    </div>
  </q-menu>
</template>

<script>
export default {
  name: 'AGStagedMenu',
  props: ['stages', 'currentStage', 'show'],
};
</script>
