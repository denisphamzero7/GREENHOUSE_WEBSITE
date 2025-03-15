<template>
  <div :class="['relative', 'inline-block', 'text-left', containerClass]">
    <transition :name="transitionName">
      <ul
        v-if="isOpen"
        :class="['absolute', 'right-0', 'bg-white', 'rounded-lg', widthClass, listClass]"
      >
        <li v-for="item in items" :key="item.id" :class="itemClass">
          <component
            :is="linkComponent"
            v-if="item.link"
            :[linkPropName]="item.link"
            :class="['flex', 'items-center', 'px-4', 'py-2', 'text-gray-700', 'hover:bg-green-100', 'hover:rounded-lg', 'transition', 'duration-200', linkClass]"
          >
            <component
              :is="iconComponent"
              :[iconProp]="item.icon"
              class="text-gray-600 mr-2"
            />
            {{ item.text }}
          </component>
          <button
            v-else
            @click="selectItem(item.action)"
            :class="['flex', 'w-full', 'text-left', 'px-4', 'py-2', 'text-gray-700', 'hover:bg-green-100', 'transition', 'duration-200', buttonClass]"
          >
            <component
              :is="iconComponent"
              :[iconProp]="item.icon"
              class="text-gray-600 mr-2"
            />
            {{ item.text }}
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// Mặc định cho linkComponent và iconComponent
import { NuxtLink } from "#components";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  containerClass: {
    type: String,
    default: "",
  },
  listClass: {
    type: String,
    default: "",
  },
  itemClass: {
    type: String,
    default: "",
  },
  linkClass: {
    type: String,
    default: "",
  },
  buttonClass: {
    type: String,
    default: "",
  },
  widthClass: {
    type: String,
    default: "w-40",
  },
  transitionName: {
    type: String,
    default: "fade",
  },
  linkComponent: {
    type: [String, Object],
    default: () => NuxtLink,
  },
  linkPropName: {
    type: String,
    default: "to",
  },
  iconComponent: {
    type: [String, Object],
    default: () => FontAwesomeIcon,
  },
  iconProp: {
    type: String,
    default: "icon",
  },
});

const emit = defineEmits(["select"]);

const selectItem = (action) => {
  emit("select", action);
};
</script>

<style scoped>
/* Định nghĩa hiệu ứng chuyển đổi mặc định */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>