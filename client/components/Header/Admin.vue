<template>
  <header class="top-0 left-0 w-full z-50 bg-green-600 shadow-md">
    <div
      class="container mx-auto flex items-center justify-between px-4 py-3 md:py-4 transition-all duration-300 ease-in-out"
    >
      <!-- Logo -->
      <div class="flex items-center">
        <img
          src="../../assets/image/logo.png"
          alt="Greenhouse Admin Logo"
          class="h-8 w-auto md:h-10 mr-2 transition-transform duration-300 hover:scale-105"
        />
        <span class="font-bold text-white text-base md:text-lg">Admin Greenhouse</span>
      </div>

      <!-- Search Bar (chỉ hiển thị trên MD trở lên) -->
      <div class="relative hidden md:flex flex-1 mx-4">
        <FormInput
          v-model="searchQuery"
          placeholder="Tìm kiếm..."
          class="pl-12 pr-12 py-2 rounded-lg w-full bg-white shadow-sm focus:ring-2 focus:ring-green-400 transition-all duration-200"
          @focus="showSuggestions = true"
          @input="handleInput"
        />
        <BaseButton
          class="absolute top-0 left-0 w-10 h-full flex items-center justify-center"
          variant="success"
          @click="handleSearch"
        >
          <font-awesome-icon icon="search" class="text-white text-lg" />
        </BaseButton>
        <BaseButton
          v-if="searchQuery"
          class="absolute top-0 right-0 w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-600"
          @click="clearSearch"
        >
          <font-awesome-icon icon="times-circle" />
        </BaseButton>

        <!-- Gợi ý tìm kiếm -->
        <div
          v-if="showSuggestions && suggestions.length"
          class="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-10 max-h-48 overflow-y-auto border border-gray-100"
        >
          <ul>
            <li
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="p-3 hover:bg-green-50 cursor-pointer text-gray-700 transition-colors duration-200"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>

      <!-- User & Mobile Controls -->
      <div class="flex items-center gap-x-3 md:gap-x-6">
        <!-- User Avatar + Dropdown -->
        <div class="relative flex items-center">
          <BaseButton
            class="h-10 flex items-center px-3 md:px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition-colors duration-200 text-white"
            @click="toggleDropDown"
          >
            <div v-if="!user?.image" class="flex items-center space-x-2">
              <font-awesome-icon icon="user" />
              <span class="text-sm md:text-base">{{ user?.name }}</span>
            </div>
            <div v-else class="flex w-full md:items-center space-x-2">
              <img
                :src="user?.image"
                alt="User Avatar"
                class="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
              />
              <span class="text-sm md:text-base hidden md:block">{{ user?.name }}</span>
            </div>
          </BaseButton>
          <BaseDropdown
            class="top-[0.8rem]"
            :isOpen="isdropdown"
            :items="profileItems"
            @select="handleProfileAction"
          />
        </div>

        <!-- Nút Mobile Search & Sidebar Toggle -->
        <div class="flex md:hidden gap-x-2">
          <BaseButton
            @click="showMobileSearch = true"
            class="focus:outline-none p-2 rounded-full hover:bg-green-700 transition-colors duration-200"
            title="Tìm kiếm"
          >
            <font-awesome-icon icon="search" class="text-white text-lg" />
          </BaseButton>
          <BaseButton
            @click="toggleSidebar"
            class="focus:outline-none p-2 rounded-full hover:bg-green-700 transition-colors duration-200"
            title="Menu"
          >
            <font-awesome-icon icon="bars" class="text-white text-lg" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Sidebar Mobile -->
    <SidebarMobile
      v-if="opensidebar"
      :opensidebar="opensidebar"
      @closeSidebar="opensidebar = false"
    />

    <!-- Mobile Search Modal -->
    <div
      v-if="showMobileSearch"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col p-4 transition-opacity duration-300"
    >
      <div class="flex justify-between items-center mb-4">
        <span class="font-bold text-lg text-white">Tìm kiếm</span>
        <BaseButton @click="closeMobileSearch" class="focus:outline-none">
          <font-awesome-icon icon="times" class="text-white text-lg" />
        </BaseButton>
      </div>
      <div class="relative">
        <FormInput
          v-model="searchQuery"
          placeholder="Nhập từ khóa..."
          class="pl-12 pr-12 py-2 rounded-lg w-full bg-white shadow-sm focus:ring-2 focus:ring-green-400 transition-all duration-200"
          @focus="showSuggestions = true"
          @input="handleInput"
        />
        <BaseButton
          class="absolute top-0 left-0 w-10 h-full flex items-center justify-center"
          variant="success"
          @click="handleSearch"
        >
          <font-awesome-icon icon="search" class="text-white text-lg" />
        </BaseButton>
        <BaseButton
          v-if="searchQuery"
          class="absolute top-0 right-0 w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-600"
          @click="clearSearch"
        >
          <font-awesome-icon icon="times-circle" />
        </BaseButton>
      </div>
      <div
        v-if="showSuggestions && suggestions.length"
        class="mt-2 bg-white shadow-lg rounded-lg max-h-48 overflow-y-auto border border-gray-100"
      >
        <ul>
          <li
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="p-3 hover:bg-green-50 cursor-pointer text-gray-700 transition-colors duration-200"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import useLoading from "~/composables/useLoading.js";
import useModal from "~/composables/useModal";



const { profile, user, logout } = useAuth();
const { isLoading, setLoading } = useLoading();
const toast = useToast();
const { isOpen, open, close, toggle } = useModal();

const searchQuery = ref("");
const showSuggestions = ref(false);
const suggestions = ref(["Cây trồng", "Nhà kính 1", "Nhà kính 2"]);
const isdropdown = ref(false);
const showMobileSearch = ref(false);
const opensidebar = ref(false);

const closeMobileSearch = () => {
  showMobileSearch.value = false;
};

const toggleDropDown = () => {
  isdropdown.value = !isdropdown.value;
};

const toggleSidebar = () => {
  opensidebar.value = !opensidebar.value;
};

const handleInput = () => {
  if (searchQuery.value) {
    suggestions.value = ["Kết quả 1", "Kết quả 2", "Kết quả 3"];
  } else {
    suggestions.value = ["Cây trồng", "Nhà kính 1", "Nhà kính 2"];
  }
};

const handleSearch = () => {
  console.log("Tìm kiếm:", searchQuery.value);
  showMobileSearch.value = false;
};

const clearSearch = () => {
  searchQuery.value = "";
  showSuggestions.value = false;
  closeMobileSearch();
};

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
  handleSearch();
};

const profileItems = ref([
  { id: 1, text: "Hồ sơ cá nhân", action: "profile", icon: "user", link: "/profile" },
  { id: 2, text: "Cài đặt", action: "settings", icon: "fa-cog", link: "/settings" },
  { id: 3, text: "Đăng xuất", action: "logout", icon: "fa-right-from-bracket" },
]);

const handleProfileAction = (action) => {
  setLoading(true);
  switch (action) {
    case "profile":
      console.log("Hồ sơ cá nhân");
      break;
    case "settings":
      console.log("Cài đặt");
      break;
    case "logout":
      toast.success("Bạn đã đăng xuất thành công");
      logout();
      setLoading(false);
      break;
    default:
      break;
  }
};
</script>

<style scoped>
header {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
</style>
