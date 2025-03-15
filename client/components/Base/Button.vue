<template>
  <button
    v-bind="$attrs"
    :disabled="loading || disabled"
    :class="['layout', variant, { 'btn-loading': loading }]"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (prop) => ["primary", "secondary", "bordered", "danger", "success", "pink"].includes(prop),
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  if (!props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped>
.layout {
  @apply flex justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm 
    focus-visible:outline-offset-2 focus-visible:outline-2 ease-in-out duration-150 transition-all;
}

.success {
  @apply bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-600;
}

.success:hover {
  transform: scale(1.05);
}

.btn-loading {
  @apply cursor-not-allowed opacity-50;
}

.loading-spinner {
  @apply w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin;
}
</style>