<template>
    <div class="booking-container">
        <h1 class="reservation-title">
            <span class="make-text">Make</span> RESERVATION
        </h1>
        <p class="reservation-subtitle">
            Reservation Form Powered by OpenTable <br />
            1.800.456.6743 - contact@grandrestaurant.com
        </p>

        <!-- Phần Reservation -->
        <div class="reservation-form">
            <div class="form-group">
                <div class="icon-container">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <input type="date" v-model="selectedDate" class="form-control" />
            </div>

            <div class="form-group">
                <div class="icon-container">
                    <i class="fas fa-clock"></i>
                </div>
                <input type="time" v-model="selectedTime" class="form-control" />
            </div>

            <div class="form-group">
                <div class="icon-container">
                    <i class="fas fa-user"></i>
                </div>
                <select v-model="peopleCount" class="form-control">
                    <option v-for="n in 8" :key="n" :value="n">{{ n }} người</option>
                </select>
            </div>
        </div>
        <button @click="fetchAvailableTables" class="reservation-button">
            Tìm Bàn
        </button>

        <!-- Bảng hiển thị kết quả -->
        <div v-if="translatedTables.length" class="table-container">
            <table class="table">
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
                    <tr v-for="table in translatedTables" :key="table._id">
                        <td><img :src="table.IMAGES[0]" alt="Table" class="table-image" /></td>
                        <td>{{ table.translatedType }}</td>
                        <td>{{ table.PRICE }} VND</td>
                        <td>{{ table.COUNT }}</td>
                        <td>{{ table.CAPACITY }}</td>
                        <td class="action-cell">
                            <button @click="addToCart(table)" class="cart-button">
                                <font-awesome-icon :icon="['fas', 'cart-shopping']" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="no-table-message">Không có bàn nào có sẵn trong ngày và số người đã chọn.</p>

        <!-- Popup chọn giờ -->
        <div v-if="showPopup" class="time-popup">
            <div class="popup-content">
                <h3>Chọn giờ cho {{ selectedTable.translatedType }}</h3>
                <input type="time" v-model="selectedTime" class="form-control" />
                <button class="confirm-button" @click="addTableToCart">Xác nhận</button>
                <button class="close-button" @click="closePopup">Đóng</button>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axiosClient from "../../api/axiosClient";

export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            selectedDate: "",
            selectedTime: "",
            peopleCount: 1,
            tables: [],
            showPopup: false, // Trạng thái hiển thị popup chọn giờ
            selectedTable: null, // Bàn đang được chọn
            cartItems: [], // Giỏ hàng
        };
    },
    computed: {
        // Chuyển đổi giá trị TYPE thành tiếng Việt
        translatedTables() {
            return this.tables.map((table) => {
                let translatedType = "";
                switch (table.TYPE) {
                    case "Normal":
                        translatedType = "Bàn thường";
                        break;
                    case "Room":
                        translatedType = "Phòng riêng";
                        break;
                    default:
                        translatedType = table.TYPE;
                }
                return {
                    ...table,
                    translatedType: translatedType, // Thêm thuộc tính mới cho table
                };
            });
        },
    },
    methods: {
        async fetchAvailableTables() {
            if (!this.selectedDate || !this.peopleCount) {
                alert("Vui lòng chọn ngày, giờ và số lượng người!");
                return;
            }
            try {
                const response = await axiosClient.get(`tables/allTable`, {
                    params: {
                        date: this.selectedDate,
                        people: this.peopleCount,
                    },
                });
                this.tables = response.data.data;
            } catch (error) {
                console.error("Error fetching available tables:", error);
            }
        },
        showTimePickerPopup(table) {
            this.selectedTable = table;
            this.showPopup = true; // Hiển thị popup khi người dùng bấm nút thêm vào giỏ hàng
        },
        async addTableToCart() {
            if (!this.selectedTime) {
                alert("Vui lòng chọn giờ!");
                return;
            }
            try {
                const payload = {
                    tableId: this.selectedTable._id,
                    bookingTime: this.selectedTime,
                    // Bạn có thể thêm các thông tin khác nếu cần thiết
                };
                const response = await axiosClient.post("/carts/createCart", payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Giả sử bạn lưu token trong localStorage
                    },
                });
                if (response.data.success) {
                    // Thêm bàn vào giỏ hàng
                    this.cartItems.push({
                        table: this.selectedTable,
                        bookingTime: this.selectedTime,
                    });
                    alert(`Đã thêm ${this.selectedTable.translatedType} vào giỏ hàng!`);
                    this.closePopup(); // Đóng popup sau khi thêm vào giỏ hàng
                } else {
                    alert("Thêm bàn vào giỏ hàng thất bại!");
                }
            } catch (error) {
                console.error("Lỗi khi thêm bàn vào giỏ hàng:", error);
                alert("Thêm bàn vào giỏ hàng thất bại!");
            }
        },

        closePopup() {
            this.showPopup = false; // Đóng popup
            this.selectedTable = null;
            this.selectedTime = "";
        },
        addToCart(table) {
            this.showTimePickerPopup(table);
        },
    },
};
</script>

<style scoped>
.booking-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 30px;
    background-color: #f8f9fa;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
    color: #2c3e50;
}

.reservation-title {
    font-family: "Playfair Display", serif;
    font-size: 36px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.make-text {
    color: #d4af37;
    font-size: 40px;
    font-family: "Playfair Display", serif;
}

.reservation-subtitle {
    font-family: "Playfair Display", serif;
    color: #777;
    font-size: 14px;
    margin-bottom: 30px;
}

.reservation-form {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
}

.form-group {
    position: relative;
}

.form-control {
    padding: 12px 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    width: 250px;
    text-align: center;
    color: #333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.form-control:focus {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    outline: none;
}

.icon-container {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #d4af37;
    font-size: 18px;
}

.reservation-button {
    background-color: #2c3e50;
    color: #fff;
    font-size: 16px;
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    margin-top: 20px;
    text-transform: uppercase;
    font-family: "Playfair Display", serif;
}

.reservation-button:hover {
    background-color: #34495e;
    transform: translateY(-2px);
}

.table-container {
    margin-top: 50px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    padding: 14px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #ddd;
    color: #2c3e50;
    font-family: "Playfair Display", serif;
}

td {
    font-size: 18px;
    font-weight: bold;
    background-color: #fafafa;
}

th {
    background-color: #f8f9fa;
    font-weight: bold;
    font-size: 20px;
    color: #2c3e50;
}

tr:hover {
    background-color: #f0f0f0;
}

.table-image {
    width: 120px;
    height: 80px;
    border-radius: 5px;
    object-fit: cover;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
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
    color: #2c3e50;
    font-size: 20px;
}

.cart-button:hover {
    color: #e74c3c;
}

.no-table-message {
    font-family: "Playfair Display", serif;
    font-size: 18px;
    color: #e74c3c;
    margin-top: 30px;
}

/* Popup chọn giờ */
.time-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #3c2f2f;
    color: #FAE8B2;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    width: 300px;
}

.popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.confirm-button {
    background-color: #c0392b;
    color: #FAE8B2;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.confirm-button:hover {
    background-color: #a93226;
}

.close-button {
    background-color: #a93226;
    color: #FAE8B2;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}
</style>