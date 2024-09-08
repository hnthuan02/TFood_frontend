<template>
    <div class="MenuPage">
        <section class="menu-category">
            <MenuCategory />
        </section>

        <section v-if="showCategoryOnScroll" class="sticky-category">
            <MenuCategory />
        </section>

        <main>
            <section class="new-dishes">
                <div class="container">
                    <h2>Món Mới</h2>
                    <div class="dish-grid">
                        <div class="dish-card" v-for="dish in dishes" :key="dish._id">
                            <img :src="dish.image[0]" :alt="dish.name" />
                            <h3>{{ dish.name }}</h3>
                            <p>{{ dish.DESCRIPTION }}</p>
                            <p>{{ formatPrice(dish.PRICE) }}</p>
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
import MenuCategory from './MenuCategory.vue';

export default {
    name: 'MenuPage',
    components: {
        MenuCategory
    },
    data() {
        return {

            showCategoryOnScroll: false,
            cartItems: [],
            isCartVisible: false,
        };
    },
    computed: {
        cartCount() {
            return this.cartItems.reduce((total, item) => total + item.quantity, 0);
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
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
