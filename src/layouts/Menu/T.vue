<template>
    <div class="app">
        <div class="d-block w-100">
            <Header :class="{ 'hidden-header': isMenuPage && isScrolled }" />
            <MenuCategory />
            <router-view />
            <Footer />
        </div>
    </div>
</template>

<script setup>
import Footer from '../../components/FooterUser/FooterUser.vue';
import Header from "../../components/HeaderUser/HeaderUser.vue";
import MenuCategory from "../../views/Menu/MenuCategory.vue";


</script>
