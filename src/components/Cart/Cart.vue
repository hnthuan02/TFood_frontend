<template>
    <div class="cart-container">
        <h1>Giỏ Hàng Của Bạn</h1>

        <div v-if="cart">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Bàn</th>
                        <th>Thời gian đặt</th>
                        <th>Món ăn</th>
                        <th>Giá món ăn</th>
                        <th>Dịch vụ</th>
                        <th>Tổng Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="table in cart.LIST_TABLES" :key="table.TABLE_ID">
                        <td>{{ table.tableInfo.TABLE_NUMBER }}</td>
                        <td>{{ table.BOOKING_TIME }}</td>
                        <td>
                            <ul>
                                <li v-for="food in table.LIST_FOOD" :key="food.FOOD_ID">
                                    {{ food.foodPrice.NAME }} ({{ formatPrice(food.foodPrice.PRICE) }}) x {{
                                        food.QUANTITY }}
                                </li>
                            </ul>
                        </td>
                        <td>{{ formatPrice(table.TOTAL_PRICE_FOOD) }}</td>
                        <td>
                            <ul>
                                <li v-for="service in table.SERVICES" :key="service.serviceName">
                                    {{ service.serviceName }} - {{ formatPrice(service.servicePrice) }}
                                </li>
                            </ul>
                        </td>
                        <td>{{ formatPrice(table.TOTAL_PRICE_FOOD + table.TOTAL_SERVICE_PRICE + table.tableInfo.PRICE)
                            }}</td>
                        <td>
                            <button @click="openSelectFoodModal(table)">Chọn món</button>
                            <button @click="removeTable(table.TABLE_ID)">Xóa</button>
                        </td>
                    </tr>
                </tbody>

            </table>
            <!-- Phần chứa Cần cọc và Tổng cộng -->
            <div class="price-info">
                <h3 class="deposit">Cần cọc: {{ (cart.TOTAL_PRICES * 0.4).toFixed(0) }} VND</h3>
                <h3 class="total-price">Tổng cộng: {{ cart.TOTAL_PRICES }} VND</h3>
            </div>
        </div>
        <div v-else>
            <p>Giỏ hàng của bạn trống.</p>
        </div>
    </div>
    <SelectFoodModal v-if="showSelectFoodModal" :tableInfo="selectedTable" @close="closeSelectFoodModal"
        @update-cart="updateCart" />
</template>


<script>
import axiosClient from '../../api/axiosClient';
import SelectFoodModal from './SelectFoodModal.vue';

export default {
    components: {
        SelectFoodModal,
    },
    data() {
        return {
            cart: null,
            showSelectFoodModal: false,
            selectedTable: null, // Chứa dữ liệu giỏ hàng
        };
    },
    async created() {
        // Lấy thông tin giỏ hàng khi component được tạo
        await this.fetchCart();
    },
    methods: {
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        openSelectFoodModal(table) {
            this.selectedTable = table;
            this.showSelectFoodModal = true;
        },
        closeSelectFoodModal() {
            this.showSelectFoodModal = false;
            this.selectedTable = null;
        },
        async updateCart() {
            await this.fetchCart();
        },
        async fetchCart() {
            try {
                const response = await axiosClient.get('/carts/getCartById', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử bạn lưu token trong localStorage
                    },
                });
                this.cart = response.data.data; // Lưu dữ liệu giỏ hàng vào biến cart
            } catch (error) {
                console.error('Lỗi khi lấy giỏ hàng:', error);
            }
        },
        async removeTable(tableId) {
            try {
                await axios.post(
                    'http://localhost:3000/api/removeTableFromCart',
                    { tableId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                await this.fetchCart(); // Tải lại giỏ hàng sau khi xóa bàn
            } catch (error) {
                console.error('Lỗi khi xóa bàn khỏi giỏ hàng:', error);
            }
        },
    },
};
</script>

<style scoped>
.cart-container {
    max-width: 1200px;
    margin: 20px auto;
    background: #3C2F2F;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #FAE8B2;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    font-family: 'Playfair Display', serif;
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
}

.cart-table th,
.cart-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
}

.price-info {
    background-color: #7d0f03;
    display: flex;
    /* Sử dụng flex để căn hai phần ngang hàng */
    justify-content: space-between;
    /* Căn hai phần ra hai phía */
    align-items: center;
    /* Căn giữa theo chiều dọc */
    margin-top: 20px;
}

.deposit {
    text-align: left;
    /* Căn chữ về bên trái */
    font-family: 'Playfair Display', serif;
    margin: 0;
    /* Xóa margin mặc định */
}

.total-price {
    text-align: right;
    /* Căn chữ về bên phải */
    font-family: 'Playfair Display', serif;
    margin: 0;
    /* Xóa margin mặc định */
}

button {
    background-color: #c0392b;
    border: none;
    padding: 8px 12px;
    color: #FAE8B2;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #a93226;
}
</style>
