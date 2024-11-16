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
                            <input type="checkbox" :checked="isTableSelected(table)"
                                @change="toggleTableSelection(table)" />

                        </td>
                        <td>
                            {{ table.tableInfo.TABLE_NUMBER }}<br />
                            ({{ translateType(table.tableInfo.TYPE) }})
                        </td>
                        <td>{{ table.BOOKING_TIME }}

                        </td>
                        <td>
                            <ul>
                                <li v-for="food in table.LIST_FOOD" :key="food.FOOD_ID">
                                    {{ food.foodPrice.NAME }} x {{ food.QUANTITY }}
                                </li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li v-for="service in table.SERVICES" :key="service.SERVICES_ID">
                                    {{ service.serviceName }}
                                </li>
                            </ul>
                        </td>
                        <td>{{ formatPrice(calculateTotalPrice(table)) }}</td>
                        <td class="action-buttons-cart">
                            <button @click="addFood(table)" class="action-button">Thêm món ăn</button>
                            <button @click="editFood(table)" class="action-button">Chỉnh sửa món ăn</button>
                            <button @click="selectServices(table)" class="action-button">Chọn dịch vụ</button>
                            <button @click="openBookingTimeModal(table)" class="action-button">Chọn lại giờ</button>
                            <button @click="removeTable(table)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="price-info">
                <h3 class="total-price">Tổng cộng: {{ formatPrice(cart.TOTAL_PRICES) }} </h3>
                <button @click="goToPayment" class="payment">Đặt ngay</button>
            </div>
        </div>
        <div v-else>
            <p>Giỏ hàng của bạn trống.</p>
        </div>

        <!-- Modal chỉnh sửa Booking Time -->
        <a-modal v-model:open="isBookingTimeModalVisible" title="Chọn Ngày và Giờ" @ok="updateBookingTime"
            @cancel="closeBookingTimeModal">
            <a-date-picker v-model="newBookingTime.date" :disabled-date="disabledDate" placeholder="Chọn ngày"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="onDateChange" />
            <a-time-picker v-model="newBookingTime.time" format="HH:mm" placeholder="Chọn giờ" value-format="HH:mm"
                @change="onTimeChange" />
        </a-modal>

        <!-- Modal chọn món ăn -->
        <SelectFoodModal v-if="selectedFoodTable" :tableInfo="selectedFoodTable" :modalMode="modalMode"
            @close="closeModal" @update-cart="fetchCart" />

        <!-- Modal chọn dịch vụ -->
        <SelectServiceModal v-if="selectedServiceTable" :tableInfo="selectedServiceTable" @close="closeServiceModal"
            @update-cart="fetchCart" />
    </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';
import SelectFoodModal from './SelectFoodModal.vue';
import SelectServiceModal from './SelectServiceModal.vue';

export default {
    components: {
        SelectFoodModal,
        SelectServiceModal,
    },
    data() {
        return {
            cart: null,
            selectedTable: null,
            selectedServiceTable: null,
            selectedFoodTable: null,
            modalMode: '',
            selectedTables: [],
            isBookingTimeModalVisible: false,
            newBookingTime: {
                date: null,
                time: null,
            },
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
                this.$message.error('Lỗi khi lấy giỏ hàng:', error);
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
                this.$message.success('Đã xóa bàn khỏi giỏ hàng.');
            } catch (error) {
                console.error('Lỗi khi xóa bàn khỏi giỏ hàng:', error);
                this.$message.error('Xóa bàn khỏi giỏ hàng thất bại.');
            }
        },
        openBookingTimeModal(table) {
            this.selectedTable = table;
            this.isBookingTimeModalVisible = true;
            this.newBookingTime.date = null;
            this.newBookingTime.time = null;
        },
        closeBookingTimeModal() {
            this.isBookingTimeModalVisible = false;
            this.selectedTable = null;
        },
        onDateChange(value) {
            this.newBookingTime.date = value;
        },
        onTimeChange(value) {
            this.newBookingTime.time = value;
        },
        async updateBookingTime() {
            try {
                if (!this.newBookingTime.date || !this.newBookingTime.time) {
                    this.$message.error('Vui lòng chọn ngày và giờ!');
                    return;
                }

                let selectedDate = this.newBookingTime.date instanceof Date
                    ? this.newBookingTime.date
                    : new Date(this.newBookingTime.date);

                let selectedTime = this.newBookingTime.time instanceof Date
                    ? this.newBookingTime.time
                    : new Date(`1970-01-01T${this.newBookingTime.time}:00`);

                const formattedDate = selectedDate.toISOString().split('T')[0];
                const formattedTime = selectedTime.toTimeString().slice(0, 5);

                const newBookingTime = `${formattedDate} ${formattedTime}`;

                const payload = {
                    tableId: this.selectedTable.TABLE_ID,
                    newBookingTime: newBookingTime,
                };

                await axiosClient.put('/carts/updateBookingTime', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                this.$message.success('Cập nhật thời gian đặt bàn thành công!');
                this.closeBookingTimeModal();
                await this.fetchCart();
            } catch (error) {
                console.error('Lỗi khi cập nhật thời gian đặt bàn:', error);
                this.$message.error('Cập nhật thời gian đặt bàn thất bại!');
            }
        },
        calculateTotalPrice(table) {
            return table.TOTAL_PRICE_FOOD + table.TOTAL_SERVICE_PRICE;
        },
        editFood(table) {
            this.selectedFoodTable = table;
            this.modalMode = 'edit';
        },
        addFood(table) {
            this.selectedFoodTable = table;
            this.modalMode = 'add';
        },
        selectServices(table) {
            this.selectedServiceTable = table;
        },
        closeModal() {
            this.selectedFoodTable = null;
            this.modalMode = '';
        },
        closeServiceModal() {
            this.selectedServiceTable = null;
        },
        goToPayment() {
            if (this.selectedTables.length === 0) {
                this.$message.error('Vui lòng chọn ít nhất một bàn để thanh toán');
                return;
            }
            localStorage.setItem('selectedTables', JSON.stringify(this.selectedTables));
            this.$router.push('/payment').then(() => {
                window.location.reload();
            });
        },
        disabledDate(current) {
            return current && current < new Date();
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        isTableSelected(table) {
            // Kiểm tra xem `tableId` đã tồn tại trong danh sách `selectedTables` hay chưa
            return this.selectedTables.includes(table.TABLE_ID);
        },
        toggleTableSelection(table) {
            const index = this.selectedTables.indexOf(table.TABLE_ID);
            if (index > -1) {
                // Nếu đã chọn, bỏ chọn
                this.selectedTables.splice(index, 1);
            } else {
                // Nếu chưa chọn, thêm vào
                this.selectedTables.push(table.TABLE_ID);
            }
        },
    },
};
</script>

<style scoped>
.cart-container {
    max-width: 1800px;
    margin: 20px auto;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #333333;
    font-family: 'Playfair Display', serif;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333333;
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-table th,
.cart-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    font-family: 'Roboto', sans-serif;
    text-align: center;
}

.cart-table th {
    background-color: #f4f4f4;
    font-weight: 600;
    color: #333333;
}

.cart-table td {
    background-color: #ffffff;
}

.price-info {
    background-color: #f4f4f4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 8px;
}

.total-price {
    font-family: 'Playfair Display', serif;
    color: #333333;
}

.action-buttons-cart {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-button {
    background-color: #333333;
    border: none;
    padding: 8px 12px;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    transition: background-color 0.3s;
}

.action-button:hover {
    background-color: #444444;
}

.delete-button {
    background-color: #e74c3c;
}

.delete-button:hover {
    background-color: #c0392b;
}

.cart-table ul {
    padding: 0;
    list-style-type: none;
    margin: 0;
}

.cart-table li {
    padding: 5px 0;
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
