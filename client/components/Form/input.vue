<template>
  <input
    v-model="model"
    v-bind="$attrs"
    :class="customClass"
    class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-green-500 focus:shadow-lg focus:shadow-green-200/50 sm:leading-6 focus:outline-none transition-all duration-200"
  >
</template>

<script setup>

defineProps({
  customClass: {
    type: String,
    default: ''
  }
});
const model = defineModel();
</script>