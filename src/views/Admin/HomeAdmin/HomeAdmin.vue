<template>

    <div class="info-cards">
        <div class="info-card revenue">
            <h3>Doanh thu tháng {{ currentMonth }}</h3>
            <font-awesome-icon :icon="['fas', 'money-bill']" />
            <h4>{{ formatCurrency(revenue) }}</h4>
        </div>
        <div class="info-card employees">
            <h3>Nhân viên</h3>
            <font-awesome-icon :icon="['fas', 'user-tie']" />
            <h4>{{ totalStaff }}</h4>
        </div>
        <div class="info-card customers">
            <h3>Khách hàng</h3>
            <font-awesome-icon :icon="['fas', 'user-group']" />
            <h4>{{ customers }}</h4>
        </div>
        <div class="info-card orders">
            <h3>Tổng đơn tháng {{ currentMonth }}</h3>
            <font-awesome-icon :icon="['fas', 'clipboard-list']" />
            <h4>{{ currentMonthTotalBookings }}</h4>
        </div>

    </div>
    <!-- Tabs để chuyển đổi giữa hai phần -->
    <div class="tabs">
        <button :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
            Danh sách đơn đặt bàn
        </button>
        <button :class="{ active: activeTab === 'overview' }"
            @click="activeTab = 'overview'; drawRevenueChart(); getRevenue(); drawBookingChart(); fetchFoodQuantityData();">
            Xem tổng quan
        </button>
    </div>
    <!-- Hiển thị danh sách đơn đặt bàn -->
    <div v-if="activeTab === 'orders'" class="order-list">
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
                                <div v-for="table in orderTables[index]" :key="table.TABLE_ID" class="table-row">
                                    <div class="table-info">
                                        Bàn số: {{ table.TABLE_NUMBER }} - Thời gian đặt: {{ table.BOOKING_TIME }}
                                        - Trạng thái hiện tại: {{ table.STATUS === 'Completed' ? 'Hoàn thành' :
                                            'Đang chờ' }}
                                    </div>

                                    <!-- Nút cập nhật trạng thái -->
                                    <button class="add-food-button"
                                        @click="addFood({ BOOKING_ID: order._id, TABLE_ID: table.TABLE_ID })">
                                        Thêm món vào bàn
                                    </button>
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

    <!-- Hiển thị biểu đồ doanh thu và đặt bàn -->
    <div v-if="activeTab === 'overview'" class="charts-container">
        <!-- Biểu đồ doanh thu và đặt bàn nằm cùng hàng -->
        <div class="chart-row">
            <div class="chart-item">
                <canvas id="revenueChart"></canvas>
            </div>
            <div class="chart-item">
                <canvas id="bookingChart"></canvas>
            </div>
        </div>
        <!-- Biểu đồ số lượng món ăn nằm ở hàng riêng -->
        <div class="chart-row">
            <div class="chart-item-full">
                <canvas id="foodQuantityChart"></canvas>
            </div>
        </div>
    </div>


    <div v-if="showFoodPopup" class="food-popup">
        <div class="food-popup-content">
            <h3>Chọn món ăn</h3>

            <!-- Thanh lọc loại món ăn -->
            <div class="filter-bar">
                <button v-for="(type, index) in filterTypes" :key="type" @click="selectFilter(type)"
                    :class="{ active: selectedFilter === type }">
                    {{ translatedFilterTypes[index] }}
                </button>
            </div>

            <!-- Danh sách món ăn được lọc -->
            <div class="food-list">
                <div v-for="food in filteredFoodItems" :key="food._id" class="food-item">
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
            <div class="contain-button">
                <button @click="confirmFoodSelection" class="confirm-button">Xác nhận</button>
                <button @click="closeFoodPopup" class="close-button">Đóng</button>
            </div>
        </div>
    </div>
    <div v-if="showPaymentModal" class="payment-modal">
        <div class="payment-modal-content">
            <h3>Xác nhận thanh toán</h3>
            <p>Bạn đã chọn <strong>{{ selectedFoodItems.length }}</strong> món ăn.</p>
            <p>Số tiền dự kiến: <strong>{{ calculateSelectedItemsTotal() }}</strong></p>
            <div class="payment-options">
                <button @click="payByCash" :disabled="isPaid" class="cash-button">
                    {{ isPaid ? "Đã thanh toán" : "Thanh toán tiền mặt" }}
                </button>
                <button @click="payByVNPay" class="vnpay-button">Thanh toán bằng VNPay</button>
            </div>
            <button @click="closePaymentModal" class="close-modal-button">Đóng</button>
        </div>
    </div>



</template>






<script>
import { Chart, registerables } from 'chart.js';
import { nextTick } from 'vue';
import axiosClient from "../../../api/axiosClient";

Chart.register(...registerables);
export default {
    data() {
        return {
            currentMonth: new Date().getMonth() + 1, // Tháng hiện tại
            activeTab: 'dashboard', // Tab mặc định
            revenue: '', // Doanh thu
            employees: null, // Số lượng nhân viên
            customers: null, // Số lượng khách hàng
            orders: 30, // Số đơn đang được đặt
            bookedOrders: [], // Mảng lưu trữ các đơn hàng có status là Booked
            openedOrderIndex: null, // Biến theo dõi đơn hàng đang mở
            orderTables: {}, // Lưu thông tin các bàn của từng đơn hàng
            searchQuery: '',
            monthlyRevenueData: [],
            activeTab: "orders",
            chartInstance: null, // Lưu trữ biểu đồ hiện tại
            monthlyRevenue: [],
            monthlyBookingStats: [],
            bookingChartInstance: null,
            totalStaff: null,
            showFoodPopup: false,
            foodItems: [],
            selectedFoodItems: [],
            quantities: {},
            filterTypes: ['Steak', 'Pasta', 'Dessert', 'Drink'],
            selectedFilter: 'Steak',
            showPaymentModal: false, // Hiển thị modal thanh toán
            selectedTable: null, // Bàn được chọn
            addedItemsTotal: 0, // Tổng tiền cần thanh toán
            isPaid: false,
            foodQuantityData: [], // Lưu trữ dữ liệu món ăn
            foodChartInstance: null,
        };
    },
    mounted() {
        this.getRevenue();
        this.getBookedOrders(); // Gọi hàm lấy danh sách đơn hàng Booked
        this.getBookingStats();
        this.getRevenueData();
        this.fetchUsers();

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
        currentMonthTotalBookings() {
            const currentMonthStats = this.monthlyBookingStats[this.currentMonth - 1];
            if (currentMonthStats) {
                return currentMonthStats.Booked + currentMonthStats.Completed;
            }
            return 0;
        },
        filteredFoodItems() {
            const filtered = this.foodItems.filter(food => food.TYPE === this.selectedFilter);
            return filtered;
        },
        translatedFilterTypes() {
            const translations = {
                'Steak': 'Bít tết',
                'Pasta': 'Mỳ ý',
                'Dessert': 'Tráng miệng',
                'Drink': 'Nước uống'
            };
            return this.filterTypes.map(type => translations[type] || type);
        }
    },
    methods: {
        async getBookingStats() {
            try {
                const response = await axiosClient.get(`booking/monthly-stats?year=${new Date().getFullYear()}`);
                if (response.data.success) {
                    this.monthlyBookingStats = response.data.monthlyStats;
                }
            } catch (error) {
                console.error("Lỗi khi lấy số lượng đặt bàn hàng tháng", error);
            }
        },
        async drawBookingChart() {
            await nextTick();
            const canvas = document.getElementById('bookingChart');
            if (!canvas) {
                console.error("Element with id 'bookingChart' not found");
                return;
            }

            const ctx = canvas.getContext('2d');
            if (this.bookingChartInstance) {
                this.bookingChartInstance.destroy();
            }

            const data = {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                datasets: [
                    {
                        label: 'Đã đặt (Booked)',
                        data: this.monthlyBookingStats.map(item => item.Booked),
                        borderColor: 'rgba(23, 242, 102, 1)',
                        backgroundColor: 'rgba(23, 242, 102, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Hoàn thành (Completed)',
                        data: this.monthlyBookingStats.map(item => item.Completed),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                    }
                ]
            };

            this.bookingChartInstance = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        ,

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
                const response = await axiosClient.get(`booking/total-price?year=${new Date().getFullYear()}`);
                if (response.data.success) {
                    this.monthlyRevenue = response.data.monthlyRevenue; // Đảm bảo monthlyRevenue có dữ liệu
                    this.revenue = this.monthlyRevenue[this.currentMonth - 1] || 0;
                }
            } catch (error) {
                console.error("Lỗi khi lấy doanh thu", error);
            }
        },
        async getRevenueData() {
            try {
                const response = await axiosClient.get("booking/allBookings");
                if (response.data.success) {
                    const bookings = response.data.data;

                    // Khởi tạo mảng doanh thu, dịch vụ và thức ăn cho từng tháng
                    this.monthlyRevenue = Array(12).fill(0);
                    this.servicePrices = Array(12).fill(0);
                    this.foodPrices = Array(12).fill(0);

                    bookings.forEach(order => {
                        const bookingMonth = new Date(order.createdAt).getMonth();

                        let totalServicePrice = 0;
                        let totalFoodPrice = 0;

                        // Tính tổng giá dịch vụ và thức ăn cho từng đơn hàng
                        order.LIST_TABLES.forEach(table => {
                            table.SERVICES.forEach(service => {
                                // Kiểm tra `service.SERVICES_ID` và `service.SERVICES_ID.servicePrice` trước khi cộng
                                if (service.SERVICES_ID && service.SERVICES_ID.servicePrice) {
                                    totalServicePrice += service.SERVICES_ID.servicePrice;
                                }
                            });
                            table.LIST_FOOD.forEach(food => {
                                // Tương tự, kiểm tra giá và số lượng thức ăn trước khi cộng
                                if (food.FOOD_ID && food.FOOD_ID.PRICE && food.QUANTITY) {
                                    totalFoodPrice += food.FOOD_ID.PRICE * food.QUANTITY;
                                }
                            });
                        });

                        // Tổng giá trị dựa trên dịch vụ và thức ăn
                        const totalOrderPrice = totalServicePrice + totalFoodPrice;

                        // Kiểm tra sự chênh lệch giữa `TOTAL_PRICE` và `totalOrderPrice` từng đơn hàng
                        let adjustedServicePrice = totalServicePrice;
                        let adjustedFoodPrice = totalFoodPrice;

                        if (totalOrderPrice > 0) {
                            const totalPriceDifference = totalOrderPrice - order.TOTAL_PRICE;
                            const priceAdjustment = totalPriceDifference / totalOrderPrice;

                            // Điều chỉnh giá trị `servicePrice` và `foodPrice` nếu có chênh lệch
                            adjustedServicePrice = totalServicePrice * (1 - priceAdjustment);
                            adjustedFoodPrice = totalFoodPrice * (1 - priceAdjustment);
                        }

                        // Cộng dồn giá trị vào tháng tương ứng
                        this.servicePrices[bookingMonth] += adjustedServicePrice;
                        this.foodPrices[bookingMonth] += adjustedFoodPrice;
                        this.monthlyRevenue[bookingMonth] += order.TOTAL_PRICE;
                    });

                    // Vẽ biểu đồ sau khi hoàn tất tính toán
                    this.drawRevenueChart();
                }
            } catch (error) {
                console.error("Lỗi khi lấy doanh thu", error);
            }
        },
        async drawRevenueChart() {
            await nextTick();
            const canvas = document.getElementById('revenueChart');
            if (!canvas) {
                console.error("Element with id 'revenueChart' not found");
                return;
            }

            const ctx = canvas.getContext('2d');
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            const data = {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                datasets: [
                    {
                        label: 'Tổng doanh thu',
                        data: this.monthlyRevenue,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Doanh thu dịch vụ',
                        data: this.servicePrices,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Doanh thu đồ ăn',
                        data: this.foodPrices,
                        borderColor: '#e67e22',
                        backgroundColor: 'rgba(230, 126, 34, 0.2)',
                        fill: true
                    }
                ]
            };

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
        prevMonth() {
            if (this.currentMonth > 1) {
                this.currentMonth -= 1;
            } else {
                this.currentMonth = 12;
            }
            this.getRevenue(); // Cập nhật doanh thu cho tháng mới
        },
        nextMonth() {
            if (this.currentMonth < 12) {
                this.currentMonth += 1;
            } else {
                this.currentMonth = 1;
            }
            this.getRevenue(); // Cập nhật doanh thu cho tháng mới
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
        async fetchUsers() {
            try {
                const response = await axiosClient.get("/users/getAllUsers", {
                    params: {
                        tabStatus: 4,
                    },
                });
                this.totalStaff = response.data.totalStaff;
                this.customers = response.data.totalUser;
            } catch (error) {
                console.error("Lỗi khi lấy người dùng:", error);
            }
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
        },
        addFood(table) {
            this.selectedTable = {
                bookingId: table.BOOKING_ID,
                tableId: table.TABLE_ID
            };
            this.showFoodPopup = true; // Hiển thị popup chọn món ăn
            this.loadFoodItems(); // Gọi hàm tải danh sách món ăn từ API
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
        selectFilter(type) {
            this.selectedFilter = type; // Cập nhật loại món ăn đang được chọn
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        increaseQuantity(foodId) {
            this.quantities[foodId] = (this.quantities[foodId] || 0) + 1; // Tăng số lượng
        },
        decreaseQuantity(foodId) {
            if (this.quantities[foodId] > 0) {
                this.quantities[foodId] -= 1; // Giảm số lượng
            }
        },
        confirmFoodSelection() {
            this.selectedFoodItems = Object.entries(this.quantities)
                .filter(([foodId, quantity]) => quantity > 0)
                .map(([foodId, quantity]) => {
                    const foodItem = this.foodItems.find(food => food._id === foodId);
                    return {
                        FOOD_ID: foodId,
                        name: foodItem.NAME,
                        QUANTITY: quantity,
                        PRICE: foodItem.PRICE
                    };
                });

            if (this.selectedFoodItems.length === 0) {
                alert("Vui lòng chọn ít nhất một món ăn!");
                return;
            }

            this.showFoodPopup = false; // Đóng popup chọn món ăn
            this.showPaymentModal = true; // Hiển thị modal thanh toán
        },

        // Thanh toán bằng tiền mặt
        calculateSelectedItemsTotal() {
            return this.selectedFoodItems.reduce((total, item) => {
                return total + item.QUANTITY * item.PRICE;
            }, 0);
        },

        // Thanh toán bằng tiền mặt
        async payByCash() {
            try {
                const payload = {
                    bookingId: this.selectedTable.bookingId,
                    tableId: this.selectedTable.tableId,
                    foods: this.selectedFoodItems.map(item => ({
                        FOOD_ID: item.FOOD_ID,
                        QUANTITY: item.QUANTITY
                    }))
                };

                const response = await axiosClient.put("http://localhost:3001/booking/add-items", payload);

                if (response.data.success) {
                    this.addedItemsTotal = response.data.addedItemsTotal;
                    this.isPaid = true; // Đánh dấu đã thanh toán
                    this.showPaymentModal = false; // Đóng modal thanh toán
                    alert("Thanh toán thành công!");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API thanh toán:", error);
                alert("Có lỗi xảy ra khi thanh toán!");
            }
        },

        // Thanh toán bằng VNPay
        async payByVNPay() {
            try {
                const additionalAmountPay = this.calculateSelectedItemsTotal();
                if (additionalAmountPay <= 0) {
                    alert("Số tiền không hợp lệ. Vui lòng chọn ít nhất một món ăn.");
                    return;
                }
                const payload = {
                    bookingId: this.selectedTable.bookingId,
                    tableId: this.selectedTable.tableId,
                    foods: this.selectedFoodItems.map(item => ({
                        FOOD_ID: item.FOOD_ID,
                        QUANTITY: item.QUANTITY
                    }))
                };
                const paymentResponse = await axiosClient.post(
                    "/payments/create_additional_payment_url",
                    {
                        bookingId: this.selectedTable.bookingId,
                        additionalAmount: additionalAmountPay,
                    }
                );
                if (paymentResponse.data && paymentResponse.data.data.url) {
                    window.open(paymentResponse.data.data.url, "_blank");
                } else {
                    this.$toast.error("Không thể tạo liên kết thanh toán VNPAY.");
                }

                const response = await axiosClient.put("http://localhost:3001/booking/add-items", payload);

                if (response.data.success) {
                    this.addedItemsTotal = response.data.addedItemsTotal;
                    this.showPaymentModal = false; // Đóng modal thanh toán
                    alert("Chuyển hướng đến VNPay...");
                    // Thực hiện logic điều hướng hoặc xử lý thanh toán với VNPay
                }
            } catch (error) {
                console.error("Lỗi khi gọi API thanh toán VNPay:", error);
                alert("Có lỗi xảy ra khi thanh toán!");
            }
        },

        // Đóng modal thanh toán
        closePaymentModal() {
            this.showPaymentModal = false;
        },
        async fetchFoodQuantityData() {
            try {
                const response = await axiosClient.get("http://localhost:3001/booking/total-food-quantity");
                if (response.data.success) {
                    this.foodQuantityData = response.data.data; // Lưu dữ liệu vào state
                    this.drawFoodQuantityChart(); // Vẽ biểu đồ sau khi có dữ liệu
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu số lượng món ăn:", error);
            }
        },

        async drawFoodQuantityChart() {
            await nextTick();
            const canvas = document.getElementById('foodQuantityChart');
            if (!canvas) {
                console.error("Không tìm thấy phần tử với id 'foodQuantityChart'");
                return;
            }

            const ctx = canvas.getContext('2d');
            if (this.foodChartInstance) {
                this.foodChartInstance.destroy(); // Xóa biểu đồ cũ nếu tồn tại
            }

            // Sắp xếp dữ liệu theo số lượng bán
            const sortedData = [...this.foodQuantityData].sort((a, b) => a.totalQuantity - b.totalQuantity);

            // Lấy 5 món bán ít nhất và 5 món bán nhiều nhất
            const leastSold = sortedData.slice(0, 5); // Món ít bán nhất
            const mostSold = sortedData.slice(-5);   // Món bán chạy nhất

            // Kết hợp dữ liệu theo thứ tự từ ít đến nhiều
            const combinedData = [...leastSold, ...mostSold];
            const labels = combinedData.map(item => item.foodName); // Tên món ăn
            const data = combinedData.map(item => item.totalQuantity); // Số lượng món ăn

            // Tạo màu sắc: Đỏ cho món ít bán, Xanh cho món bán chạy
            const backgroundColors = [
                ...leastSold.map(() => 'rgba(255, 99, 132, 0.5)'), // Đỏ nhạt
                ...mostSold.map(() => 'rgba(75, 192, 192, 0.5)')  // Xanh nhạt
            ];
            const borderColors = [
                ...leastSold.map(() => 'rgba(255, 99, 132, 1)'), // Đỏ đậm
                ...mostSold.map(() => 'rgba(75, 192, 192, 1)')  // Xanh đậm
            ];

            this.foodChartInstance = new Chart(ctx, {
                type: 'bar', // Loại biểu đồ
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Số lượng bán',
                            data: data,
                            backgroundColor: backgroundColors,
                            borderColor: borderColors,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                generateLabels: (chart) => {
                                    return [
                                        {
                                            text: 'Bán ít',
                                            fillStyle: 'rgba(255, 99, 132, 0.5)',
                                            strokeStyle: 'rgba(255, 99, 132, 1)',
                                            lineWidth: 2,
                                        },
                                        {
                                            text: 'Bán chạy',
                                            fillStyle: 'rgba(75, 192, 192, 0.5)',
                                            strokeStyle: 'rgba(75, 192, 192, 1)',
                                            lineWidth: 2,
                                        },
                                    ];
                                },
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Số lượng',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tên món ăn',
                            },
                        },
                    },
                },
            });
        },
    },
};
</script>

<style scoped>
.month-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    margin-top: 10px;
    color: #ddd;
}

.arrow-button {
    background: none;
    border: none;
    color: #6d4c41;
    font-size: 24px;
    cursor: pointer;
    padding: 0 10px;
    transition: color 0.2s;
}

.arrow-button:hover {
    color: #7274ff;
}

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
    gap: 20px;
}

.info-card {
    width: 23%;
    padding: 20px;
    border-radius: 12px;
    color: white;
    text-align: center;
    font-size: 18px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card h3 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
}

.info-card h4 {
    font-size: 24px;
    font-weight: 600;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.revenue {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.employees {
    background: linear-gradient(135deg, #2980b9, #3498db);
}

.customers {
    background: linear-gradient(135deg, #e67e22, #f39c12);
}

.orders {
    background: linear-gradient(135deg, #c0392b, #e74c3c);
}

.info-card::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    transition: opacity 0.3s;
    opacity: 0;
}

.info-card:hover::before {
    opacity: 1;
}

/* Thêm hiệu ứng ánh sáng nổi bật khi hover */
.info-card:hover {
    background-size: 200% 200%;
    animation: shine 1.2s infinite linear;
}

@keyframes shine {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* Nội dung chính */
.content {
    flex-grow: 1;
    padding: 20px;
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
    height: 44px;
}

.update-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

.update-button:hover:not(:disabled) {
    background-color: #4bff8a;
}

.chart-container {
    width: 50%;
    max-width: 600px;
    /* Kích thước tối đa của biểu đồ */
    margin: 20px 0;
    /* Giữa */
}

canvas {
    width: 100% !important;
    /* Đảm bảo biểu đồ chiếm hết chiều rộng */
    height: auto !important;
    /* Chiều cao tự động */
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    background-color: #e8e8e8;
    border-radius: 5px;
    width: 100%;
}

.tabs button.active {
    background-color: #34495E;
    color: white;
}

.charts-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
    justify-content: center;
    max-width: 1256px;
}

.chart-item {
    flex: 1;
    max-width: 50%;
    /* Đặt mỗi biểu đồ chiếm 50% chiều rộng */
}

h4 {
    margin: 0;
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
    width: 550px;
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
    margin-right: 10px;
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

.filter-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

.filter-bar button {
    background-color: #eee;
    border: none;
    padding: 8px 15px;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.filter-bar button.active {
    background-color: #1A242F;
    color: white;
}

.filter-bar button:hover {
    background-color: #243241;
    color: white;
}

.contain-button {
    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-modal {
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

.payment-modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
}

.payment-options button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.cash-button {
    background-color: #27ae60;
    color: white;
    border: none;
}

.cash-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

.vnpay-button {
    background-color: #3498db;
    color: white;
    border: none;
}

.close-modal-button {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    background-color: #e74c3c;
    color: white;
    border-radius: 5px;
}

.chart-row {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
    max-height: 304px;
}

.chart-item-full {
    flex: 1;
    max-width: 50%;
    /* Giới hạn chiều rộng để giống với 2 biểu đồ kia */
    height: 300px;
    /* Đặt chiều cao cố định cho biểu đồ */
    margin: 0 auto;
    /* Căn giữa nếu cần */
}
</style>