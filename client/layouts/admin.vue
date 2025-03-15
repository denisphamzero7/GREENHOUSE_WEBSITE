<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Header cố định -->
    <HeaderAdmin class="fixed top-0 left-0 w-full z-50 bg-green-600 shadow-md" />

    <!-- Container cho sidebar và main -->
    <div class="flex pt-[64px]  bg-gray-200">
    
      <SidebarDefault class="hidden md:block w-[250px] shrink-0 pt-4" />
      
      <main class="flex-1">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 text-center text-sm shadow-inner mt-auto">
      {{ footer }}
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
const footer = ref("Copyright © 2023 Your Company. All rights reserved.");
</script>