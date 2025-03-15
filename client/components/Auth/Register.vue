<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <BaseHeading as="h2">Đăng kí</BaseHeading>
      <form @submit.prevent="handleForm">
        <FormGroup
          :errorMessages="errorBag?.name || ''"
          v-model="userForm.name"
          class="mb-2"
          label="Họ và tên"
          labelFor="name"
          name="name"
          placeholder="tên của tài khoản"
        ></FormGroup>
        <FormGroup
          :errorMessages="errorBag?.email || ''"
          v-model="userForm.email"
          class="mb-2"
          label="email"
          labelFor="email"
          name="email"
          placeholder="gmail của khách hàng"
        ></FormGroup>
       
        <div>
          <label for="phone" class="mb-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
          <vue-tel-input
          v-model="userForm.phone"
          class="mb-2"
          :preferred-countries="['VN']"
          :input-options="{ showDialCode: true }"
          label="Số điện thoại"
          id="phone"
          name="phone"
          placeholder="Nhập số điện thoại"
        />
        <div v-if="errorBag?.phone" class="text-red-500 text-sm">
          {{ errorBag.phone }}
        </div>
        </div>

        <FormGroup
          :errorMessages="errorBag?.password || ''"
          v-model="userForm.password"
          class="mb-2"
          label="Mật Khẩu"
          labelFor="password"
          name="password"
          placeholder="Mật Khẩu của bạn !"
          type="password"
        ></FormGroup>
        <BaseButton
          :loading="isLoading"
          :disabled="isLoading"
          type="submit"
          variant="danger"
          >đăng kí ngay</BaseButton
        >
      </form>
      <div class="text-center mt-6">
        <!-- <p class="text-gray-700">Hoặc đăng nhập bằng</p>
          <div class="flex justify-center space-x-4 mt-4">
            <button class="bg-blue-700 text-white p-2 rounded"><i class="fab fa-facebook"></i> Facebook</button>
            <button class="bg-pink-600 text-white p-2 rounded"><i class="fab fa-instagram"></i> Instagram</button>
          </div> -->
        <span
          >Bạn đã đăng kí tài khoản ?
          <nuxt-link to="login" class="text-green-500"
            >Đăng nhập</nuxt-link
          ></span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import useLoading from "~/composables/useLoading.js";

import { useToast } from "vue-toastification";
const { isLoading, setLoading } = useLoading();
const userForm = reactive({
  name: "",
  phone: "",
  email: "",
  password: "",
});
const toast = useToast();
const { register, errorBag } = useAuth();
async function handleForm() {
  setLoading(true);
  try {
    console.log("UserForm trước khi gửi:", userForm); // Log giá trị form
    const signup = await register(userForm);
    if (signup) {
      toast.info("đăng kí thành công");
    } else {
      toast.error("đăng kí thất bại");
    }
  } catch (error) {
    throw new Error(error);
  } finally {
    setLoading(false);
  }
}
</script>
