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
                                    {{ food.foodPrice.NAME }} ({{ food.foodPrice.PRICE }} VND) x {{ food.QUANTITY }}
                                </li>
                            </ul>
                        </td>
                        <td>{{ table.TOTAL_PRICE_FOOD }} VND</td>
                        <td>
                            <ul>
                                <li v-for="service in table.SERVICES" :key="service.serviceName">
                                    {{ service.serviceName }} - {{ service.servicePrice }} VND
                                </li>
                            </ul>
                        </td>
                        <td>{{ calculateTotalPrice(table) }} VND</td>
                        <td class="action-buttons">
                            <button @click="addFood(table)" class="action-button">Thêm món ăn</button>
                            <button @click="editFood(table)" class="action-button">Chỉnh sửa món ăn</button>
                            <button @click="removeTable(table.TABLE_ID)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="price-info">
                <h3 class="deposit">Cần cọc: {{ calculateDeposit(cart.TOTAL_PRICES) }} VND</h3>
                <h3 class="total-price">Tổng cộng: {{ cart.TOTAL_PRICES }} VND</h3>
            </div>
        </div>
        <div v-else>
            <p>Giỏ hàng của bạn trống.</p>
        </div>
        <SelectFoodModal v-if="selectedTable" :tableInfo="selectedTable" :modalMode="modalMode" @close="closeModal"
            @update-cart="fetchCart" />
    </div>
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
            cart: null, // Chứa dữ liệu giỏ hàng
            selectedTable: null, // Bàn đang được chọn để chỉnh sửa món ăn
            modalMode: '', // Chế độ của modal: 'edit' hoặc 'add'
        };
    },
    async created() {
        await this.fetchCart();
    },
    methods: {
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
                // Gửi yêu cầu xóa bàn tới backend
                await axiosClient.post('/carts/removeTableFromCart', { tableId }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // Tải lại giỏ hàng sau khi xóa thành công
                await this.fetchCart();
                alert('Đã xóa bàn khỏi giỏ hàng.');
            } catch (error) {
                console.error('Lỗi khi xóa bàn khỏi giỏ hàng:', error);
                alert('Xóa bàn khỏi giỏ hàng thất bại. Vui lòng thử lại.');
            }
        },

        calculateTotalPrice(table) {
            return table.TOTAL_PRICE_FOOD + table.TOTAL_SERVICE_PRICE + table.tableInfo.PRICE;
        },
        calculateDeposit(totalPrice) {
            return (totalPrice * 0.4).toFixed(0);
        },
        editFood(table) {
            this.selectedTable = table;
            this.modalMode = 'edit'; // Chế độ chỉnh sửa món ăn
        },
        addFood(table) {
            this.selectedTable = table;
            this.modalMode = 'add'; // Chế độ thêm món ăn
        },
        closeModal() {
            this.selectedTable = null;
            this.modalMode = '';
        },
    },
};
</script>

<style scoped>
.cart-container {
    max-width: 1200px;
    margin: 20px auto;
    background: #ffffff;
    /* Đổi nền trắng */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Giảm độ đậm của bóng */
    color: #333333;
    /* Màu chữ tối */
    font-family: 'Playfair Display', serif;
    /* Đổi font cho đồng bộ */
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    /* Tăng kích thước chữ */
    color: #333333;
    /* Màu chữ tối */
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #ffffff;
    /* Nền trắng cho bảng */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-table th,
.cart-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    font-family: 'Roboto', sans-serif;
    /* Font hiện đại và dễ nhìn */
    text-align: center;
    /* Căn giữa */
}

.cart-table th {
    background-color: #f4f4f4;
    /* Nền xám nhạt */
    font-weight: 600;
    color: #333333;
    /* Màu chữ tối */
}

.cart-table td {
    background-color: #ffffff;
    /* Nền trắng */
}

.price-info {
    background-color: #f4f4f4;
    /* Đổi nền xám nhạt */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 8px;
}

.deposit,
.total-price {
    font-family: 'Playfair Display', serif;
    /* Đồng bộ font */
    color: #333333;
    /* Màu chữ tối */
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* Khoảng cách giữa các nút */
}

.action-button {
    background-color: #333333;
    /* Nền đen */
    border: none;
    padding: 8px 12px;
    color: #ffffff;
    /* Màu chữ trắng */
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    /* Font hiện đại */
    transition: background-color 0.3s;
}

.action-button:hover {
    background-color: #444444;
    /* Màu nền khi hover */
}

.delete-button {
    background-color: #e74c3c;
    /* Màu đỏ cho nút xóa */
}

.delete-button:hover {
    background-color: #c0392b;
    /* Màu đậm hơn khi hover */
}

.cart-table ul {
    padding: 0;
    list-style-type: none;
    /* Xóa dấu chấm trong danh sách */
    margin: 0;
}

.cart-table li {
    padding: 5px 0;
    /* Tạo khoảng cách giữa các món */
}
</style>
