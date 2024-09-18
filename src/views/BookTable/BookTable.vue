<template>
    <div class="booking-container">
        <h1>Đặt Bàn</h1>
        <!-- Phần Reservation -->
        <div class="reservation-form">
            <div class="form-group">
                <label for="reservation-date">Chọn ngày:</label>
                <input type="date" id="reservation-date" v-model="selectedDate" class="form-control" />
            </div>
            <div class="form-group">
                <label for="reservation-time">Chọn giờ:</label>
                <input type="time" id="reservation-time" v-model="selectedTime" class="form-control" />
            </div>
            <div class="form-group">
                <label for="people-count">Số người:</label>
                <input type="number" id="people-count" v-model="peopleCount" min="1" max="8" class="form-control" />
            </div>
            <button @click="fetchAvailableTables" class="reservation-button">Tìm Bàn</button>
            <!-- Nút Hiển thị tất cả các bàn có sẵn -->
            <!-- <button @click="fetchAllTables" class="reservation-button all-tables-button">Hiển thị tất cả các bàn có
                sẵn</button> -->
        </div>

        <!-- Bảng hiển thị kết quả -->
        <table v-if="tables.length" class="table">
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Bàn có sẵn</th>
                    <th>Số người</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="table in tables" :key="table._id">
                    <td><img :src="table.IMAGES[0]" alt="Table" class="table-image" /></td>
                    <td>{{ table.TYPE }}</td>
                    <td>{{ table.PRICE }} VND</td>
                    <td>{{ table.COUNT }}</td>
                    <td>{{ table.CAPACITY }}</td>
                    <td class="action-cell">
                        <button @click="addToCart(table)" class="cart-button">
                            <font-awesome-icon :icon="['fas', 'cart-shopping']" style="color: #a3004f;" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-else>Không có bàn nào có sẵn trong ngày và số người đã chọn.</p>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axiosClient from "../../api/axiosClient";

export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            selectedDate: '',
            selectedTime: '', // Thêm phần chọn giờ
            peopleCount: 1,
            tables: []
        };
    },
    methods: {
        async fetchAvailableTables() {
            if (!this.selectedDate || !this.peopleCount) {
                alert('Vui lòng chọn ngày, giờ và số lượng người!');
                return;
            }
            try {
                const response = await axiosClient.get(`tables/allTable`, {
                    params: {
                        date: this.selectedDate,
                        people: this.peopleCount
                    }
                });
                this.tables = response.data.data;
            } catch (error) {
                console.error('Error fetching available tables:', error);
            }
        },
        async fetchAllTables() {
            try {
                const response = await axiosClient.get(`tables/allTableWithoutDate`); // Sử dụng API mới
                this.tables = response.data.data;
            } catch (error) {
                console.error('Error fetching all tables:', error);
            }
        },
        addToCart(table) {
            alert(`Đã thêm ${table.TYPE} vào giỏ hàng!`);
        }
    }

};
</script>

<style scoped>
.booking-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 30px;
    background-color: #2b1b17;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
    color: #ffd700;
}

h1 {
    margin-bottom: 20px;
    font-size: 35px;
    color: #ffd700;
    font-family: 'Playfair Display', serif;
    font-weight: bold;
}

.reservation-form {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 30px;
    background-color: #3c2f2f;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.form-group {
    display: flex;
    flex-direction: column;
    flex: 1 1 30%;
    min-width: 180px;
    color: #ffd700;
}

.form-control {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 5px;
    background-color: #fff5ee;
    color: #2b1b17;
    font-family: 'Playfair Display', serif;
}

.reservation-button {
    padding: 14px 24px;
    background-color: #c0392b;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'Playfair Display', serif;
    font-weight: bold;
    margin-top: 10px;
}

.all-tables-button {
    background-color: #8b0000;
}

.reservation-button:hover {
    background-color: #a93226;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #3c2f2f;
    border-radius: 10px;
    overflow: hidden;
}

th,
td {
    padding: 14px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #444;
    color: #ffd700;
    font-family: 'Playfair Display', serif;
}

td {
    background-color: #362521;
    font-size: 20px;
    font-weight: bold;
    font-family: 'Playfair Display', serif;
}

th {
    background-color: #5b2c2c;
    font-weight: bold;
    font-size: 25px;
}

tr:hover {
    background-color: #5b2c2c;
}

.table-image {
    width: 320px;
    height: 160px;
    border-radius: 8px;
    object-fit: cover;
}

.action-cell {
    height: 100%;
    padding: 0;
}

.cart-button {
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease;
    color: #ffd700;
}

.cart-button:hover {
    color: #ff4081;
}
</style>
