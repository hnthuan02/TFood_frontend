<template>
    <div class="rating-container">
        <h2>Danh sách đánh giá</h2>
        <div v-if="reviews.length > 0" class="reviews-list">
            <div v-for="review in reviews" :key="review._id" class="review-card">
                <div class="review-header">
                    <h3>{{ review.USER_ID.FULLNAME }}</h3>
                    <span>{{ formatDate(review.createdAt) }}</span>
                </div>
                <div class="review-body">
                    <p><strong>Đánh giá món ăn:</strong> {{ review.RATING_FOOD }}/5</p>
                    <p><strong>Đánh giá dịch vụ:</strong> {{ review.RATING_SERVICE }}/5</p>
                    <p><strong>Bình luận:</strong> {{ review.COMMENT }}</p>
                </div>
                <div class="review-footer">
                    <span :class="{ 'status-active': review.STATUS, 'status-inactive': !review.STATUS }">
                        {{ review.STATUS ? 'Đã duyệt' : 'Chưa duyệt' }}
                    </span>
                    <button class="status-toggle" @click="toggleStatus(review)">
                        {{ review.STATUS ? 'Hủy duyệt' : 'Duyệt' }}
                    </button>
                </div>
            </div>
        </div>
        <p v-else>Không có đánh giá nào.</p>
    </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo đường dẫn đến axiosClient là đúng

export default {
    data() {
        return {
            reviews: [],
        };
    },
    methods: {
        async fetchReviews() {
            try {
                const response = await axiosClient.get("/reviews/getAllReviews");
                if (response.data.success) {
                    this.reviews = response.data.reviews;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đánh giá:", error);
            }
        },
        async toggleStatus(review) {
            try {
                const newStatus = !review.STATUS;
                const response = await axiosClient.post(`/reviews/${review._id}/status`, { status: newStatus });
                if (response.data.success) {
                    review.STATUS = newStatus;
                }
            } catch (error) {
                console.error("Lỗi khi thay đổi trạng thái đánh giá:", error);
            }
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleDateString("vi-VN", options);
        },
    },
    mounted() {
        this.fetchReviews();
    },
};
</script>

<style scoped>
.rating-container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #6d4c41;
    margin-bottom: 20px;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.review-card {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    color: #7274ff;
}

.review-body p {
    margin: 5px 0;
}

.review-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
}

.status-active {
    color: #27ae60;
}

.status-inactive {
    color: #c0392b;
}

.status-toggle {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    background-color: #7274ff;
    transition: background-color 0.3s;
}

.status-toggle:hover {
    background-color: #5b5ed7;
}
</style>
