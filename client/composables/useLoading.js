// composables/useLoading.js
import { ref } from 'vue';

export default function useLoading(initialLoading = false) {
  const isLoading = ref(initialLoading);

  const setLoading = (state) => isLoading.value = state;
  const toggleLoading = () => isLoading.value = !isLoading.value;

  return { isLoading, setLoading, toggleLoading };
}
