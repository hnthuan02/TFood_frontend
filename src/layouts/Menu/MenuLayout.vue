<template>
    <div class="app">
        <div class="d-block w-100">
            <Header :class="{ 'hidden-header': isMenuPage && isScrolled }" />
            <MenuCategory />
            <router-view />
            <Footer />
            <!-- Nút Cart nhỏ -->
            <button class="cart-button" @click="toggleCart">
                <font-awesome-icon :icon="['fas', 'cart-shopping']" />
            </button>

            <!-- Overlay -->
            <div v-if="isCartVisible" class="overlay" @click="toggleCart"></div>

            <!-- Popup giỏ hàng -->
            <div v-if="isCartVisible" class="cart-popup">
                <Cart @close="toggleCart" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import Cart from '../../components/Cart/Cart.vue';
import Footer from '../../components/FooterUser/FooterUser.vue';
import Header from "../../components/HeaderUser/HeaderUser.vue";
import MenuCategory from "../../views/Menu/MenuCategory.vue";

// Trạng thái hiển thị giỏ hàng
const isCartVisible = ref(false);

// Hàm bật/tắt hiển thị giỏ hàng
const toggleCart = () => {
    isCartVisible.value = !isCartVisible.value;
};
</script>

<style scoped>
.cart-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #34495E;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
    z-index: 1000;
    /* Đảm bảo nút hiển thị trên các thành phần khác */
}

.cart-button:hover {
    background-color: #a93226;
    transform: scale(1.1);
}

/* Overlay bao phủ toàn bộ màn hình khi giỏ hàng xuất hiện */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    /* Màu nền mờ đen */
    z-index: 999;
    /* Đảm bảo overlay hiển thị dưới cart popup */
}

/* Popup giỏ hàng */
.cart-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1300px;
    max-width: 90%;
    max-height: 90vh;
    background-color: #1f2f3e;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    z-index: 1000;
    padding: 20px;
    color: #FAE8B2;
}

.cart-popup::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #2b1b17;
}

.cart-popup h2 {
    margin-top: 0;
    font-size: 18px;
}

.cart-popup button {
    display: block;
    margin-top: 20px;
    background-color: #c0392b;
    color: #FAE8B2;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.cart-popup button:hover {
    background-color: #a93226;
}
</style>
