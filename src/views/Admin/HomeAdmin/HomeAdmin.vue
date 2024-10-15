<template>
    <div class="dashboard">
        <div class="content">
            <!-- Thêm các ô màu cho thông tin -->
            <div class="info-cards">
                <div class="info-card revenue">
                    <h3>Doanh thu tháng {{ currentMonth }}</h3>
                    <font-awesome-icon :icon="['fas', 'money-bill']" />
                    <h4>{{ formatCurrency(revenue) }}</h4>
                </div>
                <div class="info-card employees">
                    <h3>Nhân viên</h3>
                    <font-awesome-icon :icon="['fas', 'user-tie']" />
                    <h4>{{ employees }}</h4>
                </div>
                <div class="info-card customers">
                    <h3>Khách hàng</h3>
                    <font-awesome-icon :icon="['fas', 'user-group']" />
                    <h4>{{ customers }}</h4>
                </div>
                <div class="info-card orders">
                    <h3>Đơn đang đặt</h3>
                    <font-awesome-icon :icon="['fas', 'bell-concierge']" />
                    <h4>{{ orders }}</h4>
                </div>
            </div>

            <!-- Hiển thị component nội dung tương ứng -->
            <component :is="currentTabComponent" />
        </div>
    </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient";
export default {
    data() {
        return {
            currentMonth: null,
            activeTab: 'dashboard', // Tab mặc định
            revenue: '', // Ví dụ doanh thu
            employees: 20, // Số lượng nhân viên
            customers: 1200, // Số lượng khách hàng
            orders: 30, // Số đơn đang được đặt
        };
    },
    created() {
        const currentDate = new Date();
        this.currentMonth = currentDate.getMonth() + 1; // Lấy tháng hiện tại
    },
    mounted() {
        this.getRevenue();
    },

    computed: {
        currentTabComponent() {
            switch (this.activeTab) {
                case 'dashboard':
                    return 'DashboardContent';
                case 'menu':
                    return 'MenuContent';
                case 'booking':
                    return 'BookingContent';
                case 'users':
                    return 'UsersContent';
                case 'promotions':
                    return 'PromotionsContent';
                default:
                    return 'DashboardContent';
            }
        },
    },
    methods: {
        async getRevenue() {
            try {
                const response = await axiosClient.get("booking/total-price");
                console.log(response.data);
                this.revenue = response.data.totalPrice;
            } catch (error) {
                console.error("Lỗi khi lấy doanh thu");
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab; // Cập nhật tab đang chọn
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    },
};
</script>

<style scoped>
.dashboard {
    display: flex;
    height: 100vh;
    background-color: #f4f4f4;
}

/* Info cards */
.info-cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

.info-card {
    width: 23%;
    padding: 10px;
    border-radius: 8px;
    color: white;
    text-align: center;
    font-size: 18px;
}

.revenue {
    background-color: #27ae60;
    /* Màu xanh cho doanh thu */
}

.employees {
    background-color: #2980b9;
    /* Màu xanh dương cho nhân viên */
}

.customers {
    background-color: #e67e22;
    /* Màu cam cho khách hàng */
}

.orders {
    background-color: #c0392b;
    /* Màu đỏ cho đơn đang đặt */
}

/* Nội dung chính */
.content {
    flex-grow: 1;
    padding: 30px;
    background-color: #ecf0f1;
    overflow-y: auto;
}
</style>
