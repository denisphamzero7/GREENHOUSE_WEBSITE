<template>
    <label :for="labelFor" v-bind="$attrs" class="block text-sm font-medium leading-6 text-gray-900" :class="labelclass"><slot></slot></label>
</template>

<script setup>
defineProps({
    labelclass: {
        type: String,
        default: ''
    },
    labelFor: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped>

</style>