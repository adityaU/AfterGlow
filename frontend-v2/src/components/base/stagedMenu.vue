<template>
        <q-menu flat=true transition-show="scale" transition-hide="scale" max-height="800px" 
                class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden" @show="menuShow" @keydown="onKeydown">
                <slot name="header"/>
                <div class="tw-max-h-[650px] tw-overflow-auto" v-for="stage, i in stages" :key="stage">
                        <slot :name="stage.name" v-if="currentStage === i" />
                </div>
                <slot name="footer"/>
        </q-menu>
</template>

<script>
export default {
        name: 'AGStagedMenu',
        props: ["stages", "currentStage", "show"]

}
</script>
