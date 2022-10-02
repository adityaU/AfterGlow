<template>
    <teleport to="body">

        <AGModal size="small" :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading"
            :loadingMessage="loadingMessage">
            <template #header>
                <div class="tw-p-2 tw-text-2xl tw-font-semibold">
                    Remove from dashboard
                </div>
            </template>
            <template #body>
                <div class="tw-p-2 divide-y">
                    <p>
                    This will permanently remove the {{type}} from the dashboard. Are you sure?
                    </p>
                </div>
            </template>
            <template #footer>
                <div class="tw-grid tw-grid-cols-12">
                    <div class="tw-col-span-12 tw-p-2 tw-text-center">
                        <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2"
                            @clicked="$emit('update:open', false)">
                            Cancel
                        </AGButton>
                        <AGButton
                            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-ml-2 tw-p-2"
                            @clicked="$emit('removeWidget', widgetID)">
                            Yes, Remove
                        </AGButton>
                    </div>
                </div>
            </template>
        </AGModal>
    </teleport>
</template>

<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from 'components/base/button.vue'

export default {
    name: 'AGAddToDashboard',
    props: ['type', 'open', 'widgetID'],
    components: { AGModal, AGButton, },
}
</script>
