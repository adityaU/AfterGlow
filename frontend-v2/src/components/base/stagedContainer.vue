<template>
  <div>
    <slot name="header" />
    <template v-for="stage, i in stages" :key="stage">
      <slot :name="stage.name" v-if="currentStage === i" />
    </template>
    <slot name="footer"/>

  </div>
</template>

<script>
export default {
  name: 'AGStagedContainer',
  props: ["stages", "currentStage"]
}
</script>
