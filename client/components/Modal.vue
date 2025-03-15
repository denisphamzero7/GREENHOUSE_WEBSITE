<template>
  <div v-if="showModal" @click.self="closeModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="w-full p-6 max-w-sm bg-white rounded-lg shadow-lg" @click.stop>
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <p class="mt-2">{{ content }}</p>

      <button @click="closeModal" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  showModal: Boolean,
  content: String,
  title: {
    type: String,
    default: 'Default Title',
  },
});

const emit = defineEmits(['closeModal']);

function closeModal() {
  emit('closeModal');
}
</script>
