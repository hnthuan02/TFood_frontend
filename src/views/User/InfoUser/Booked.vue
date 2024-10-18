<template>
    <div class="booking-history">
        <h1 class="section-title">Lịch sử Đặt Bàn</h1>
        <div v-for="(booking, index) in bookings" :key="index" class="booking-card">
            <div class="customer-info">
                <p><strong>Tên khách hàng:</strong> {{ booking.USER_NAME }}</p>
                <p><strong>Số điện thoại:</strong> {{ booking.PHONE_NUMBER }}</p>
                <p><strong>Trạng thái:</strong> <span :class="getStatusClass(booking.STATUS)">{{ booking.STATUS
                        }}</span></p>
            </div>
            <div class="hotel-info" v-for="(table, tableIndex) in booking.LIST_TABLES" :key="tableIndex">
                <h3>{{ table.TABLE_ID.TABLE_NUMBER }}</h3>
                <div class="table-details">
                    <img :src="table.TABLE_ID.IMAGES[0]" alt="Hình ảnh bàn" class="table-image" />
                    <div class="table-info">
                        <p><strong>Thời gian đặt:</strong> {{ table.BOOKING_TIME }}</p>
                        <p><strong>Sức chứa:</strong> {{ table.TABLE_ID.CAPACITY }} người</p>
                    </div>
                </div>
            </div>
            <div class="total-price">
                <strong>Tổng giá:</strong> {{ formatPrice(booking.TOTAL_PRICE) }}
            </div>
        </div>
    </div>
</template>

<script>
import axiosClient from '../../../api/axiosClient';

export default {
    data() {
        return {
            bookings: [],
        };
    },
    async created() {
        await this.fetchBookingHistory();
    },
    methods: {
        async fetchBookingHistory() {
            try {
                const response = await axiosClient.get('http://localhost:3001/booking/getBookingsByUserId');
                this.bookings = response.data.data;
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử đặt bàn:', error);
            }
        },
        getStatusClass(status) {
            return status === 'Booked' ? 'status-confirmed' : 'status-pending';
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        }
    }
};
</script>


<style scoped>
.booking-history {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
    color: #34495E;
}

.section-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #34495E;
}

.booking-card {
    background-color: #f8f9fa;
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.customer-info p,
.hotel-info h3 {
    margin: 5px 0;
    font-size: 18px;
}

.table-details {
    display: flex;
    align-items: center;
    margin-top: 15px;
}

.table-image {
    width: 150px;
    height: auto;
    border-radius: 8px;
    margin-right: 20px;
    object-fit: cover;
}

.table-info p {
    margin: 5px 0;
    font-size: 16px;
}

.total-price {
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    color: #34495E;
    margin-top: 15px;
}

.status-confirmed {
    color: #27ae60;
    font-weight: bold;
}

.status-pending {
    color: #007eeb;
    font-weight: bold;
}

h3 {
    color: #34495E;
}

p {
    color: #34495E;
}
</style>