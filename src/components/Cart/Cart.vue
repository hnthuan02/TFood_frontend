<template>
    <div class="cart-container">
        <h1>Giỏ Hàng Của Bạn</h1>
        <div v-if="cart">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Chọn</th>
                        <th>Bàn</th>
                        <th>Thời gian đặt</th>
                        <th>Món ăn</th>
                        <th>Dịch vụ</th>
                        <th>Tổng Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="table in cart.LIST_TABLES" :key="table.TABLE_ID">
                        <td>
                            <input type="checkbox" :value="table.TABLE_ID" v-model="selectedTables" />
                        </td>
                        <td>
                            {{ table.tableInfo.TABLE_NUMBER }}<br />
                            ({{ translateType(table.tableInfo.TYPE) }})
                        </td>
                        <td>{{ table.BOOKING_TIME }}</td>
                        <td>
                            <ul>
                                <li v-for="food in table.LIST_FOOD" :key="food.FOOD_ID">
                                    {{ food.foodPrice.NAME }} ({{ food.foodPrice.PRICE }} VND) x {{ food.QUANTITY }}
                                </li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li v-for="service in table.SERVICES" :key="service.SERVICES_ID">
                                    {{ service.serviceName }} - {{ service.servicePrice }} VND
                                </li>
                            </ul>
                        </td>
                        <td>{{ calculateTotalPrice(table) }} VND</td>
                        <td class="action-buttons">
                            <button @click="addFood(table)" class="action-button">Thêm món ăn</button>
                            <button @click="editFood(table)" class="action-button">Chỉnh sửa món ăn</button>
                            <button @click="selectServices(table)" class="action-button">Chọn dịch vụ</button>
                            <button @click="removeTable(table)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="price-info">
                <h3 class="total-price">Tổng cộng: {{ cart.TOTAL_PRICES }} VND</h3>
                <button @click="goToPayment" class="payment">Đặt ngay</button>
            </div>
        </div>
        <div v-else>
            <p>Giỏ hàng của bạn trống.</p>
        </div>
        <SelectFoodModal v-if="selectedTable" :tableInfo="selectedTable" :modalMode="modalMode" @close="closeModal"
            @update-cart="fetchCart" />
        <SelectServiceModal v-if="selectedServiceTable" :tableInfo="selectedServiceTable" @close="closeServiceModal"
            @update-cart="fetchCart" />
    </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';
import SelectFoodModal from './SelectFoodModal.vue';
import SelectServiceModal from './SelectServiceModal.vue'; // Import SelectServiceModal

export default {
    components: {
        SelectFoodModal,
        SelectServiceModal, // Register SelectServiceModal
    },
    data() {
        return {
            cart: null,
            selectedTable: null,
            selectedServiceTable: null, // Bàn cho dịch vụ
            modalMode: '',
            selectedTables: [],
        };
    },
    async created() {
        await this.fetchCart();
    },
    methods: {
        translateType(type) {
            switch (type) {
                case "Normal":
                    return "Bàn thường";
                case "Room":
                    return "Phòng riêng";
                default:
                    return type;
            }
        },
        async fetchCart() {
            try {
                const response = await axiosClient.get('/carts/getCartById', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.cart = response.data.data;
            } catch (error) {
                console.error('Lỗi khi lấy giỏ hàng:', error);
            }
        },
        async removeTable(table) {
            try {
                const payload = {
                    tableId: table.TABLE_ID,
                    bookingTime: table.BOOKING_TIME,
                };
                await axiosClient.post('/carts/removeTableFromCart', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                await this.fetchCart();
                alert('Đã xóa bàn khỏi giỏ hàng.');
            } catch (error) {
                console.error('Lỗi khi xóa bàn khỏi giỏ hàng:', error);
                alert('Xóa bàn khỏi giỏ hàng thất bại.');
            }
        },
        calculateTotalPrice(table) {
            return table.TOTAL_PRICE_FOOD + table.TOTAL_SERVICE_PRICE;
        },
        editFood(table) {
            this.selectedTable = table;
            this.modalMode = 'edit';
        },
        addFood(table) {
            this.selectedTable = table;
            this.modalMode = 'add';
        },
        selectServices(table) {
            this.selectedServiceTable = table; // Lưu bàn được chọn
        },
        closeModal() {
            this.selectedTable = null;
            this.modalMode = '';
        },
        closeServiceModal() {
            this.selectedServiceTable = null; // Đóng modal chọn dịch vụ
        },
        goToPayment() {
            if (this.selectedTables.length === 0) {
                alert('Vui lòng chọn ít nhất một bàn để thanh toán');
                return;
            }
            // Lưu danh sách bàn được chọn vào localStorage
            localStorage.setItem('selectedTables', JSON.stringify(this.selectedTables));
            // Chuyển hướng đến trang thanh toán
            this.$router.push('/payment').then(() => {
                // Reload lại trang sau khi chuyển hướng
                window.location.reload();
            });
        },
    },
};
</script>




<style scoped>
.cart-container {
    max-width: 1400px;
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

.payment {
    display: inline-block;
    background-color: #2c3e50;
    color: #ffffff;
    text-align: center;
    padding: 12px 30px;
    font-size: 18px;
    font-family: 'Playfair Display', serif;
    text-transform: uppercase;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s, transform 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.payment:hover {
    background-color: #34495e;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.payment:active {
    background-color: #1c2e40;
    transform: translateY(0);
}
</style>
