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

            <!-- Hiển thị danh sách đơn hàng có STATUS là Booked -->
            <div class="order-list">
                <h3>Danh sách đơn đặt bàn</h3>

                <!-- Thêm thanh tìm kiếm -->
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm theo tên, số điện thoại hoặc email" />

                <div v-if="bookedOrders.length > 0" class="order-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(order, index) in filteredBookedOrders" :key="order._id">
                                <!-- Hàng chính (order) -->
                                <tr @click="toggleOrderDetails(index)">
                                    <td>{{ order.USER_NAME }}</td>
                                    <td>{{ order.PHONE_NUMBER }}</td>
                                    <td>{{ order.EMAIL }}</td>
                                    <td>{{ order.STATUS === 'Booked' ? 'Đã thanh toán' : 'Đang xử lí' }}</td>
                                    <td>{{ formatDate(order.createdAt) }}</td>
                                </tr>
                                <tr :ref="'table-details-' + index" class="dropdown-row">
                                    <td colspan="5" class="dropdown-content">
                                        <div v-for="table in orderTables[index]" :key="table.TABLE_ID"
                                            class="table-row">
                                            <div class="table-info">
                                                Bàn số: {{ table.TABLE_NUMBER }} - Thời gian đặt: {{ table.BOOKING_TIME
                                                }} -
                                                Trạng thái hiện tại: {{ table.STATUS === 'Completed' ? 'Hoàn thành' :
                                                    'Đang chờ' }}
                                            </div>

                                            <!-- Nút cập nhật trạng thái -->
                                            <button @click="updateBookingTimeStatus(table.TABLE_ID, table.BOOKING_TIME)"
                                                :disabled="table.STATUS === 'Completed'" class="update-button">
                                                Xác nhận trả bàn
                                            </button>
                                        </div>
                                    </td>
                                </tr>





                            </template>
                        </tbody>
                    </table>
                </div>
                <p v-else>Không có đơn hàng nào đã đặt.</p>
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
            currentMonth: new Date().getMonth() + 1, // Tháng hiện tại
            activeTab: 'dashboard', // Tab mặc định
            revenue: '', // Doanh thu
            employees: 20, // Số lượng nhân viên
            customers: 1200, // Số lượng khách hàng
            orders: 30, // Số đơn đang được đặt
            bookedOrders: [], // Mảng lưu trữ các đơn hàng có status là Booked
            openedOrderIndex: null, // Biến theo dõi đơn hàng đang mở
            orderTables: {}, // Lưu thông tin các bàn của từng đơn hàng
            searchQuery: '',
        };
    },
    mounted() {
        this.getRevenue();
        this.getBookedOrders(); // Gọi hàm lấy danh sách đơn hàng Booked
    },
    computed: {
        filteredBookedOrders() {
            // Nếu không có gì để tìm kiếm, trả về tất cả bookedOrders
            if (!this.searchQuery) {
                return this.bookedOrders;
            }
            const query = this.searchQuery.toLowerCase();
            return this.bookedOrders.filter(order => {
                return (
                    order.USER_NAME.toLowerCase().includes(query) ||
                    order.PHONE_NUMBER.toLowerCase().includes(query) ||
                    order.EMAIL.toLowerCase().includes(query)
                );
            });
        },
        currentTabComponent() {
            const components = {
                dashboard: 'DashboardContent',
                menu: 'MenuContent',
                booking: 'BookingContent',
                bill: 'BillContent',
                users: 'UsersContent',
                promotions: 'PromotionsContent',
            };
            return components[this.activeTab] || 'DashboardContent';
        },
    },
    methods: {
        async updateBookingTimeStatus(orderId, startTime) {
            try {
                const response = await axiosClient.post('tables/booking-times/status', {
                    tableId: orderId,
                    startTime: startTime
                });
                if (response.data && response.data.message) {
                    this.$message.success("Cập nhật trạng thái thành công.");
                    this.getBookedOrders();
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái", error);
                this.$message.error("Lỗi khi cập nhật trạng thái.");
            }
        },
        async getRevenue() {
            try {
                const response = await axiosClient.get("booking/total-price");
                this.revenue = response.data.totalPrice;
            } catch (error) {
                console.error("Lỗi khi lấy doanh thu", error);
            }
        },
        async getBookedOrders() {
            try {
                const response = await axiosClient.get("booking/allBookings");
                this.bookedOrders = response.data.data.filter(order => order.STATUS === "Booked");
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng đã đặt", error);
            }
        },

        async toggleOrderDetails(index) {
            if (this.openedOrderIndex === index) {
                this.closeDropdown(index); // Đóng dropdown hiện tại
                this.openedOrderIndex = null;
            } else {
                if (this.openedOrderIndex !== null) {
                    this.closeDropdown(this.openedOrderIndex); // Đóng dropdown trước đó
                }
                this.openedOrderIndex = index;
                this.openDropdown(index); // Mở dropdown mới

                // Nếu chưa tải thông tin các bàn cho đơn hàng, gọi API để lấy thông tin
                if (!this.orderTables[index]) {
                    try {
                        const order = this.bookedOrders[index];
                        const response = await axiosClient.get(`/booking/${order._id}/tables`);
                        // Cập nhật trực tiếp orderTables
                        this.orderTables = {
                            ...this.orderTables,
                            [index]: response.data.data
                        };
                    } catch (error) {
                        console.error("Lỗi khi lấy thông tin các bàn", error);
                    }
                }
            }
        },
        openDropdown(index) {
            const dropdown = this.$refs[`table-details-${index}`][0];
            dropdown.style.display = "table-row"; // Hiển thị dòng dropdown
            dropdown.style.maxHeight = "0"; // Đặt maxHeight ban đầu là 0
            dropdown.style.opacity = "0"; // Đặt opacity ban đầu là 0

            // Đặt transition trước khi mở
            setTimeout(() => {
                dropdown.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
                dropdown.style.maxHeight = "500px"; // Đặt chiều cao tối đa
                dropdown.style.opacity = "1"; // Đặt opacity tối đa
            }, 10);
        },
        closeDropdown(index) {
            const dropdown = this.$refs[`table-details-${index}`][0];
            dropdown.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
            dropdown.style.maxHeight = "0"; // Đặt maxHeight về 0 để đóng
            dropdown.style.opacity = "0"; // Đặt opacity về 0 để đóng

            // Ẩn hoàn toàn sau khi hoàn thành hiệu ứng
            setTimeout(() => {
                dropdown.style.display = "none";
            }, 1);
        },
        isOrderOpen(index) {
            return this.openedOrderIndex === index;
        },

        formatDate(date) {
            const formattedDate = new Date(date);
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const day = String(formattedDate.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
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
.order-list input[type="text"] {
    width: 30%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.table-details {
    background-color: #f9f9f9;
    color: #555;
    font-size: 14px;
}

.order-list {
    margin-top: 40px;
}

.order-table {
    margin-top: 20px;
}

.order-table table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-table th,
.order-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.order-table th {
    background-color: #074874;
    color: white;
}

.order-table tr:hover {
    background-color: #f1f1f1;
}

.order-table tr:last-child td {
    border-bottom: none;
}

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
}

.employees {
    background-color: #2980b9;
}

.customers {
    background-color: #e67e22;
}

.orders {
    background-color: #c0392b;
}

/* Nội dung chính */
.content {
    flex-grow: 1;
    padding: 30px;
    background-color: #ecf0f1;
    overflow-y: auto;
}

/* Hiệu ứng trượt và làm mờ */
/* Hiệu ứng trượt và làm mờ */
.slide-fade-enter-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter {
    max-height: 0;
    opacity: 0;
}

.slide-fade-enter-to {
    max-height: 500px;
    /* Tùy chỉnh chiều cao tối đa */
    opacity: 1;
}

.dropdown-row {
    overflow: hidden;
    display: none;
    /* Ẩn ban đầu */
}

.dropdown-content {
    color: #ffffff;
    background-color: #7c9fc8;
}

/* Đặt phần chứa thông tin bàn và nút thành flex container */
.table-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.table-info {
    flex: 1;
    /* Chiếm toàn bộ chiều rộng trừ nút */
}

/* Điều chỉnh nút cập nhật trạng thái */
.update-button {
    margin-left: auto;
    /* Đẩy nút sang phải */
    padding: 5px 10px;
    background-color: #1ec666;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.update-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

.update-button:hover:not(:disabled) {
    background-color: #4bff8a;
}
</style>
