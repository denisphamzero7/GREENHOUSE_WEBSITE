import { ref } from "vue";
import useError from "./useError.js";
import useAxios from "./useAxios";
import { useAuthStore } from "~/stores/auth.js";
import { storeToRefs } from "pinia";

export default function useAuth() {
  const authStore = useAuthStore();
  const { user, token, isVerified } = storeToRefs(authStore);
  const { errorBag, transformValidationErrors, resetErrorBag } = useError();
  const { api } = useAxios();

  const showOtpModal = ref(false);
  const emailForOtp = ref("");
  const otp = ref("");
  const msg = ref("");

  function toggleOtpModal() {
    showOtpModal.value = !showOtpModal.value;
  }

  async function profile() {
    try {
      const { data } = await api.get("api/user/profile");
      authStore.setUser(data.user);
    } catch (error) {
      console.error("Lấy thông tin tài khoản thất bại:", error);
    }
  }

  async function login(userForm) {
    resetErrorBag();
    try {
      const { data } = await api.post("api/user/login", userForm);
      if (!data?.user) throw new Error("Dữ liệu phản hồi không hợp lệ!");

      authStore.setUser(data.user, data.accessToken);
      navigateTo("/dashboard");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ?.map((err) => err.message)
        .join(", ");
      console.error("Login error:", errorMessage); 
      if (errorMessage === "ERR_ACCOUNT_NOT_VERIFIED") {
        emailForOtp.value = userForm.email;
        showOtpModal.value = true;
        console.log("OTP modal hiển thị:", showOtpModal.value);
      } else {
        transformValidationErrors(error.response);
      }
      return false;
    }
  }

  async function logout() {
    try {
      await api.post("api/user/logout");
      authStore.clearAuth();
      navigateTo("auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async function register(userForm) {
    resetErrorBag();
    try {
      const { data } = await api.post("api/user/register", userForm);
      if (data.success) {
        authStore.setUser(data.newUser);
        navigateTo("login");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      transformValidationErrors(error.response);
      return false;
    }
  }

  async function sendOtpEmail() {
    try {
      const { data } = await api.post("api/user/resendotp", { email: emailForOtp.value });
      console.log("Gửi OTP thành công:", data);
    } catch (error) {
      transformValidationErrors(error.response);
    }
  }

  async function verifyOtp() {
    try {
      const { data } = await api.post("api/user/verifyotp", { 
        email: emailForOtp.value, 
        otp: otp.value 
      });
      if (data.success) {
        showOtpModal.value = false;
        msg.value = data.message;
        return true;
      }
      return false;
    } catch (error) {
      transformValidationErrors(error.response);
      return false;
    }
  }

  return {
    profile,
    login,
    register,
    sendOtpEmail,
    verifyOtp,
    logout,
    user,
    token,
    isVerified,
    showOtpModal,
    emailForOtp,
    otp,
    msg,
    errorBag,
    toggleOtpModal,
  };
}
