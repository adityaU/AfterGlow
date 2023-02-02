<template>
  <div>

    <template v-if="selectedLocal">
      <div class="icon-default tw-inline-flex tw-cursor-pointer" v-html="selectedLocal"></div>
    </template>
    <template v-if="!selectedLocal">
      <div class="icon-default tw-inline-flex tw-cursor-pointer" >Select an Icon</div>
    </template>


    <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="400px"
      :offset="[0, 5]" class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden tw-p-2"
      @show="menuShow" @keydown="onKeydown">
      <div class="tw-flex tw-gap-1 tw-pb-2" v-for="chunk in defaultIcons" :key=chunk>
        <component class="icon-default tw-cursor-pointer" :is=icon v-for="icon in chunk" :key=icon @click="selectedLocal = getIconHtml(icon)" v-close-popup />
      </div>
      <div class="label">Custom</div>
      <AGInput class=" tw-block" textArea=true v-model:value="selectedLocal" debounce=300 />
    </q-menu>

  </div>
</template>

<script>
import {ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon,
  ArrowDownIcon, ArrowRightCircleIcon, ArrowLeftCircleIcon, ArrowUpCircleIcon, ArrowDownCircleIcon,
  ArrowsLeftRightIcon, ArrowsUpDownIcon, RefreshIcon, ArrowBackUpIcon, ClearAllIcon,
  Clock2Icon, ClockHour2Icon, CalendarIcon,
  ChevronRightIcon, ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon,
  MailboxIcon, MailboxOffIcon, MailFastIcon, MailForwardIcon,
  CheckIcon, XIcon, EditIcon,
  PlayerPlayIcon, PlayerPauseIcon, Menu2Icon, 
  MenuIcon, SettingsIcon, 
  CurrencyRupeeIcon, CurrencyEuroIcon, CurrencyPoundIcon, CurrencyDollarIcon,
  CurrencyBahrainiIcon, CurrencyBahtIcon, CurrencyBitcoinIcon, CurrencyCentIcon,
  CurrencyDinarIcon, 
  CurrencyDollarAustralianIcon, CurrencyDogecoinIcon, 
  CurrencyFrankIcon, CurrencyLiraIcon 
} from 'vue-tabler-icons'
import {chunks} from "src/helpers/arrayUtils"
import AGInput from 'components/base/input.vue'
import {createApp, h, shallowRef} from 'vue';
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: "AGIconSelector",
  components: {AGInput},
  props: ['selected'],
  data(){
    return {
      defaultIcons: shallowRef(chunks([ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon,
        ArrowDownIcon, ArrowRightCircleIcon, ArrowLeftCircleIcon, ArrowUpCircleIcon, ArrowDownCircleIcon,
        ArrowsLeftRightIcon, ArrowsUpDownIcon, RefreshIcon, ArrowBackUpIcon, ClearAllIcon,
        Clock2Icon, ClockHour2Icon, CalendarIcon,
        ChevronRightIcon, ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon,
        MailboxIcon, MailboxOffIcon, MailFastIcon, MailForwardIcon,
        CheckIcon, XIcon, EditIcon,
        PlayerPlayIcon, PlayerPauseIcon, Menu2Icon, 
        MenuIcon, SettingsIcon, 
        CurrencyRupeeIcon, CurrencyEuroIcon, CurrencyPoundIcon, CurrencyDollarIcon,
        CurrencyBahrainiIcon, CurrencyBahtIcon, CurrencyBitcoinIcon, CurrencyCentIcon,
        CurrencyDinarIcon, 
        CurrencyDollarAustralianIcon, CurrencyDogecoinIcon, 
        CurrencyFrankIcon, CurrencyLiraIcon], 10)),
      selectedLocal: this.selected ? cloneDeep(this.selected) : null 
    }
  },

  watch: {
    selectedLocal(){
      this.$emit('update:selected', this.selectedLocal)
    }
  },

  methods: {
    getIconHtml(icon) {
      const tempApp = createApp({
        render() {
          return h(icon, {
            size: 16,
          })
        }
      })

      // in Vue 3 we need real element to mount to unlike in Vue 2 where mount() could be called without argument...
      const el = document.createElement('div');
      const mountedApp = tempApp.mount(el)

      return mountedApp.$el.outerHTML
    }
  }

}
</script>
