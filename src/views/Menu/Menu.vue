<template>
    <div class="MenuPage">
        <section class="new-dishes">
            <div class="container">
                <div class="search-box">
                    <button class="btn-search" @click="searchDishes"><i class="fas fa-search"></i></button>
                    <input type="text" class="input-search" v-model="searchQuery" placeholder="Tìm kiếm món ăn..."
                        @keydown.enter="searchDishes" />
                </div>
                <!-- Món mới -->
                <h2 v-if="!type && !searchQuery" class="dishes-title">Món Mới</h2>
                <div class="dish-grid" v-if="!type && !searchQuery">
                    <div class="dish-card" v-for="dish in filteredDishesNew" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order" @click="onOrderDish(dish)">Đặt ngay</button>
                    </div>
                </div>
                <!-- Hiển thị kết quả tìm kiếm -->
                <h2 v-if="searchQuery" class="dishes-title">Kết quả tìm kiếm cho: "{{ searchQuery }}"</h2>
                <div class="dish-grid" v-if="searchQuery">
                    <div class="dish-card" v-for="dish in searchedDishes" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order" @click="onOrderDish(dish)">Đặt ngay</button>
                    </div>
                </div>

                <!-- Món bán chạy -->
                <h2 v-if="!type && !searchQuery" class="dishes-title best-sell">Món Bán Chạy</h2>
                <div class="dish-grid" v-if="!type && !searchQuery">
                    <div class="dish-card" v-for="dish in filteredDishesBest" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order" @click="onOrderDish(dish)">Đặt ngay</button>
                    </div>
                </div>

                <!-- Món theo loại -->
                <h2 v-if="type" class="dishes-title">{{ displayType }}</h2>
                <div class="dish-grid" v-if="type">
                    <div class="dish-card" v-for="dish in filteredDishesByType" :key="dish._id">
                        <img :src="dish.IMAGES[0]" :alt="dish.NAME" />
                        <h3 class="dish-name">{{ dish.NAME }}</h3>
                        <p class="dish-price">{{ formatPrice(dish.PRICE) }}</p>
                        <button type="submit" class="btn btn-order" @click="onOrderDish(dish)">Đặt ngay</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal chọn bàn -->
        <div v-if="isCartVisible" class="cart-modal">
            <div class="modal-content">
                <h3>Chọn Bàn</h3>
                <ul v-if="cartTables.length > 0" class="table-list">
                    <li v-for="table in cartTables" :key="table.TABLE_ID" class="table-item">
                        <input type="radio" :value="table.TABLE_ID" v-model="selectedTable" class="table-radio" />
                        <label>
                            Bàn: {{ table.tableInfo.TABLE_NUMBER }} - Thời gian: {{ table.BOOKING_TIME }}
                        </label>
                        <div class="quantity-selector">
                            <label for="quantity-{{ table.TABLE_ID }}">Số lượng:</label>
                            <input type="number" v-model.number="quantities[table.TABLE_ID]" min="1"
                                id="quantity-{{ table.TABLE_ID }}" placeholder="0" class="quantity-input" />
                        </div>
                    </li>
                </ul>
                <p v-else class="no-tables-message">Không có bàn nào trong giỏ hàng.</p>
                <button @click="addFoodToSelectedTable" class="confirm-button">Xác Nhận</button>
                <button @click="toggleCart" class="close-button">Đóng</button>
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
            cartTables: [], // Chứa thông tin các bàn trong giỏ hàng
            selectedTable: null, // Bàn được chọn trong modal
            selectedDish: null, // Món được chọn
            isCartVisible: false, // Trạng thái hiển thị modal
            quantities: {}, // Khởi tạo quantities cho mỗi bàn
            searchQuery: '',
        };
    },
    computed: {
        filteredDishesNew() {
            return this.dishes
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo createdAt giảm dần
                .slice(0, 3);
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
        },
        searchedDishes() {
            return this.dishes.filter(dish =>
                dish.NAME.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    mounted() {
        this.fetchProducts();
        this.fetchCartTables(); // Lấy thông tin các bàn trong giỏ hàng khi trang được tải
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
        async fetchCartTables() {
            try {
                const response = await axiosClient.get("/carts/getCartById");

                // Gán đúng giá trị cho cartTables
                this.cartTables = response.data.data.LIST_TABLES || [];

                // Khởi tạo quantities cho mỗi bàn mà không cần dùng this.$set
                this.cartTables.forEach(table => {
                    this.quantities[table.TABLE_ID] = 1; // Khởi tạo số lượng mặc định là 1 (hoặc 0 tùy bạn)
                });
            } catch (error) {
                console.error("Error fetching cart tables:", error);
            }
        },
        onOrderDish(dish) {
            this.selectedDish = dish;
            this.toggleCart(); // Hiển thị modal để chọn bàn
        },
        async addFoodToSelectedTable() {
            if (!this.selectedTable) {
                this.$message.error("Vui lòng chọn bàn.");
                return;
            }

            const quantity = this.quantities[this.selectedTable] || 0;

            if (quantity <= 0) {
                this.$message.error("Vui lòng nhập số lượng món ăn hợp lệ.");
                return;
            }

            try {
                await axiosClient.post("/carts/addFoodToTable", {
                    tableId: this.selectedTable,
                    listFood: [
                        {
                            FOOD_ID: this.selectedDish._id,
                            QUANTITY: quantity
                        }
                    ]
                });
                this.$message.success("Đã thêm món vào bàn thành công!");
                this.toggleCart(); // Đóng modal sau khi thêm món thành công
            } catch (error) {
                console.error("Error adding food to table:", error);
                this.$message.error("Có lỗi xảy ra khi thêm món ăn.");
            }
        },
        toggleCart() {
            this.isCartVisible = !this.isCartVisible;
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        async searchDishes() {
            if (!this.searchQuery) {
                this.fetchProducts(); // Gọi lại danh sách món ăn gốc nếu cần
                return;
            }

            try {
                const response = await axiosClient.post('http://localhost:3001/foods/search', {
                    query: this.searchQuery
                });

                this.dishes = response.data.data; // Gán dữ liệu tìm kiếm vào dishes
            } catch (error) {
                console.error('Lỗi khi tìm kiếm món ăn:', error);
            }
        },
    }
};
</script>

<style scoped>
/* Các kiểu giao diện */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.search-box {
    width: fit-content;
    height: fit-content;
    position: relative;
}

.input-search {
    height: 50px;
    width: 50px;
    border-style: none;
    padding: 10px;
    font-size: 18px;
    letter-spacing: 2px;
    outline: none;
    border-radius: 25px;
    transition: all 0.5s ease-in-out;
    background-color: #436f9b;
    padding-right: 40px;
    color: #000000;
}

.input-search::placeholder {
    color: rgba(47, 66, 85);
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: 100;
}

.btn-search {
    width: 50px;
    height: 50px;
    border-style: none;
    font-size: 20px;
    font-weight: bold;
    outline: none;
    cursor: pointer;
    border-radius: 50%;
    position: absolute;
    right: 0px;
    color: #000000;
    background-color: transparent;
    pointer-events: painted;
}

.btn-search:focus~.input-search {
    width: 300px;
    border-radius: 0px;
    background-color: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
}

.input-search:focus {
    width: 300px;
    border-radius: 0px;
    background-color: transparent;
    border-bottom: 1px solid rgba(47, 66, 85);
    transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
}

/* Các kiểu giao diện món ăn */
.MenuPage {
    .new-dishes {
        padding: 60px 0;
        background-color: #f8f9fa;

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .dish-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .dish-card {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            overflow: hidden;
            text-align: center;
            background-color: #ffffff;
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
            }

            img {
                width: 100%;
                height: 300px;
                object-fit: cover;
                display: block;
                border-bottom: 1px solid #ddd;
            }

            .dish-name {
                margin: 10px 0;
                font-family: "Playfair Display", serif;
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
            }

            .dish-price {
                padding: 0 10px;
                color: #e74c3c;
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
                border: none;
                border-radius: 25px;
                transition: background-color 0.3s ease;
                color: #fff;
            }

            .btn-order:hover {
                background-color: #34495e;
            }
        }
    }

    .best-sell {
        margin-top: 20px;
    }

    .dishes-title {
        font-weight: bold;
        font-family: "Playfair Display", serif;
        color: #2c3e50;
        border-bottom: 2px solid #34495e;
        padding-bottom: 5px;
        margin-bottom: 20px;
        text-align: center;
    }
}

/* Modal chọn bàn */
.cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 400px;
}

h3 {
    font-family: "Playfair Display", serif;
    color: #2c3e50;
    margin-bottom: 20px;
}

.table-list {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.table-item {
    margin: 10px 0;
}

.table-radio {
    margin-right: 10px;
}

.no-tables-message {
    color: #000000;
    font-weight: bold;
}

.confirm-button,
.close-button {
    background-color: #2c3e50;
    color: rgb(255, 255, 255);
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    margin: 5px;
    transition: background-color 0.3s ease;
}

.confirm-button:hover,
.close-button:hover {
    background-color: #34495e;
}

.quantity-selector {
    margin-top: 10px;
}

.quantity-input {
    width: 60px;
    padding: 5px;
    border: 1px solid #000000;
    border-radius: 5px;
    text-align: center;
    font-size: 16px;
}
</style>
