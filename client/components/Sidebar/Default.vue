<template>
    <div class="bg-green-300  h-screen container pt-5" >
      <ul>
        <li v-for="item in sidebar" :key="item.title">
          <NuxtLink :to="item.path">
            <font-awesome-icon :icon="item.icon" />
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const sidebar = ref([
    { title: 'Overview', icon: 'home', path: '/' },
    { title: 'About', icon: 'info', path: '/about' },
    { title: 'Contact', icon: 'phone', path: '/contact' },
    { title: 'Services', icon: 'handshelping', path: '/services' },
    { title: 'Products', icon: 'product', path: '/products' },
    { title: 'FAQ', icon: 'faq', path: '/faq' },
    { title: 'Blog', icon: 'blog', path: '/blog' },
    { title: 'Support', icon:'support', path: '/support' },
    { title: 'Account', icon: 'account', path: '/account' },
    { title: 'Settings', icon:'settings', path: '/settings' },
    { title: 'Log Out', icon: 'logout', path: '/logout' }
 ]);

</script>

<style lang="scss" scoped>

</style>