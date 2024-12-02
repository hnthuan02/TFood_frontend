<template>
    <div class="booking-history">
        <h1 class="section-title">Lịch sử Đặt Bàn</h1>
        <div v-for="(booking, index) in bookings" :key="index" class="booking-card">
            <div class="customer-info">
                <p><strong>Tên khách hàng:</strong> {{ booking.USER_NAME }}</p>
                <p><strong>Số điện thoại:</strong> {{ booking.PHONE_NUMBER }}</p>
                <p>
                    <strong>Trạng thái: </strong>
                    <span :class="getStatusClass(booking.STATUS)">
                        {{ translateStatus(booking.STATUS) }}
                    </span>
                </p>
            </div>

            <div class="booking-info" v-for="(table, tableIndex) in booking.LIST_TABLES" :key="tableIndex">
                <h3><strong>Bàn:</strong> {{ table.TABLE_ID.TABLE_NUMBER }}</h3>
                <div class="table-details">
                    <img :src="table.TABLE_ID.IMAGES[0]" alt="Hình ảnh bàn" class="table-image" />
                    <div class="table-info">
                        <p><strong>Thời gian đặt:</strong> {{ table.BOOKING_TIME }}</p>
                        <p><strong>Sức chứa:</strong> {{ table.TABLE_ID.CAPACITY }} người</p>
                    </div>
                </div>
            </div>



            <div v-if="booking.review" class="review-info">
                <div class="review-status">
                    <span>{{ booking.review.STATUS ? ' ' : 'Chờ duyệt' }}</span>
                    <button class="delete-button" @click="deleteReview(booking.review._id)">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>


                <div class="rating-section">
                    <p class="p-review">Đánh giá Món ăn:</p>
                    <div class="star-rating">
                        <span v-for="star in 5" :key="star"
                            :class="{ selected: star <= booking.review.RATING_FOOD }">★</span>
                    </div>
                </div>

                <div class="rating-section">
                    <p class="p-review">Đánh giá Dịch vụ:</p>
                    <div class="star-rating">
                        <span v-for="star in 5" :key="star"
                            :class="{ selected: star <= booking.review.RATING_SERVICE }">★</span>
                    </div>
                </div>

                <p class="review-comment"><strong>Nhận xét:</strong> {{ booking.review.COMMENT }}</p>
            </div>


            <!-- Nút đánh giá -->
            <div class="action-section">
                <div class="button-section">
                    <div v-if="(booking.STATUS === 'Completed') && (!booking.review)" class="review-section">
                        <button @click="openReviewModal(booking)" class="review-button">Đánh giá</button>
                    </div>
                    <div v-if="(booking.STATUS === 'Completed') && (booking.review)" class="review-section">
                        <button @click="openReviewModal(booking)" class="review-button">Đánh giá lại</button>
                    </div>
                    <div v-if="booking.STATUS === 'NotYetPaid'" class="payment-section">
                        <button @click="repaymentBooking(booking._id, booking.TOTAL_PRICE)" class="payment-button">Thanh
                            toán lại</button>
                    </div>
                    <div>
                        <button class="detail-button" @click="openDetailModal(booking)">Chi tiết đơn</button>
                    </div>
                </div>
                <div class="total-price">
                    <strong>Tổng giá:</strong> {{ formatPrice(booking.TOTAL_PRICE) }}
                </div>
            </div>
            <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
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
                    <button @click="closeModal" class="close-button">x</button>
                </div>
            </div>
        </div>

        <!-- Modal đánh giá -->
        <div v-if="showReviewModal" class="modal-overlay-review">
            <div class="modal-content">
                <button class="close-button" @click="closeReviewModal">×</button>
                <h3 class="modal-title">Viết đánh giá</h3>
                <form @submit.prevent="isReviewExisting ? updateReview() : submitReview()">
                    <!-- Đánh giá món ăn -->
                    <div class="form-group">
                        <label class="form-label">Đánh giá món ăn</label>
                        <div class="star-rating">
                            <span v-for="star in 5" :key="star"
                                :class="['star', { 'selected': star <= reviewData.ratingFood }]"
                                @click="setRating('ratingFood', star)">
                                ★
                            </span>
                        </div>
                    </div>

                    <!-- Đánh giá dịch vụ -->
                    <div class="form-group">
                        <label class="form-label">Đánh giá dịch vụ</label>
                        <div class="star-rating">
                            <span v-for="star in 5" :key="star"
                                :class="['star', { 'selected': star <= reviewData.ratingService }]"
                                @click="setRating('ratingService', star)">
                                ★
                            </span>
                        </div>
                    </div>

                    <!-- Nhận xét -->
                    <div class="form-group">
                        <label class="form-label">Nhận xét</label>
                        <textarea v-model="reviewData.comment" class="form-textarea" rows="4"
                            placeholder="Hãy chia sẻ ý kiến của bạn..." required></textarea>
                    </div>

                    <!-- Nút hành động -->
                    <div class="modal-buttons">
                        <button type="button" class="cancel-button" @click="closeReviewModal">Hủy</button>
                        <button type="submit" class="submit-button">
                            {{ isReviewExisting ? 'Cập nhật' : 'Xác nhận' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>


<script>
import Swal from 'sweetalert2';
import axiosClient from '../../../api/axiosClient';
export default {
    data() {
        return {
            bookings: [],
            showReviewModal: false, // Trạng thái hiển thị modal đánh giá
            showDetailModal: false,
            selectedBooking: null, // Đơn đặt bàn được chọn để đánh giá
            reviewData: {
                ratingFood: 1,
                ratingService: 1,
                comment: '',
            },
            isReviewExist: false,
            existingReviewId: null,
        };
    },
    async created() {
        await this.fetchBookingHistory();
    },
    methods: {
        closeModal() {
            this.showDetailModal = null; // Đóng modal
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);
        },
        openDetailModal(booking) {
            this.selectedBooking = booking; // Gán booking được chọn
            this.showDetailModal = true; // Hiển thị modal
        },
        closeDetailModal() {
            this.showDetailModal = false; // Đóng modal
            this.selectedBooking = null; // Reset booking được chọn
        },
        handleDeleteClick(reviewId) {
            console.log("Icon xóa được nhấp với ID:", reviewId);
            this.deleteReview(reviewId);
        },
        async deleteReview(reviewId) {
            console.log("Deleting review with ID:", reviewId); // Kiểm tra reviewId

            // Hiển thị hộp thoại xác nhận
            const result = await Swal.fire({
                title: 'Xác nhận xóa đánh giá',
                text: 'Bạn có chắc chắn muốn xóa đánh giá này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Màu nút "Đồng ý"
                cancelButtonColor: '#3085d6', // Màu nút "Hủy"
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });

            // Nếu người dùng chọn "Hủy"
            if (!result.isConfirmed) {
                return;
            }

            console.log("Xóa đánh giá với ID:", reviewId); // Kiểm tra reviewId

            try {
                const response = await axiosClient.delete(`/reviews/delete/${reviewId}`);
                if (response.data.success) {
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Đánh giá đã được xóa thành công!',
                        icon: 'success',
                        confirmButtonColor: '#6d4c41', // Màu chủ đạo của nút
                        confirmButtonText: 'OK',
                    });
                    this.fetchBookingHistory(); // Làm mới danh sách sau khi xóa
                } else {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: `Lỗi khi xóa đánh giá: ${response.data.msg}`,
                        icon: 'error',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK',
                    });
                }
            } catch (error) {
                console.error('Lỗi khi xóa đánh giá:', error);
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi xóa đánh giá.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK',
                });
            }
        },
        translateStatus(status) {
            switch (status) {
                case 'NotYetPaid':
                    return 'Chưa thanh toán';
                case 'Booked':
                    return 'Đã đặt';
                case 'CheckedIn':
                    return 'Đã nhận bàn';
                case 'CheckedOut':
                    return 'Đã trả bàn';
                case 'Canceled':
                    return 'Đã hủy';
                case 'Completed':
                    return 'Hoàn thành';
                default:
                    return 'Trạng thái không xác định';
            }
        },
        async fetchBookingHistory() {
            try {
                const response = await axiosClient.get('/booking/getBookingsByUserId');
                this.bookings = response.data.data;

                // Duyệt qua mỗi booking để kiểm tra đánh giá
                for (let booking of this.bookings) {
                    try {
                        const reviewResponse = await axiosClient.post('http://localhost:3001/reviews/getReviewByUserAndBooking', {
                            bookingId: booking._id,
                        });
                        if (reviewResponse.data.success) {
                            booking.review = reviewResponse.data.review; // Gán đánh giá cho booking
                        } else {
                            booking.review = null;
                        }
                    } catch (error) {
                        //console.error(`Lỗi khi lấy đánh giá cho booking ${booking._id}:`, error);
                        booking.review = null;
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử đặt bàn:', error);
            }
        },
        getStatusClass(status) {
            if (status === 'Booked')
                return 'status-confirmed';
            else if (status === 'Completed')
                return 'status-pending';
            return 'status-notyetpaid';
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        async openReviewModal(booking) {
            this.selectedBooking = booking;
            await this.checkReview(booking._id); // Kiểm tra xem đã có đánh giá chưa
            this.showReviewModal = true;
        },
        closeReviewModal() {
            this.showReviewModal = false;
            this.selectedBooking = null;
            this.resetReviewData();
        },
        resetReviewData() {
            this.reviewData = {
                ratingFood: 1,
                ratingService: 1,
                comment: '',
            };
            this.isReviewExisting = false;
            this.existingReviewId = null;
        },
        async checkReview(bookingId) {
            try {
                const response = await axiosClient.post('http://localhost:3001/reviews/getReviewByUserAndBooking', {
                    bookingId,
                });
                if (response.data.success) {
                    const review = response.data.review;
                    this.reviewData = {
                        ratingFood: review.RATING_FOOD,
                        ratingService: review.RATING_SERVICE,
                        comment: review.COMMENT,
                    };
                    this.isReviewExisting = true;
                    this.existingReviewId = review._id; // Lưu ID của đánh giá hiện tại
                } else {
                    this.isReviewExisting = false;
                    this.existingReviewId = null;
                }
            } catch (error) {
                //console.error('Lỗi khi kiểm tra đánh giá:', error);
                this.isReviewExisting = false;
                this.existingReviewId = null;
            }
        },
        async submitReview() {
            if (this.isReviewExisting) {
                alert('Bạn đã đánh giá cho đơn đặt này rồi.');
                return;
            }

            try {
                const { ratingFood, ratingService, comment } = this.reviewData;
                const bookingId = this.selectedBooking._id;

                const response = await axiosClient.post('http://localhost:3001/reviews/addReview', {
                    bookingId,
                    ratingFood,
                    ratingService,
                    comment,
                });

                if (response.data.success) {
                    this.$message.success('Đánh giá thành công!');
                    this.closeReviewModal();
                    this.fetchBookingHistory(); // Làm mới danh sách sau khi đánh giá
                } else {
                    alert('Lỗi khi đánh giá: ' + response.data.msg);
                }
            } catch (error) {
                console.error('Lỗi khi gửi đánh giá:', error);
                alert('Đã xảy ra lỗi khi gửi đánh giá.');
            }
        },
        async updateReview() {
            try {
                const { ratingFood, ratingService, comment } = this.reviewData;
                const reviewId = this.existingReviewId;

                const response = await axiosClient.put(`http://localhost:3001/reviews/updateReview/${reviewId}`, {
                    ratingFood,
                    ratingService,
                    comment,
                });

                if (response.data.success) {
                    this.$message.success('Cập nhật đánh giá thành công!');
                    this.closeReviewModal();
                    this.fetchBookingHistory(); // Làm mới danh sách sau khi cập nhật đánh giá
                } else {
                    this.$message.error('Lỗi khi cập nhật đánh giá: ' + response.data.msg);
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật đánh giá:', error);
                this.$message.error('Đã xảy ra lỗi khi cập nhật đánh giá.');
            }
        },
        setRating(type, value) {
            this.reviewData[type] = value;
        },
        async repaymentBooking(bookingId, totalPriceBooking) {
            try {
                const paymentResponse = await axiosClient.post(
                    "/payments/create_payment_url",
                    {
                        id: bookingId,
                        totalPrice: totalPriceBooking,
                    }
                );
                if (paymentResponse.data && paymentResponse.data.data.url) {
                    window.open(paymentResponse.data.data.url, "_blank");
                } else {
                    this.$toast.error("Không thể tạo liên kết thanh toán VNPAY.");
                }
            } catch (error) {
                console.error("Lỗi khi đặt bàn:", error);
                this.$toast.error("Đặt bàn thất bại. Vui lòng thử lại.");
            }
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
    position: relative;
    /* Thêm dòng này để phần review-info căn chỉnh theo thẻ này */
    background-color: #f8f9fa;
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding-right: 20px;
    /* Thêm khoảng trống bên phải để không che phần chính */
}

.customer-info p,
.booking-info h3 {
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
    height: 100px;
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

.status-notyetpaid {
    color: #eb0000;
    font-weight: bold;
}

h3 {
    color: #34495E;
}

p {
    color: #34495E;
}

.Money {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.05);
    /* Màu đen mờ */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-overlay-review {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    /* Màu đen mờ */
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

.ListTable {
    border-bottom: 2px solid #333;
    padding: 10px 0;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
}

.table-details img {
    width: 100%;
    max-width: 200px;
    border-radius: 8px;
    margin-top: 10px;
}

.close-button:hover {
    color: #444;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    font-weight: bold;
    color: #555;
    display: block;
    margin-bottom: 10px;
}

.review-button {
    background-color: #f39c12;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.review-button:hover {
    background-color: #e67e22;
}

.payment-button {
    background-color: #208c22;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.payment-button:hover {
    background-color: #46d641;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.submit-button {
    background-color: #7274FF;
    /* Màu chủ đạo */
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:hover {
    background-color: #5a5ec8;
}

.cancel-button {
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cancel-button:hover {
    background-color: #ddd;
}

.star {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
}

.star.selected {
    color: #ffcc00;
}

.form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    resize: none;
    outline: none;
    transition: border-color 0.3s;
}

.form-textarea:focus {
    border-color: #7274FF;
}

.star:hover {
    color: #f39c12;
}

.review-info {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 5px;
    width: 330px;
    text-align: left;
}

.rating-section {
    display: flex;
    align-items: center;
    gap: 5px;
}

.star-rating {
    display: flex;
    gap: 5px;
    font-size: 1.5rem;
}

.star-rating .selected {
    color: #FFD700;
    /* Màu vàng cho sao được chọn */
}

.review-comment {
    color: #333;
    font-style: italic;
    font-size: 14px;
    margin-top: 5px;
}

.close-button {
    padding: 8px 15px;
    background-color: #c0392b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.delete-icon {
    color: #c0392b;
    cursor: pointer;
    margin-left: 10px;
    pointer-events: auto;
}


.delete-icon:hover {
    color: #e74c3c;
}

.delete-button {
    background-color: #F1F1F1;
    color: rgb(252, 0, 0);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: auto;
}

.delete-button i {
    margin-right: 5px;
}

.delete-button:hover {
    background-color: #F1F1F1;
    color: #b59c99;
}

.action-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.button-section {
    display: flex;
    gap: 10px;
}

.detail-button {
    background-color: #30cfcf;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.p-review {
    margin: 0;
}

.review-status {
    display: flex;
    justify-content: space-between;
}

.review-status span {
    font-weight: bold;
    color: rgb(83, 83, 18);
}
</style>