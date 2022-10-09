<template>
  <div class="tw-h-full tw-w-full tw-flex tw-text-default tw-justify-center tw-items-center tw-flex-col">
    <div class="">
      <div class="tw-h-[40px] tw-py-2 rotate-180">
        <div class="loader icon tw-flex tw-items-stretch tw-justify-center">
          <div class="tw-bg-primary"> </div>
          <div class="tw-bg-primary"> </div>
          <div class="tw-bg-primary"> </div>
          <div class="tw-bg-primary"> </div>
          <div class="tw-bg-primary"> </div>
        </div>
      </div>
    </div>
    <div class="tw-font-semibold tw-text-primary">{{ text }}</div>
  </div>
</template>

<script>
import { LoaderIcon } from 'vue-tabler-icons';
export default {

  name: 'AGLoader',
  props: ["text"],
  components: {}

}
</script>

<style scoped>
.loader.icon>* {
  width: 8px;
  height: 25px;
  margin: 0px 2px;
}

.loader.icon :nth-child(1) {
  margin-left: 0px;
  animation: animate-1 0.5s infinite;
  animation-direction: alternate;
}

.loader.icon :nth-child(2) {
  animation: animate-1 0.5s infinite;
  animation-direction: alternate;
  animation-delay: 10ms
}

.loader.icon :nth-child(3) {
  animation: animate-1 0.5s infinite;
  animation-direction: alternate;
  animation-delay: 20ms
}

.loader.icon :nth-child(4) {
  animation: animate-1 0.5s infinite;
  animation-direction: alternate;
  animation-delay: 30ms
}

.loader.icon :nth-child(5) {
  animation: animate-1 0.5s infinite;
  animation-direction: alternate;
  animation-delay: 40ms
}

@keyframes animate-1 {
  from {
    height: 5px;
  }
  to{
    height: 25px;
  }
}
</style>
