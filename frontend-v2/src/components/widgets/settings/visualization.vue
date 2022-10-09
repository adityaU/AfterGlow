<template>
  <teleport to="#dashbaord-settings">
    <div class="" v-if="showSettings">

    I am from viz
    </div>
  </teleport>
</template>

<script>
export default {
  name: "AGVizSettings",
  components: {},
  props: ['showSettings']
  
}
</script>
