<template>
  <MetaTags title="Sign In" description="Sign in to your account" />
  <div>
      <AuthLogin />
  </div>
</template>

<script setup>
// import AuthLogin from '@/components/Auth/Login.vue';
definePageMeta({
  layout: false
});
</script>

<style scoped>
</style>
