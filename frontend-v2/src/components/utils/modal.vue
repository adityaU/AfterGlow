<style scoped>
.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {

    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask tw-absolute tw-inset-0 tw-bg-primary/20 tw-flex tw-z-[99999]"
            @click="$emit('update:show', false)">

            <div class="tw-max-w-[95%] tw-max-w-[75%] tw-max-w-[35%] tw-hidden"></div>
            <div class="modal-container tw-bg-white  tw-min-w-[300px] tw-m-auto tw-border tw-shadow-sm tw-rounded-sm tw-flex"
                :class="sizeClass" v-if="loading" @click.stop="">
                <AGLoader :text="loadingMessage" class="tw-m-auto" />
            </div>
            <div class="modal-container tw-bg-white  tw-min-w-[300px]  tw-max-w-[95%] tw-m-auto tw-shadow-sm tw-rounded-sm"
                :class="sizeClass" v-if="!loading" @click.stop="">
                <div class="modal-header tw-border-b-2 tw-border-primary tw-bg-primary tw-text-white tw-rounded-sm">
                    <slot name="header">default header</slot>
                </div>

                <div class="tw-overflow-y-auto tw-max-h-[75vh] tw-p-2 ">
                    <slot name="body">default body</slot>
                </div>

                <div class="modal-footer tw-max-h-[7.5vh] tw-border-t">
                    <slot name="footer">
                        <div class="tw-grid tw-grid-cols-12 tw-m-2">
                            <div class="tw-col-span-11"></div>
                            <div class="tw-col-span-1 tw-text-right">
                                <AGButton @click="$emit('update:show', false)"
                                    class="tw-bg-primary tw-text-white hover:tw-bg-primary/80">Done</AGButton>
                            </div>
                        </div>
                    </slot>
                </div>

            </div>
        </div>
    </Transition>
</template>

  <script>

import AGLoader from 'components/utils/loader.vue'
import AGButton from 'components/base/button.vue'
export default {
    name: 'AGModal',
    components: { AGLoader, AGButton },
    props: {
        show: Boolean,
        loading: Boolean,
        loadingMessage: String,
        size: String,
    },

    computed: {
        sizeClass() {
            if (this.size === 'medium') {
                return 'tw-max-w-[75%]'
            }
            if (this.size === 'small') {
                return 'tw-max-w-[35%]'
            }
            return 'tw-max-w-[95%]'
        }
    }
}
</script>
