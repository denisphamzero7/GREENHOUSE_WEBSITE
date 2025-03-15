<template>
   <Head>
    <title> {{ title }}</title>
    <Meta name="description" :content="description"/>
    <Meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    <Meta property="og:title" :content="title"/>
    <Meta property="og:description" :content="description"/>
    <Meta property="og:image" :content="image"/>
    <Meta property="og:type" content="website"/>
    <Meta property="og:url" :content="url"/>
    <!-- <Meta property="writer:card" :content="summary_large_image"/> -->
    <Meta property="writer:description" :content="description"/> 
    <Meta property="writer:image" :content="image"/> 
   </Head>
</template>

<script setup>
defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
        type: String,
        default:'/favicon.ico'
    },
    url: {
        type: String,
        default:'http://localhost:3000'
    }
})
</script>

<style lang="scss" scoped>

</style>