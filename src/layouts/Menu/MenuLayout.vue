<template>
    <div class="app">
        <div class="d-block w-100">
            <Header />
            <div :class="{ 'sticky-category': isScrolled }">
                <MenuCategory :isScrolled="isScrolled" />
            </div>
            <router-view />
            <Footer />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Footer from '../../components/FooterUser/FooterUser.vue';
import Header from "../../components/HeaderUser/HeaderUser.vue";
import MenuCategory from "../../views/Menu/MenuCategory.vue";

// Biến phản ứng để theo dõi trạng thái cuộn
const isScrolled = ref(false);

// Hàm xử lý sự kiện scroll
const handleScroll = () => {
    const scrollTop = window.scrollY;
    isScrolled.value = scrollTop > 100; // Kiểm tra nếu cuộn qua 100px thì sẽ thay đổi trạng thái
};

// Thêm sự kiện scroll khi component được gắn
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

// Gỡ sự kiện scroll khi component bị hủy
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.menu-category {
    background-color: #EE4545;
    padding: 10px 0;
    z-index: 999;
    margin-left: 250px;
    margin-right: 250px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
}

.sticky-category {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    z-index: 1000;
    transition: margin-top 0.5s ease;

}

/* Các style khác */
.d-block {
    display: block;
    width: 100%;
}

.menu-category .container {
    display: flex;
    justify-content: center;
    gap: 20px;
    overflow-x: auto;
}

.menu-category .menu-item {
    font-size: 1rem;
    text-align: center;
    padding: 8px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
}

.menu-category .menu-item a {
    color: #fff;
    text-decoration: none;
    display: block;
}

.menu-category .menu-item:hover {
    color: #ee4545;
}

.menu-item {
    color: #fff;
    font-size: 1rem;
    text-align: center;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        color: #ee4545;
    }

    &:hover img {
        transition: transform 0.5s ease, filter 0.5s ease;
        transform: scale(1.2);
        filter: brightness(90%);
    }
}

.MenuPage {

    /* Basic styles for the page */
    .new-dishes {
        padding: 60px 0;

        .dish-grid {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;

            .dish-card {
                flex: 1 1 calc(33.333% - 20px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
                text-align: center;

                img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                h3 {
                    margin: 10px 0;
                }

                p {
                    padding: 0 10px;
                }
            }
        }
    }

    /* Phần category cố định khi cuộn */
    .sticky-category {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #EE4545;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
}
</style>
