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

            <div v-if="booking.review" class="review-info">
                <button class="delete-button" @click="deleteReview(booking.review._id)">
                    <i class="fa-solid fa-trash-can"></i>
                </button>

                <div class="rating-section">
                    <p>Đánh giá Món ăn:</p>
                    <div class="star-rating">
                        <span v-for="star in 5" :key="star"
                            :class="{ selected: star <= booking.review.RATING_FOOD }">★</span>
                    </div>
                </div>
                <div class="rating-section">
                    <p>Đánh giá Dịch vụ:</p>
                    <div class="star-rating">
                        <span v-for="star in 5" :key="star"
                            :class="{ selected: star <= booking.review.RATING_SERVICE }">★</span>
                    </div>
                </div>
                <p class="review-comment"><strong>Nhận xét:</strong> {{ booking.review.COMMENT }}</p>
            </div>

            <!-- Nút đánh giá -->
            <div v-if="booking.STATUS === 'Completed'" class="review-section">
                <button @click="openReviewModal(booking)" class="review-button">Đánh giá</button>
            </div>
        </div>

        <!-- Modal đánh giá -->
        <div v-if="showReviewModal" class="modal-overlay">
            <div class="modal-content">
                <h3>Đánh giá Đặt Bàn</h3>
                <form @submit.prevent="isReviewExisting ? updateReview() : submitReview()">
                    <div class="form-group">
                        <label>Đánh giá Món ăn:</label>
                        <div class="star-rating">
                            <span v-for="star in 5" :key="star"
                                :class="['star', { 'selected': star <= reviewData.ratingFood }]"
                                @click="setRating('ratingFood', star)">
                                ★
                            </span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Đánh giá Dịch vụ:</label>
                        <div class="star-rating">
                            <span v-for="star in 5" :key="star"
                                :class="['star', { 'selected': star <= reviewData.ratingService }]"
                                @click="setRating('ratingService', star)">
                                ★
                            </span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="comment">Nhận xét:</label>
                        <textarea v-model="reviewData.comment" id="comment" rows="4" required></textarea>
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="submit-button">
                            {{ isReviewExisting ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
                        </button>
                        <button type="button" @click="closeReviewModal" class="cancel-button">Hủy</button>
                    </div>
                </form>
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
            showReviewModal: false, // Trạng thái hiển thị modal đánh giá
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
        handleDeleteClick(reviewId) {
            console.log("Icon xóa được nhấp với ID:", reviewId);
            this.deleteReview(reviewId);
        },
        async deleteReview(reviewId) {
            console.log("Deleting review with ID:", reviewId); // Kiểm tra reviewId
            const confirmDelete = confirm("Bạn có chắc chắn muốn xóa đánh giá này không?");
            if (!confirmDelete) return;

            console.log("Xóa đánh giá với ID:", reviewId); // Kiểm tra reviewId

            try {
                const response = await axiosClient.delete(`/reviews/delete/${reviewId}`);
                if (response.data.success) {
                    this.$message.success('Đánh giá đã được xóa thành công!');
                    this.fetchBookingHistory(); // Làm mới danh sách sau khi xóa
                } else {
                    this.$message.error('Lỗi khi xóa đánh giá: ' + response.data.msg);
                }
            } catch (error) {
                console.error('Lỗi khi xóa đánh giá:', error);
                this.$message.error('Đã xảy ra lỗi khi xóa đánh giá.');
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
            return status === 'Booked' ? 'status-confirmed' : 'status-pending';
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

h3 {
    color: #34495E;
}

p {
    color: #34495E;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
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

.submit-button {
    background-color: #27ae60;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-button {
    background-color: #c0392b;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
}

.star-rating {
    display: flex;
    gap: 5px;
    margin-bottom: 16px;
}

.star {
    font-size: 24px;
    cursor: pointer;
    color: #ccc;
    transition: color 0.2s;
}

.star.selected {
    color: #f39c12;
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
    width: 280px;
    text-align: left;
}

.rating-section {
    display: flex;
    align-items: center;
    gap: 5px;
}

.star-rating .selected {
    color: #f39c12;
}

.review-comment {
    color: #333;
    font-style: italic;
    font-size: 14px;
    margin-top: 5px;
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
}

.delete-button i {
    margin-right: 5px;
}

.delete-button:hover {
    background-color: #F1F1F1;
    color: #b59c99;
}
</style>