<template>
    <div class="booking-container">
        <h1 class="reservation-title">
            <span class="make-text">ĐẶT BÀN</span>
        </h1>
        <p class="reservation-subtitle">
            Trải nghiệm ẩm thực đỉnh cao trong không gian đẳng cấp, <br />
            nơi tinh hoa và phong cách hội tụ dành cho bạn.
        </p>
        <!-- Phần Reservation -->
        <div class="reservation-form">
            <div class="form-group">
                <div class="icon-container">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <input type="date" v-model="selectedDate" class="form-control" :min="minDate" />
            </div>
            <div class="form-group">
                <div class="icon-container">
                    <i class="fas fa-clock"></i>
                </div>
                <input type="time" v-model="selectedTime" class="form-control" step="300" min="10:00" max="23:00"
                    @input="validateTime" required />
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
                        <th>Bàn có sẵn</th>
                        <th>Số người</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(group, index) in translatedTables" :key="index">
                        <td><img :src="group.tables[0].IMAGES[0]" alt="Table" class="table-image" /></td>
                        <td>{{ group.type }}</td>
                        <td>
                            <div class="available-tables">
                                <span v-for="table in group.tables" :key="table._id" class="table-tag"
                                    @click="showTimePickerPopup(table)">
                                    {{ table.TABLE_NUMBER }}
                                </span>
                            </div>
                        </td>
                        <td>{{ group.capacity }}</td>
                        <td class="action-cell">
                            <button @click="addToCart(group.tables[0])" class="cart-button">
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
                <div class="popup-left">
                    <h3>Thông tin đặt bàn {{ selectedTable.translatedType }} {{ selectedTable.TABLE_NUMBER }}</h3>
                    <img :src="selectedTable.IMAGES[0]" alt="Table Image" class="popup-table-image" />

                    <button class="confirm-button" @click="addTableToCart">Xác nhận</button>
                    <button class="close-button" @click="closePopup">Đóng</button>
                </div>

                <div class="popup-right">
                    <!-- Thêm dịch vụ -->
                    <div class="service-section">
                        <h4>Chọn dịch vụ</h4>
                        <div class="services-list">
                            <div v-for="service in availableServices" :key="service._id" class="service-item">
                                <div class="checkbox-wrapper-31">
                                    <input type="checkbox" :id="`service-${service._id}`" :value="service"
                                        v-model="selectedServices" />
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                    </svg>
                                </div>
                                <label :for="`service-${service._id}`">
                                    {{ service.serviceName }} - {{ service.servicePrice }} VND
                                </label>
                            </div>
                        </div>
                    </div>
                    <!-- Hiển thị các món ăn đã chọn -->
                    <div class="selected-food-section">
                        <h4>Món ăn đã chọn</h4>
                        <div v-if="selectedFoodItems.length === 0">
                            <p>Chưa có món ăn nào được chọn.</p>
                        </div>
                        <div v-else>
                            <div v-for="food in selectedFoodItems" :key="food._id" class="food-item d-flex">
                                <h5 class="px-1">{{ food.name }} -</h5> <!-- Hiển thị tên món ăn -->
                                <p> Số lượng: {{ food.quantity }}</p> <!-- Hiển thị số lượng -->
                            </div>
                        </div>
                        <button class="add-food-button" @click="addFood">Chọn thực đơn</button> <!-- Nút chọn món ăn -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Popup chọn món ăn -->
        <div v-if="showFoodPopup" class="food-popup">
            <div class="food-popup-content">
                <h3>Chọn món ăn</h3>
                <div class="food-list">
                    <div v-for="food in foodItems" :key="food._id" class="food-item">
                        <img :src="food.IMAGES[0]" :alt="food.NAME" />
                        <div class="food-info">
                            <h4>{{ food.NAME }}</h4>
                            <p>{{ formatPrice(food.PRICE) }}</p>
                            <div class="quantity-selector">
                                <button @click="decreaseQuantity(food._id)">-</button>
                                <span>{{ quantities[food._id] || 0 }}</span>
                                <button @click="increaseQuantity(food._id)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="confirmFoodSelection" class="confirm-button">Xác nhận</button>
                <button @click="closeFoodPopup" class="close-button">Đóng</button>
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
            minDate: '',
            selectedTime: "",
            peopleCount: 1,
            tables: [],
            showPopup: false, // Trạng thái hiển thị popup chọn giờ
            selectedTable: null, // Bàn đang được chọn
            cartItems: [], // Giỏ hàng
            availableServices: [], // Danh sách dịch vụ có sẵn
            selectedServices: [], // Dịch vụ được chọn
            showFoodPopup: false, // Trạng thái hiển thị popup món ăn
            foodItems: [], // Danh sách các món ăn
            selectedFoodItems: [],
            quantities: {}, // Danh sách món ăn đã chọn
        };
    },
    mounted() {
        const today = new Date(); // Lấy ngày hiện tại
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = today.getFullYear();

        this.minDate = `${year}-${month}-${day}`; // Định dạng ngày để sử dụng cho min
        this.selectedDate = this.minDate; // Thiết lập ngày chọn mặc định là hôm nay
    },
    computed: {
        // Chuyển đổi giá trị TYPE thành tiếng Việt
        translatedTables() {
            const groupedTables = {};

            this.tables.forEach((table) => {
                const key = `${table.CAPACITY}-${table.TYPE}`;

                if (!groupedTables[key]) {
                    groupedTables[key] = {
                        capacity: table.CAPACITY,
                        type: this.translateType(table.TYPE),
                        tables: [],
                    };
                }
                groupedTables[key].tables.push(table);
            });

            return Object.values(groupedTables);
        },
    },
    methods: {
        validateTime() {
            const minTime = "10:00";
            const maxTime = "23:00";

            if (this.selectedTime < minTime) {
                this.selectedTime = minTime;
            } else if (this.selectedTime > maxTime) {
                this.selectedTime = maxTime;
            }
        },
        increaseQuantity(foodId) {
            this.quantities[foodId] = (this.quantities[foodId] || 0) + 1; // Tăng số lượng
        },
        decreaseQuantity(foodId) {
            if (this.quantities[foodId] > 0) {
                this.quantities[foodId] -= 1; // Giảm số lượng
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },

        async loadFoodItems() {
            try {
                const response = await axiosClient.get("foods/allFood"); // API lấy danh sách món ăn
                this.foodItems = response.data; // Lưu kết quả trả về vào foodItems
            } catch (error) {
                console.error("Lỗi khi lấy danh sách món ăn:", error);
            }
        },
        closeFoodPopup() {
            this.showFoodPopup = false; // Ẩn pop-up món ăn
        },
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
        async fetchAvailableTables() {
            if (!this.selectedDate || !this.selectedTime || !this.peopleCount) {
                this.$message.error("Vui lòng chọn ngày, giờ và số lượng người!");
                return;
            }

            const bookingTime = `${this.selectedDate}T${this.selectedTime}`;

            try {
                const response = await axiosClient.get(`tables/allTable`, {
                    params: {
                        date: this.selectedDate,
                        people: this.peopleCount,
                        bookingTime: this.selectedTime,
                    },
                });
                this.tables = response.data.data;
            } catch (error) {
                console.error("Error fetching available tables:", error);
            }
        },
        showTimePickerPopup(table) {
            this.selectedTable = table;
            this.showPopup = true;
            this.loadAvailableServices(); // Tải dịch vụ có sẵn
        },
        async loadAvailableServices() {
            try {
                const response = await axiosClient.get('/serviceTables/services', {
                    params: {
                        type: this.selectedTable.TYPE
                    },
                }); // API lấy danh sách dịch vụ
                this.availableServices = response.data.data; // Giả sử response trả về mảng dịch vụ
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            }
        },
        addFood() {
            this.showFoodPopup = true; // Hiển thị pop-up chọn món ăn
            this.loadFoodItems(); // Tải danh sách món ăn
        },
        confirmFoodSelection() {
            // Xử lý xác nhận món ăn đã chọn và số lượng
            this.selectedFoodItems = Object.entries(this.quantities)
                .filter(([foodId, quantity]) => quantity > 0)
                .map(([foodId, quantity]) => {
                    const foodItem = this.foodItems.find(food => food._id === foodId); // Tìm món ăn trong foodItems
                    return {
                        _id: foodItem._id,
                        name: foodItem.NAME, // Lưu tên món ăn
                        quantity: quantity
                    };
                });

            console.log("Món ăn đã chọn:", this.selectedFoodItems); // Xem kết quả món ăn đã chọn
            this.closeFoodPopup(); // Đóng popup chọn món ăn
        },

        async addTableToCart() {
            if (!this.selectedTime || !this.selectedDate) {
                this.$message.error("Vui lòng chọn ngày và giờ!");
                return;
            }

            let bookingTime = `${this.selectedDate}T${this.selectedTime}`.replace("T", " ");
            try {
                const payload = {
                    tableId: this.selectedTable._id,
                    bookingTime: bookingTime,
                    services: this.selectedServices.map(service => ({ _id: service._id })),
                    listFood: this.selectedFoodItems.map(food => ({ FOOD_ID: food._id, QUANTITY: food.quantity })), // Thêm thông tin món ăn
                };
                const response = await axiosClient.post("/carts/createCart", payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.success) {
                    this.cartItems.push({
                        table: this.selectedTable,
                        tableNumber: this.selectedTable.TABLE_NUMBER,
                        bookingTime: bookingTime,
                    });
                    this.$message.success(`Đã thêm bàn số ${this.selectedTable.TABLE_NUMBER} vào giỏ hàng!`);
                    this.closePopup();
                } else {
                    this.$message.error("Thêm bàn vào giỏ hàng thất bại!");
                }
            } catch (error) {
                console.error("Lỗi khi thêm bàn vào giỏ hàng:", error);
                this.$message.error("Thêm bàn vào giỏ hàng thất bại!");
            }
        },
        closePopup() {
            this.showPopup = false;
            this.selectedTable = null;
            this.selectedServices = []; // Reset dịch vụ đã chọn
            this.selectedFoodItems = []; // Reset món ăn đã chọn
        },
        addToCart(table) {
            this.showTimePickerPopup(table);
        },
    },
};
</script>

<style scoped>
p,
h5 {
    margin: 0;
    padding: 0;
}

.available-tables {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.table-tag {
    background-color: #2c3e50;
    color: #fff;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.table-tag:hover {
    background-color: #34495e;
}

.booking-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 30px;
    background-image: url('https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?cs=srgb&dl=pexels-pixabay-260922.jpg&fm=jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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
    color: #F8F3CE;
    font-size: 40px;
    font-family: "Playfair Display", serif;
}

.reservation-subtitle {
    font-family: "Playfair Display", serif;
    color: #c9e732;
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
    margin-bottom: 20px;
}

.form-control {
    padding: 12px 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    width: 250px;
    text-align: center;
    color: #333;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease, border 0.3s ease;
}

.form-control:focus {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-color: #d4af37;
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
    background-color: #F8F3CE;
    color: #000000;
    font-size: 16px;
    font-weight: bold;
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
    color: #f8f9fa;
    transform: translateY(-2px);
}

.table-container {
    margin-top: 50px;
    background-color: #34495E;
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
    color: #ffffff;
    margin-top: 30px;
}

/* Popup chọn giờ */
.time-popup {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8f9fa;
    color: #2c3e50;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: 700px;
}

.popup-content {
    display: flex;
    width: 100%;
}

.popup-left {
    flex: 1;
    padding-right: 20px;
}

.popup-right {
    flex: 1;
    text-align: left;
}

.popup-table-image {
    width: 300px;
    height: 300px;
    border-radius: 8px;
    margin-top: 10px;
}

.popup-content h3 {
    font-family: "Playfair Display", serif;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #2c3e50;
}

.popup-content .form-control {
    padding: 12px 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
    text-align: center;
    color: #333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.popup-content .form-control:focus {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    outline: none;
}

.confirm-button,
.close-button {
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

.confirm-button:hover,
.close-button:hover {
    background-color: #34495e;
    transform: translateY(-2px);
}

.close-button {
    background-color: #e74c3c;
}

.close-button:hover {
    background-color: #c0392b;
}



.menu-section,
.service-section {
    margin-top: 20px;
}

.add-button {
    background-color: #2c3e50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.add-button:hover {
    background-color: #34495e;
}

.food-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.food-popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
}

.add-food-button {
    background-color: #2c3e50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-size: 16px;
    text-transform: uppercase;
    margin-top: 20px;
}

.add-food-button:hover {
    background-color: #34495e;
}

.food-list {
    display: flex;
    flex-direction: column;
    /* Hiển thị các món ăn theo hàng dọc */
    gap: 10px;
    /* Khoảng cách giữa các món ăn */
}

.food-item {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    text-align: left;
}

.food-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 10px;
}

.food-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.food-info h4 {
    margin: 0;
}

.quantity-selector {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.quantity-selector button {
    width: 30px;
    height: 30px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s ease;
}

.quantity-selector button:hover {
    background-color: #34495e;
}

.quantity-selector span {
    margin: 0 10px;
    font-size: 18px;
    width: 30px;
    text-align: center;
}


/* Styles cho checkbox tùy chỉnh */
.checkbox-wrapper-31 {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.checkbox-wrapper-31 input[type="checkbox"] {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    margin: 0;
    opacity: 0;
    /* -webkit-appearance: none; */
}

.checkbox-wrapper-31 .background {
    fill: #ccc;
    transition: ease all 0.6s;
}

.checkbox-wrapper-31 .stroke {
    fill: none;
    stroke: #fff;
    stroke-miterlimit: 10;
    stroke-width: 2px;
    stroke-dashoffset: 100;
    stroke-dasharray: 100;
    transition: ease all 0.6s;
}

.checkbox-wrapper-31 .check {
    fill: none;
    stroke: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
    stroke-dashoffset: 22;
    stroke-dasharray: 22;
    transition: ease all 0.6s;
}

.checkbox-wrapper-31 input[type=checkbox]:hover {
    cursor: pointer;
}

.checkbox-wrapper-31 input[type=checkbox]:checked+svg .background {
    fill: #34495E;
}

.checkbox-wrapper-31 input[type=checkbox]:checked+svg .stroke {
    stroke-dashoffset: 0;
}

.checkbox-wrapper-31 input[type=checkbox]:checked+svg .check {
    stroke-dashoffset: 0;
}
</style>
