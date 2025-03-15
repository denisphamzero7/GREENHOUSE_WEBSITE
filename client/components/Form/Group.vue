<template>
  <div v-bind="$attrs" class="relative">
    <FormLabel :for="inputId" :class="labelClass">{{ label }}</FormLabel>
    <div class="mt-2">
      <FormInput
        v-model="internalValue"
        :id="inputId"
        :name="name"
        :type="type"
        :autocomplete="autocomplete"
        :required="required"
        :placeholder="placeholder"
        :class="inputClass"
      />
    </div>
    <transition name="fade">
      <p v-if="errorMessages" class="text-sm text-red-600 mt-1">
        <span class="inline-flex items-center space-x-2">
          <font-awesome-icon
            :icon="['fas', 'exclamation-circle']"
            class="text-red-500"
          />
          <span>{{ errorMessages }}</span>
        </span>
      </p>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  label: String,
  name: String,
  type: {
    type: String,
    default: 'text'
  },
  labelFor: String,
  autocomplete: String,
  required: Boolean,
  placeholder: String,
  inputClass: String,
  labelClass: String,
  errorMessages: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Giá trị nội bộ để binding hai chiều
const internalValue = ref(props.modelValue);

// Đồng bộ internalValue với modelValue từ bên ngoài
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

// Phát sự kiện update:modelValue khi internalValue thay đổi
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Tạo ID động cho input, ưu tiên labelFor nếu có
const inputId = computed(() => props.labelFor || props.name);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>