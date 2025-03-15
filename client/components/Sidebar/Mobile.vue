<template>
  <div v-if="opensidebar" class="fixed inset-0 z-20 flex">
    <!-- Sidebar -->
    <div
      class="w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out"
      :class="opensidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button @click="closeSidebar" class="text-white hover:text-gray-300">
          <!-- Nút đóng -->
        </button>
      </div>
      <ul class="mt-4">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          @click="selectItem(index)"
          class="p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
          :class="{ 'bg-gray-600': selectedIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- Overlay -->
    <div
      @click="closeSidebar"
      class="flex-1 bg-black opacity-50"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSidebarStore } from '~/stores/sidebar';
const sidebarStore = useSidebarStore();

</script>

<style lang="scss" scoped>
/* Có thể thêm style tùy chỉnh nếu cần */
</style>