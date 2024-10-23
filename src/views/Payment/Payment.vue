<template>
    <div class="PaymentPage">
        <section class="payment-section">
            <div class="container">
                <h2 class="section-title">Thanh Toán</h2>



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
                                    <h5 class="service-contain">Dịch vụ:</h5>
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
                            <div class="form-group floating">
                                <input v-model="customerName" type="text" id="name" placeholder=" " required />
                                <label for="name">Họ và tên:</label>
                            </div>
                            <div class="form-group floating">
                                <input v-model="customerPhone" type="text" id="phone" placeholder=" " required />
                                <label for="phone">Số điện thoại:</label>
                            </div>
                            <div class="form-group floating">
                                <input v-model="customerEmail" type="email" id="email" placeholder=" " required />
                                <label for="email">Email:</label>
                            </div>
                        </div>
                        <h3>Tổng cộng: {{ formatPrice(totalPrice) }}</h3>
                        <div class="form-group select-payment-method">
                            <label for="paymentMethod">Phương thức thanh toán: {{ paymentMethod }}</label>
                            <select v-model="paymentMethod" id="paymentMethod">
                                <option value="Vnpay">Vnpay</option>
                                <option value="Zalopay">Zalopay</option>
                                <option value="Tiền mặt">Tiền mặt</option>
                            </select>
                        </div>



                        <button @click="processPayment" class="btn-payment">Xác nhận thanh toán</button>
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
            paymentMethod: 'Vnpay', // Phương thức thanh toán mặc định
        };
    },
    mounted() {
        this.fetchSelectedTables(); // Gọi hàm lấy các bàn đã chọn
    },
    methods: {

        async fetchSelectedTables() {
            try {
                const selectedTables = JSON.parse(localStorage.getItem('selectedTables'));
                if (!selectedTables || selectedTables.length === 0) {
                    this.$message.error('Không có bàn nào được chọn.');
                    this.$router.push('/cart'); // Quay lại trang giỏ hàng nếu không có bàn nào
                    return;
                }

                const response = await axiosClient.get("/carts/getCartById", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const cartData = response.data.data;

                // Lọc các bàn đã chọn từ giỏ hàng
                this.cartItems = cartData.LIST_TABLES.filter(table =>
                    selectedTables.includes(table.TABLE_ID)
                );

                // Tính tổng giá
                this.totalPrice = this.cartItems.reduce((total, table) => {
                    return total + table.TOTAL_PRICE_FOOD + table.TOTAL_SERVICE_PRICE;
                }, 0);
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
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
        async processPayment() {
            console.log("Customer Name:", this.customerName);
            console.log("Customer Phone:", this.customerPhone);
            console.log("Customer Email:", this.customerEmail);
            const paymentData = {
                userName: this.customerName,
                phoneNumber: this.customerPhone,
                email: this.customerEmail,
                selectedTables: JSON.parse(localStorage.getItem('selectedTables')),
            };
            console.log(paymentData);
            try {
                // Gọi API đặt phòng
                const response = await axiosClient.post("/booking/createBookingFromCart", paymentData);
                console.log(response);

                if (response.data.success) {
                    // Sau khi đặt phòng thành công, tạo URL thanh toán VNPAY
                    const paymentResponse = await axiosClient.post(
                        "/payments/create_payment_url",
                        {
                            id: response.data.data._id,
                            totalPrice: response.data.data.TOTAL_PRICE,
                        }
                    );

                    if (paymentResponse.data && paymentResponse.data.data.url) {
                        window.open(paymentResponse.data.data.url, "_blank");
                    } else {
                        this.$toast.error("Không thể tạo liên kết thanh toán VNPAY.");
                    }
                } else {
                    this.$toast.error("Đặt bàn thất bại.");
                }
            } catch (error) {
                console.error("Lỗi khi đặt bàn:", error);
                this.$toast.error("Đặt bàn thất bại. Vui lòng thử lại.");
            }
        },

    },
};
</script>

<style scoped>
/* Styling giống với trang thanh toán ban đầu */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

.PaymentPage {
    h5 {
        margin-bottom: 0;
    }

    .service-contain {
        margin-top: 15px;
    }

    ul {
        margin-bottom: 0;
    }

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
            display: flex;
            flex-direction: column;
            /* Sắp xếp các phần tử từ trên xuống dưới */
            gap: 20px;
            /* Khoảng cách giữa các input */
        }

        .form-group {
            display: flex;
            flex-direction: column;
            /* Xếp các phần tử trong group theo chiều dọc */
            width: 100%;
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
            color: #333;
            /* Đảm bảo màu văn bản không bị ẩn */
            background-color: white;
            /* Đảm bảo nền trắng để văn bản dễ đọc */
            appearance: auto;
            /* Đảm bảo hiển thị mặc định cho trình duyệt */
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

.form-group {
    position: relative;
    margin-bottom: 20px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s ease;
    background: none;
}

.form-group input:focus {
    border-color: #3498db;
    /* Đổi màu viền khi focus */
}

.form-group label {
    position: absolute;
    top: 10px;
    left: 12px;
    font-size: 16px;
    color: #999;
    background-color: #fff;
    padding: 0 5px;
    transition: 0.3s;
    pointer-events: none;
}

/* Khi input có focus hoặc có giá trị, label sẽ di chuyển lên và thu nhỏ */
.form-group input:focus+label,
.form-group input:not(:placeholder-shown)+label {
    top: -12px;
    left: 10px;
    font-size: 12px;
    color: #3498db;
    /* Đổi màu nhãn khi input được chọn */
}

/* Đảm bảo rằng placeholder không hiển thị */
.form-group input::placeholder {
    opacity: 0;
}

/* Styling riêng cho phần chọn phương thức thanh toán */
.select-payment-method {
    position: relative;
    margin-bottom: 20px;
}

.select-payment-method select {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    outline: none;
    background-color: #f8f9fa;
    /* Màu nền nhạt hơn */
    color: #333;
    /* Màu chữ */
    appearance: none;
    /* Tắt giao diện mặc định của trình duyệt */
    -webkit-appearance: none;
    -moz-appearance: none;
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
}

.select-payment-method select:focus {
    border-color: #3498db;
    background-color: #ffffff;
    /* Đổi màu nền khi focus */
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
    /* Đổ bóng khi focus */
}

.select-payment-method label {
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
}

.select-payment-method select option {
    color: #333;
    background-color: #fff;
}
</style>
