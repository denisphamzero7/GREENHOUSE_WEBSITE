<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 lg:px-8">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <BaseHeading as="h2">Đăng nhập</BaseHeading>
      <form @submit.prevent="handleLogin">
        <FormGroup
          class="mb-4"
          label="Email"
          labelFor="email"
          name="email"
          placeholder="gmail của khách hàng"
          v-model="userForm.email"
          :errorMessages="errorBag?.email || ''"
        ></FormGroup>

        <FormGroup
          class="mb-4"
          label="Mật khẩu"
          labelFor="password"
          name="password"
          placeholder="Mật khẩu"
          type="password"
          v-model="userForm.password"
          :errorMessages="errorBag?.password || ''"
          autocomplete="current-password"
        ></FormGroup>

        <div class="flex justify-between items-center mb-6">
          <a href="#" class="text-blue-500 hover:underline">Quên mật khẩu?</a>
        </div>

        <BaseButton
          :loading="isLoading"
          :disabled="isLoading"
          variant="success"
          type="submit"
          class="w-full text-white p-2 rounded"
        >
          Đăng Nhập
        </BaseButton>
      </form>

      <div class="text-center mt-6">
        <p class="text-gray-700">Hoặc đăng nhập bằng</p>
        <div class="flex flex-col justify-center gap-2 mt-4 md:flex-row">
          <BaseButton variant="danger" class=" bg-red-500 text-white p-2 flex items-center space-x-2">
            <font-awesome-icon :icon="['fab', 'google']" />
            <span>Google</span>
          </BaseButton>
          <BaseButton class="bg-blue-700 text-white p-2 flex items-center space-x-2">
            <font-awesome-icon :icon="['fab', 'facebook']" />
            <span>Facebook</span>
          </BaseButton>
          <BaseButton  class=" bg-pink-500 text-white p-2 flex items-center space-x-2">
            <font-awesome-icon :icon="['fab', 'instagram']" />
            <span>Instagram</span>
          </BaseButton>
        </div>
        <p class="mt-6">
          Chưa có tài khoản?
          <NuxtLink to="register" class="text-blue-500 hover:underline">Đăng ký ngay</NuxtLink>
        </p>
      </div>
    </div>

    <!-- Modal Nhập OTP -->
    <div v-if="showOtpModal" @click="toggleOtpModal()" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" @click.stop>
        <h3 class="text-xl font-semibold text-center mb-4">Xác thực OTP</h3>
        <p class="text-gray-600 text-center mb-4">Vui lòng nhập mã OTP gửi đến email của bạn</p>
        
        <input
          type="text"
          v-model="otp"
          placeholder="Nhập mã OTP"
          class="w-full border border-gray-300 rounded p-2 mb-4"
        />
        
        <BaseButton :loading="isVerifyingOtp" variant="success" class="w-full mb-2" @click="handleVerifyOtp">
          Xác nhận OTP
        </BaseButton>

        <BaseButton variant="secondary" class="w-full" @click="handleResendOtp">
          Gửi lại OTP
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest',
  layout: 'default',
});

import { ref, reactive } from 'vue';
import useLoading from '~/composables/useLoading.js';
import { useToast } from 'vue-toastification';
import useAuth from '~/composables/useAuth.js';

const { isLoading, setLoading } = useLoading();
const toast = useToast();
const {
  login,
  sendOtpEmail,
  verifyOtp,
  errorBag,
  emailForOtp,
  otp,
  showOtpModal,
  toggleOtpModal,
  msg,
} = useAuth();

const isVerifyingOtp = ref(false);

const userForm = reactive({
  email: '',
  password: '',
});

async function handleLogin() {
  setLoading(true);
  try {
    const isSuccess = await login(userForm);
    if (isSuccess) {
      toast.success('Đăng nhập thành công!');
    } else {
      toast.error('Đăng nhập thất bại!');
    }
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    if (error?.response?.data?.message === 'ERR_ACCOUNT_NOT_VERIFIED') {
      emailForOtp.value = userForm.email;
      toggleOtpModal();
      toast.info('Tài khoản chưa xác thực. Hãy nhập OTP!');
    } else {
      toast.error('Đăng nhập thất bại!');
    }
  } finally {
    setLoading(false);
  }
}

async function handleResendOtp() {
  try {
    await sendOtpEmail();
    toast.success('Đã gửi lại mã OTP!');
  } catch (error) {
    console.error('Lỗi gửi lại OTP:', error);
    toast.error('Gửi OTP thất bại!');
  }
}

async function handleVerifyOtp() {
  isVerifyingOtp.value = true;
  try {
    const isSuccess = await verifyOtp();
    if (isSuccess) {
      toast.success('Xác nhận OTP thành công!');
      toast.success(msg.value);
    }
  } catch (error) {
    toast.error('Xác nhận OTP thất bại!');
  } finally {
    isVerifyingOtp.value = false;
  }
}
</script>
