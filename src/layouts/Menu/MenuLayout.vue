<template>
    <div class="app">
        <div class="d-block w-100">
            <Header :class="{ 'hidden-header': isMenuPage && isScrolled }" />
            <div :class="{ 'sticky-category': isMenuPage && isScrolled }">
                <MenuCategory :isScrolled="isScrolled" />
            </div>
            <router-view />
            <Footer />
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Footer from '../../components/FooterUser/FooterUser.vue';
import Header from "../../components/HeaderUser/HeaderUser.vue";
import MenuCategory from "../../views/Menu/MenuCategory.vue";

const isScrolled = ref(false);
const route = useRoute();

// Kiểm tra nếu đang ở trang menu để điều chỉnh hiển thị
const isMenuPage = computed(() => route.path.startsWith('/menu'));

const handleScroll = () => {
    const scrollTop = window.scrollY;
    isScrolled.value = scrollTop > 100;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.hidden-header {
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
}

.sticky-category {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    transform: translateY(-100%);
}

.sticky-category.scrolled {
    transform: translateY(0);
}

.app {
    padding-top: 0;
    /* Đảm bảo không có khoảng trắng không mong muốn */
}

.d-block {
    display: block;
    width: 100%;
}
</style>
