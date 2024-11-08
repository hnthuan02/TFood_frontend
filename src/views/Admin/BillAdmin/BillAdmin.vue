<template>
    <div class="booking-invoices">
        <div class="header">
            <h2>Danh sách hóa đơn</h2>

            <!-- Thanh lọc hóa đơn theo ngày đặt, tháng đặt và trạng thái -->
            <div class="filter">
                <label for="filterDate">Lọc theo ngày:</label>
                <input type="date" v-model="filterDate" @change="filterBookings" />

                <label for="filterMonth">Lọc theo tháng:</label>
                <select v-model="filterMonth" @change="filterBookings">
                    <option value="">Tất cả tháng</option>
                    <option v-for="month in 12" :value="month" :key="month">
                        Tháng {{ month }}
                    </option>
                </select>

                <label for="filterStatus">Lọc theo trạng thái:</label>
                <select v-model="filterStatus" @change="filterBookings">
                    <option value="">Tất cả trạng thái</option>
                    <option value="Booked">Đã đặt</option>
                    <option value="Completed">Hoàn thành</option>
                </select>
            </div>
        </div>

        <div v-if="filteredBookings.length === 0" class="no-data">
            <p>Không có hóa đơn nào được tìm thấy.</p>
        </div>

        <div v-else>
            <div v-for="booking in filteredBookings" :key="booking._id" class="invoice-card">
                <!-- Thông tin chính của hóa đơn -->
                <h3>Hóa đơn #{{ booking._id }}</h3>
                <p><strong>Khách hàng:</strong> {{ booking.USER_NAME }} ({{ booking.EMAIL }})</p>
                <p><strong>Số điện thoại:</strong> {{ booking.PHONE_NUMBER }}</p>
                <p><strong>Trạng thái:</strong> {{ getStatusTranslation(booking.STATUS) }}</p>
                <p><strong>Hình thức đặt:</strong> {{ booking.BOOKING_TYPE }}</p>
                <p><strong>Ngày đặt:</strong> {{ formatDate(booking.createdAt) }}</p>

                <!-- Nút mở modal chi tiết -->
                <button @click="openModal(booking)" class="view-details-button">Xem chi tiết</button>
            </div>
        </div>

        <!-- Modal hiển thị chi tiết hóa đơn -->
        <div v-if="selectedBooking" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h4>Chi tiết hóa đơn #{{ selectedBooking._id }}</h4>

                <h4>Danh sách bàn:</h4>
                <div class="ListTable" v-for="table in selectedBooking.LIST_TABLES" :key="table.TABLE_ID">
                    <p><strong>Bàn số:</strong> {{ table.TABLE_ID?.TABLE_NUMBER || table.TABLE_ID }}</p>
                    <p><strong>Thời gian đặt:</strong> {{ table.BOOKING_TIME }}</p>

                    <div v-if="table.SERVICES.length > 0">
                        <h5>Dịch vụ:</h5>
                        <ul>
                            <li v-for="service in table.SERVICES" :key="service.SERVICES_ID">
                                {{ service.SERVICES_ID?.serviceName || service.SERVICES_ID }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="table.LIST_FOOD.length > 0">
                        <h5>Danh sách món ăn:</h5>
                        <ul>
                            <li v-for="food in table.LIST_FOOD" :key="food.FOOD_ID">
                                {{ food.FOOD_ID?.NAME || food.FOOD_ID }} - Số lượng: {{ food.QUANTITY }}
                            </li>
                        </ul>
                    </div>
                </div>

                <p class="Money"><strong>Tổng tiền:</strong> {{ formatCurrency(selectedBooking.TOTAL_PRICE) }}</p>

                <!-- Nút đóng modal -->
                <button @click="closeModal" class="close-button">Đóng</button>
            </div>
        </div>
    </div>
</template>


<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo đúng đường dẫn

export default {
    data() {
        return {
            bookings: [], // Dữ liệu Booking từ API
            selectedBooking: null, // Booking được chọn để hiển thị chi tiết
            filterDate: '', // Ngày cần lọc
            filterMonth: '',
            filterStatus: '',
        };
    },
    mounted() {
        this.fetchBookings(); // Gọi hàm lấy dữ liệu Booking khi component được mount
    },
    computed: {
        filteredBookings() {
            // Lọc booking theo ngày, tháng và trạng thái
            return this.bookings.filter(booking => {
                const bookingDate = this.formatDate(booking.createdAt);
                const bookingMonth = new Date(booking.createdAt).getMonth() + 1;

                const matchesDate = !this.filterDate || bookingDate === this.filterDate;
                const matchesMonth = !this.filterMonth || bookingMonth === Number(this.filterMonth);
                const matchesStatus = !this.filterStatus || booking.STATUS === this.filterStatus;

                return matchesDate && matchesMonth && matchesStatus;
            });
        },
    },
    methods: {
        formatDate(date) {
            const formattedDate = new Date(date);
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Thêm 0 vào trước nếu cần
            const day = String(formattedDate.getDate()).padStart(2, '0'); // Thêm 0 vào trước nếu cần
            return `${year}-${month}-${day}`;
        },
        async fetchBookings() {
            try {
                const response = await axiosClient.get("/booking/allBookings");
                this.bookings = response.data.data; // Gán dữ liệu booking vào biến
            } catch (error) {
                console.error("Lỗi khi lấy danh sách Booking:", error);
            }
        },
        openModal(booking) {
            this.selectedBooking = booking; // Đặt booking đã chọn để mở modal
        },
        closeModal() {
            this.selectedBooking = null; // Đóng modal
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);
        },
        filterBookings() {
            // Hàm này có thể để trống, vì việc lọc đã được thực hiện trong computed property
        },
        getStatusTranslation(status) {
            const translations = {
                "Booked": "Đã đặt",
                "Completed": "Hoàn thành",
            };
            return translations[status] || status;
        },
    },
};

</script>

<style scoped>
.booking-invoices {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    /* Sử dụng Flexbox */
    justify-content: space-between;
    /* Căn giữa không gian giữa tiêu đề và thanh lọc */
    align-items: center;
    /* Căn giữa theo chiều dọc */
    margin-bottom: 20px;
    /* Khoảng cách dưới header */
}

h2 {
    color: #333;
    margin: 0;
    /* Bỏ khoảng cách mặc định */
}

.filter {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter label {
    font-weight: bold;
    color: #333;
}

.filter input[type="date"],
.filter select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;
}

.filter select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;
}

.filter input[type="date"]:focus,
.filter select:focus {
    border-color: #2980b9;
    outline: none;
}

.filter input[type="date"]:focus {
    border-color: #2980b9;
    /* Đổi màu viền khi focus */
    outline: none;
    /* Tắt outline mặc định */
}

.invoice-card {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 20px;
}

.no-data {
    text-align: center;
    font-size: 18px;
    color: #888;
}

h3 {
    margin: 0;
    color: #2980b9;
}

h4 {
    margin-top: 20px;
    color: #8e44ad;
}

h5 {
    margin-top: 10px;
    color: #c0392b;
}

p {
    margin: 5px 0;
}

ul {
    padding-left: 20px;
    list-style-type: disc;
}

.ListTable {
    border-bottom: 2px solid #333;
    padding: 10px 0;
}

.Money {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
}

.view-details-button {
    margin-top: 10px;
    padding: 8px 15px;
    background-color: #2980b9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.view-details-button:hover {
    background-color: #1f6a91;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}

.close-button {
    margin-top: 15px;
    padding: 8px 15px;
    background-color: #c0392b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.close-button:hover {
    background-color: #962d22;
}
</style>
