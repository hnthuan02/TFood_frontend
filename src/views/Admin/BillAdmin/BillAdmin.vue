<template>
    <div class="booking-invoices">
        <h2>Danh sách hóa đơn đặt bàn</h2>
        <div v-if="bookings.length === 0" class="no-data">
            <p>Không có hóa đơn nào được tìm thấy.</p>
        </div>

        <div v-else>
            <div v-for="booking in bookings" :key="booking._id" class="invoice-card">
                <h3>Hóa đơn #{{ booking._id }}</h3>
                <p><strong>Khách hàng:</strong> {{ booking.USER_NAME }} ({{ booking.EMAIL }})</p>
                <p><strong>Số điện thoại:</strong> {{ booking.PHONE_NUMBER }}</p>
                <p><strong>Trạng thái:</strong> {{ booking.STATUS }}</p>
                <p><strong>Hình thức đặt:</strong> {{ booking.BOOKING_TYPE }}</p>

                <h4>Danh sách bàn:</h4>
                <div class="ListTable" v-for="table in booking.LIST_TABLES" :key="table.TABLE_ID">
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

                <p class="Money"><strong>Tổng tiền:</strong> {{ formatCurrency(booking.TOTAL_PRICE) }}</p>

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
        };
    },
    mounted() {
        this.fetchBookings(); // Gọi hàm lấy dữ liệu Booking khi component được mount
    },
    methods: {
        async fetchBookings() {
            try {
                const response = await axiosClient.get("/booking/allBookings");
                this.bookings = response.data.data; // Gán dữ liệu booking vào biến
            } catch (error) {
                console.error("Lỗi khi lấy danh sách Booking:", error);
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);
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

h2 {
    color: #333;
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

hr {
    margin-top: 20px;
    border: none;
    border-top: 1px solid #ddd;
}

.ListTable {
    border-bottom: #333 solid 2px;
}

.Money {
    font-size: 25px;
    font-weight: bold;
}
</style>