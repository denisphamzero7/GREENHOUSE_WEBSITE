<template>
    <MetaTags title="trang chủ" description="Sign in to your account" />
    <div>
      
    </div>
  </template>
  
  <script setup>

  definePageMeta({
  middleware: 'auth',
  layout:'admin'
});
  </script>
  
  <style scoped>
  </style>
  