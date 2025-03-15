export default defineNuxtRouteMiddleware((to) => {
  const token = localStorage.getItem("token");

  // Nếu không có token, chuyển hướng đến trang login
  if (!token) {
    return navigateTo("/auth/login");
  }

  // Nếu người dùng đang ở trang chủ, chuyển hướng đến Dashboard
  if (to.path === "/") {
    return navigateTo("/Dashboard");
  }
});
