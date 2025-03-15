<template>
  <div class="w-full max-h-full p-4 bg-blue-300 h-screen">
    <h1 class="text-2xl font-semibold">Welcome, {{ user?.name }}</h1>
    
    <!-- Nút mở Modal -->
    <BaseButton @click="toggle" style="width: 100px;" class="mb-3 w-full">
      Open Modal
    </BaseButton>

    <!-- Modal -->
    <Modal :showModal="isOpen"  @closeModal="close" :content="user?.name" />

    <!-- Nút Logout -->
    <BaseButton 
      @click="handleLogout"
      :loading="isLoading"
      :disabled="isLoading"
      style="width: 100px;"
      class="bg-red-500"
   
    >
      Logout
    </BaseButton>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout:'admin'
});

import { onMounted } from 'vue';
import useAuth from '~/composables/useAuth';
import useLoading from '~/composables/useLoading.js';
import useModal from '~/composables/useModal';

const { isLoading, setLoading } = useLoading();
const { profile, user, logout } = useAuth();
const { isOpen, open, close, toggle } = useModal();

onMounted(profile);

function handleLogout() {
  setLoading(true);
  alert("Logging out...");
  logout();
  setLoading(false);
}
</script>
