<template>
    <div class="MenuPage">
        <main>
            <section class="new-dishes">
                <div class="container">
                    <h2 v-if="!type" class="dishes-title">Món Mới</h2>
                    <div class="dish-grid" v-if="!type">
                        <div class="dish-card" v-for="dish in filteredDishesNew" :key="dish._id">
                            <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                            <h3 class="dish-name">{{ dish.NAME }}</h3>
                            <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                            <button type="submit" class="btn btn-danger rounded-pill btn-block">Đặt ngay</button>
                        </div>
                    </div>
                    <h2 v-if="!type" class="best-sell dishes-title">Món Bán Chạy</h2>
                    <div class="dish-grid" v-if="!type">
                        <div class="dish-card" v-for="dish in filteredDishesBest" :key="dish._id">
                            <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                            <h3 class="dish-name">{{ dish.NAME }}</h3>
                            <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                            <button type="submit" class="btn btn-danger rounded-pill btn-block">Đặt ngay</button>
                        </div>
                    </div>

                    <!-- Hiển thị món theo TYPE nếu có -->
                    <h2 v-if="type" class="dishes-title">{{ type }}</h2>
                    <div class="dish-grid" v-if="type">
                        <div class="dish-card" v-for="dish in filteredDishesByType" :key="dish._id">
                            <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                            <h3 class="dish-name">{{ dish.NAME }}</h3>
                            <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                            <button type="submit" class="btn btn-danger rounded-pill btn-block">Đặt ngay</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
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
    props: {
        type: {
            type: String,
            default: null
        }
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
        },
        filteredDishesByType() {
            return this.dishes.filter(dish => dish.TYPE === this.type);
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
        toggleCart() {
            this.isCartVisible = !this.isCartVisible;
        }
    }
};
</script>

<style lang="scss">
@import "./Menu.scss";
</style>