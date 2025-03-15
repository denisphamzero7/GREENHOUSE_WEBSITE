import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.token; // Gọi trực tiếp getter sẽ không reactive

  if (!isAuthenticated) {
    return navigateTo('/dashboard');
  }
}); 
