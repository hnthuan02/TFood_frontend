<template>
    <div class="PaymentPage">
        <section class="payment-section">
            <div class="container">
                <h2 class="section-title">Thanh Toán</h2>

                <!-- Form thông tin người dùng -->


                <!-- Hiển thị thông tin giỏ hàng -->
                <div v-if="cartItems.length > 0" class="payment-details">
                    <div class="order-summary">
                        <h3>Chi tiết đơn hàng</h3>
                        <div class="order-items">
                            <div class="order-item" v-for="(table, index) in cartItems" :key="index">
                                <h4>Bàn: {{ table.tableInfo.TABLE_NUMBER }} - {{ translateType(table.tableInfo.TYPE) }}
                                </h4>
                                <p>Thời gian đặt: {{ table.BOOKING_TIME }}</p>
                                <div v-if="table.LIST_FOOD.length > 0">
                                    <h5>Món ăn:</h5>
                                    <ul>
                                        <li v-for="(food, idx) in table.LIST_FOOD" :key="idx">
                                            {{ food.foodPrice.NAME }} - Số lượng: {{ food.QUANTITY }} - Giá: {{
                                                food.foodPrice.PRICE }} VND
                                        </li>
                                    </ul>
                                    Tổng giá món ăn: {{ table.TOTAL_PRICE_FOOD }} VND
                                </div>
                                <div v-if="table.SERVICES.length > 0">
                                    <h5>Dịch vụ:</h5>
                                    <ul>
                                        <li v-for="(service, idx) in table.SERVICES" :key="idx">
                                            {{ service.serviceName }} - Giá: {{ service.servicePrice }} VND
                                        </li>
                                    </ul>
                                    Tổng giá dịch vụ: {{ table.TOTAL_SERVICE_PRICE }} VND
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Thông tin thanh toán -->
                    <div class="payment-info">
                        <div class="user-info">
                            <div class="form-group">
                                <label for="name">Họ và tên:</label>
                                <input v-model="customerName" type="text" id="name"
                                    placeholder="Nhập họ và tên của bạn" />
                            </div>

                            <div class="form-group">
                                <label for="phone">Số điện thoại:</label>
                                <input v-model="customerPhone" type="text" id="phone"
                                    placeholder="Nhập số điện thoại" />
                            </div>

                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input v-model="customerEmail" type="email" id="email" placeholder="Nhập email" />
                            </div>


                        </div>
                        <h3>Tổng cộng: {{ formatPrice(totalPrice) }}</h3>
                        <div class="form-group">
                            <label for="paymentMethod">Phương thức thanh toán:</label>
                            <select v-model="paymentMethod" id="paymentMethod">
                                <option value="vnpay">Vnpay</option>
                                <option value="zalopay">Zalopay</option>
                                <option value="cash">Tiền mặt</option>
                            </select>
                        </div>

                        <button @click="confirmPayment" class="btn-payment">Xác nhận thanh toán</button>
                    </div>
                </div>

                <div v-else>
                    <p>Giỏ hàng của bạn trống.</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axiosClient from "../../api/axiosClient"; // Sử dụng axiosClient từ file hiện có

export default {
    name: 'PaymentPage',
    data() {
        return {
            cartItems: [], // Thông tin các bàn, món ăn trong giỏ hàng
            totalPrice: 0, // Tổng giá từ giỏ hàng
            customerName: '', // Họ tên khách hàng
            customerPhone: '', // Số điện thoại khách hàng
            customerEmail: '', // Email khách hàng
            paymentMethod: 'cash', // Phương thức thanh toán mặc định
        };
    },
    mounted() {
        this.fetchCart();
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
                // Lấy token từ localStorage
                const token = localStorage.getItem('token');

                // Gọi API getCartById để lấy thông tin giỏ hàng
                const response = await axiosClient.get("/carts/getCartById", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const cartData = response.data.data;

                // Gán dữ liệu từ API
                this.cartItems = cartData.LIST_TABLES;
                this.totalPrice = cartData.TOTAL_PRICES;

                console.log("Cart data:", cartData); // Kiểm tra dữ liệu
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        async confirmPayment() {
            // Tạo dữ liệu booking để gửi lên server
            const bookingData = {
                userName: this.customerName,
                phoneNumber: this.customerPhone,
                email: this.customerEmail,
            };

            try {
                // Gửi yêu cầu tạo booking
                const response = await axiosClient.post("/booking/createBookingFromCart", bookingData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Đảm bảo token người dùng được truyền vào
                    },
                });

                if (response.data.success) {
                    alert("Đặt bàn thành công!");
                    // Điều hướng tới trang thành công nếu cần
                    // this.$router.push({ name: 'SuccessPage' });
                } else {
                    alert("Đặt bàn thất bại. Vui lòng thử lại.");
                }
            } catch (error) {
                console.error("Lỗi khi đặt bàn:", error);
                alert("Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại sau.");
            }
        }

    },
};
</script>

<style scoped>
/* Styling giống với trang thanh toán ban đầu */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

.PaymentPage {
    .payment-section {
        padding: 60px 0;
        background-color: #f8f9fa;

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .section-title {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 40px;
        }

        .user-info {
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            font-weight: bold;
            display: block;
            margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }

        .payment-details {
            display: flex;
            justify-content: space-between;
            gap: 20px;

            .order-summary {
                flex: 0.6;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                border-radius: 8px;

                h3 {
                    font-family: "Playfair Display", serif;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .order-items {

                    .order-item {
                        margin-bottom: 20px;
                        border-bottom: #2c3e50 2px solid;

                        h4 {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 5px;
                            color: #2c3e50;
                        }

                        p {
                            margin: 5px 0;
                            font-size: 16px;
                            color: #7f8c8d;
                        }
                    }
                }
            }

            .payment-info {
                flex: 0.35;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                text-align: center;

                h3 {
                    font-family: "Playfair Display", serif;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #e74c3c;
                }

                .btn-payment {
                    width: 100%;
                    padding: 15px 0;
                    background-color: #2c3e50;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-family: "Playfair Display", serif;
                    cursor: pointer;
                }

                .btn-payment:hover {
                    background-color: #34495e;
                }
            }
        }
    }
}
</style>
