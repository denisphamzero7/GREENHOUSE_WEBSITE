import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: process.client ? localStorage.getItem("token") || null : null,
    isVerified: false,
    role:null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },
  actions: {
    setUser(userData: any, accessToken?: string) {
      this.user = userData;
      if (accessToken) {
        this.token = accessToken;
        if (process.client) {
          localStorage.setItem("token", accessToken);
        }
      }
    },
    setVerified(isVerified: boolean) {
      this.isVerified = isVerified;
    },
    clearAuth() {
      this.user = null;
      this.token = null;
      if (process.client) {
        localStorage.removeItem("token");
      }
    },
  },
});
