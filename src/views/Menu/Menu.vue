<template>
    <div class="MenuPage">
        <section class="new-dishes">
            <div class="container">
                <!-- Món mới -->
                <h2 v-if="!type" class="dishes-title">Món Mới</h2>
                <div class="dish-grid" v-if="!type">
                    <div class="dish-card" v-for="dish in filteredDishesNew" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order">Đặt ngay</button>
                    </div>
                </div>
                <!-- Món bán chạy -->
                <h2 v-if="!type" class="dishes-title best-sell">Món Bán Chạy</h2>
                <div class="dish-grid" v-if="!type">
                    <div class="dish-card" v-for="dish in filteredDishesBest" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order">Đặt ngay</button>
                    </div>
                </div>
                <!-- Món theo loại -->
                <h2 v-if="type" class="dishes-title">{{ displayType }}</h2>
                <div class="dish-grid" v-if="type">
                    <div class="dish-card" v-for="dish in filteredDishesByType" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order">Đặt ngay</button>
                    </div>
                </div>
            </div>
        </section>
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
        },
        displayType() {
            switch (this.type) {
                case 'Pasta':
                    return 'Mỳ Ý';
                case 'Dessert':
                    return 'Món Tráng Miệng';
                case 'Drink':
                    return 'Thức Uống';
                default:
                    return this.type;
            }
        }
    },
    mounted() {
        this.fetchProducts();
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.MenuPage {
    .new-dishes {
        padding: 60px 0;
        background-color: #f8f9fa;
        /* Màu nền đồng nhất với phần đặt bàn */

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .dish-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            /* Chia thành 3 cột bằng nhau */
            gap: 20px;
            /* Khoảng cách giữa các thẻ */
        }

        .dish-card {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            /* Đổ bóng mạnh hơn để tạo cảm giác nổi bật */
            border-radius: 10px;
            overflow: hidden;
            text-align: center;
            background-color: #ffffff;
            /* Nền trắng tinh tế cho mỗi thẻ */
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
                /* Hiệu ứng nổi lên khi hover */
            }

            img {
                width: 100%;
                /* Đảm bảo ảnh chiếm toàn bộ chiều rộng của thẻ */
                height: 300px;
                /* Chiều cao cố định cho ảnh */
                object-fit: cover;
                /* Giữ tỷ lệ khung hình và cắt ảnh nếu cần */
                display: block;
                border-bottom: 1px solid #ddd;
                /* Đường viền dưới ảnh */
            }

            .dish-name {
                margin: 10px 0;
                font-family: "Playfair Display", serif;
                /* Font chữ sang trọng */
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
                /* Màu chữ đồng nhất với phần đặt bàn */
            }

            .dish-price {
                padding: 0 10px;
                color: #e74c3c;
                /* Màu đỏ thẳm */
                font-size: 20px;
                margin: 0;
                font-family: "Playfair Display", serif;
                font-weight: bold;
            }

            .btn-order {
                margin-bottom: 15px;
                font-size: 18px;
                font-family: "Playfair Display", serif;
                font-weight: bold;
                height: 50px;
                width: 130px;
                background-color: #2c3e50;
                /* Màu nền tương đồng với phần đặt bàn */
                border: none;
                border-radius: 25px;
                transition: background-color 0.3s ease;
                color: #fff;
            }

            .btn-order:hover {
                background-color: #34495e;
                /* Màu nền đậm hơn khi hover */
            }
        }
    }

    .sticky-category {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        background-color: #2b1b17;
        /* Nền đỏ thẳm cho phần category */
        color: #fff;
        /* Chữ trắng cho phần category */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        padding: 10px 20px;
    }

    .best-sell {
        margin-top: 20px;
    }

    .dishes-title {
        font-weight: bold;
        font-family: "Playfair Display", serif;
        color: #2c3e50;
        /* Màu chữ đồng nhất với phần đặt bàn */
        border-bottom: 2px solid #34495e;
        /* Đường viền xám đậm */
        padding-bottom: 5px;
        margin-bottom: 20px;
        text-align: center;
    }
}
</style>
