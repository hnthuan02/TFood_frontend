<template>
    <div class="MenuPage">
        <main>
            <section class="new-dishes">
                <div class="container">
                    <h2 class="dishes-title">Món Mới</h2>
                    <div class="dish-grid">
                        <div class="dish-card" v-for="dish in filteredDishesNew" :key="dish._id">
                            <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                            <h3 class="dish-name">{{ dish.NAME }}</h3>
                            <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                            <button type="submit" class="btn btn-danger rounded-pill btn-block">Đặt ngay</button>
                        </div>
                    </div>
                    <h2 class="best-sell dishes-title">Món Bán Chạy</h2>
                    <div class="dish-grid">
                        <div class="dish-card" v-for="dish in filteredDishesBest" :key="dish._id">
                            <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                            <h3 class="dish-name">{{ dish.NAME }}</h3>
                            <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                            <button type="submit" class="btn btn-danger rounded-pill btn-block">Đặt ngay</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <div class="minicart-wrapper">
            <!-- Nút giỏ hàng -->
            <div class="minicart-content-trigger">
                <button class="action showcart" @click="toggleCart">
                    <font-awesome-icon icon="cart-shopping" style="color: #ff0000;" />
                    <span class="counter">
                        <span class="counter-number">{{ cartCount }}</span>
                        <span class="counter-label">Giỏ hàng</span>
                    </span>
                </button>
            </div>

            <!-- Nội dung giỏ hàng -->
            <div v-if="isCartVisible" class="cart-content">
                <div class="cart-header">
                    <h4>Phần ăn đã chọn</h4>
                    <button @click="toggleCart">Đóng</button>
                </div>
                <div class="cart-body">
                    <p v-if="cartCount === 0">Bạn không có sản phẩm nào trong giỏ hàng của bạn.</p>
                    <div v-for="item in cartItems" :key="item.id" class="cart-item">
                        <p>{{ item.name }} - {{ item.quantity }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosClient from "../../api/axiosClient";
import MenuCategory from './MenuCategory.vue';

export default {
    name: 'MenuPage',
    components: {
        MenuCategory
    },
    data() {
        return {
            dishes: [],
            loading: true,
            showCategoryOnScroll: false,
            cartItems: [],
            isCartVisible: false,
        };
    },
    computed: {
        cartCount() {
            return this.cartItems.reduce((total, item) => total + item.quantity, 0);
        },
        filteredDishesNew() {
            return this.dishes.filter(dish => dish.NEWEST === true);
        },
        filteredDishesBest() {
            return this.dishes.filter(dish => dish.BEST === true);
        }
    },
    mounted() {
        this.fetchProducts();
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await axiosClient.get("/foods/allFood");
                this.dishes = response.data;
                this.loading = false;
            } catch (error) {
                console.error("Error fetching products:", error);
                this.loading = false;
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        handleScroll() {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 250) {
                this.showCategoryOnScroll = true;
            } else {
                this.showCategoryOnScroll = false;
            }
        },
        toggleNavbar() {
            const collapseElement = document.getElementById('navbarSupportedContent');
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: true
            });
            if (collapseElement.classList.contains('show')) {
                bsCollapse.hide();
            } else {
                bsCollapse.show();
            }
        },
        toggleCart() {
            this.isCartVisible = !this.isCartVisible;
        },
        // Hàm giả lập thêm sản phẩm vào giỏ hàng
        addToCart(item) {
            const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cartItems.push({ ...item, quantity: 1 });
            }
        }
    }
};
</script>

<style lang="scss">
@import "./Menu.scss";
</style>
