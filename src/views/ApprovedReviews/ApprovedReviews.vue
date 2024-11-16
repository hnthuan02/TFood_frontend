<template>
    <div class="reviews-container">
        <div class="approved-reviews-container">

            <!-- Thống kê đánh giá -->
            <div class="statistics">
                <!-- Thống kê đánh giá món ăn -->
                <div class="average-rating">
                    <h4>Đánh giá món ăn</h4>
                    <div class="star-rating-wrapper">
                        <div class="star-rating rating2">
                            <span v-for="star in 5" :key="star" class="star" :class="{
                                filled: star <= Math.floor(averageFoodRating),
                                'half-filled': star === Math.ceil(averageFoodRating) && !Number.isInteger(averageFoodRating)
                            }">★</span>
                        </div>
                        <span class="average-score-value">{{ averageFoodRating.toFixed(1) }}</span>
                    </div>
                    <span class="average-score">Dựa trên {{ totalFoodReviews }} đánh giá</span>
                    <div class="rating-breakdown">
                        <div v-for="(count, rating) in foodRatingCounts" :key="rating" class="rating-bar">
                            <span>{{ rating }} sao</span>
                            <div class="bar">
                                <div class="filled-bar" :style="{ width: getRatingPercentage(count) + '%' }"></div>
                            </div>
                            <span>{{ getRatingPercentage(count) }}%</span>
                        </div>
                    </div>
                </div>

                <!-- Thống kê đánh giá dịch vụ -->
                <div class="average-rating">
                    <h4>Đánh giá dịch vụ</h4>
                    <div class="star-rating-wrapper">
                        <div class="star-rating rating2">
                            <span v-for="star in 5" :key="star" class="star" :class="{
                                filled: star <= Math.floor(averageServiceRating),
                                'half-filled': star === Math.ceil(averageServiceRating) && !Number.isInteger(averageServiceRating)
                            }">★</span>
                        </div>
                        <span class="average-score-value">{{ averageServiceRating.toFixed(1) }}</span>
                    </div>
                    <span class="average-score">Dựa trên {{ totalServiceReviews }} đánh giá</span>
                    <div class="rating-breakdown">
                        <div v-for="(count, rating) in serviceRatingCounts" :key="rating" class="rating-bar">
                            <span>{{ rating }} sao</span>
                            <div class="bar">
                                <div class="filled-bar" :style="{ width: getRatingPercentage(count) + '%' }"></div>
                            </div>
                            <span>{{ getRatingPercentage(count) }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bộ lọc đánh giá -->
            <div class="filter">
                <label>Lọc theo sao cho món ăn:</label>
                <select v-model="selectedFoodStar" @change="filterReviews">
                    <option value="">Tất cả</option>
                    <option v-for="star in [5, 4, 3, 2, 1]" :key="star" :value="star">{{ star }} sao</option>
                </select>

                <label>Lọc theo sao cho dịch vụ:</label>
                <select v-model="selectedServiceStar" @change="filterReviews">
                    <option value="">Tất cả</option>
                    <option v-for="star in [5, 4, 3, 2, 1]" :key="star" :value="star">{{ star }} sao</option>
                </select>
            </div>

            <!-- Danh sách đánh giá -->
            <div v-if="currentPageReviews.length > 0" class="reviews-list">
                <div v-for="review in currentPageReviews" :key="review._id" class="review-card">
                    <div class="review-header">
                        <h3>{{ review.USER_ID.FULLNAME }}</h3>
                        <span>{{ formatDate(review.createdAt) }}</span>
                    </div>
                    <div class="review-content">
                        <!-- Phần điểm đánh giá -->
                        <div class="review-ratings">
                            <!-- Đánh giá món ăn -->
                            <p><strong>Đánh giá món ăn:</strong></p>
                            <div class="star-rating">
                                <span v-for="star in 5" :key="star" class="star"
                                    :class="{ filled: star <= review.RATING_FOOD }">★</span>
                            </div>

                            <!-- Đánh giá dịch vụ -->
                            <p><strong>Đánh giá dịch vụ:</strong></p>
                            <div class="star-rating">
                                <span v-for="star in 5" :key="star" class="star"
                                    :class="{ filled: star <= review.RATING_SERVICE }">★</span>
                            </div>
                        </div>

                        <!-- Phần bình luận -->
                        <div class="review-comment">
                            <p><strong>Bình luận:</strong> {{ review.COMMENT }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else>Không có đánh giá nào phù hợp.</p>
            <div class="pagination">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">❮</button>
                <span v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
                    @click="changePage(page)">
                    {{ page }}
                </span>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">❯</button>
            </div>

        </div>
    </div>

</template>

<script>
import axiosClient from "../../api/axiosClient"; // Đảm bảo đường dẫn đến axiosClient là đúng

export default {
    data() {
        return {
            reviews: [],
            selectedFoodStar: "",
            selectedServiceStar: "",
            filteredReviews: [],
            currentPage: 1, // Trang hiện tại
            itemsPerPage: 3,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredReviews.length / this.itemsPerPage);
        },
        currentPageReviews() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.filteredReviews.slice(startIndex, endIndex);
        },
        // Tính điểm đánh giá trung bình món ăn
        averageFoodRating() {
            const totalFoodRating = this.reviews.reduce((sum, review) => sum + review.RATING_FOOD, 0);
            return this.reviews.length ? totalFoodRating / this.reviews.length : 0;
        },
        // Tính điểm đánh giá trung bình dịch vụ
        averageServiceRating() {
            const totalServiceRating = this.reviews.reduce((sum, review) => sum + review.RATING_SERVICE, 0);
            return this.reviews.length ? totalServiceRating / this.reviews.length : 0;
        },
        // Thống kê số lượng đánh giá theo sao cho món ăn
        foodRatingCounts() {
            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            this.reviews.forEach((review) => {
                if (counts[review.RATING_FOOD] !== undefined) {
                    counts[review.RATING_FOOD]++;
                }
            });
            return counts;
        },
        // Thống kê số lượng đánh giá theo sao cho dịch vụ
        serviceRatingCounts() {
            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            this.reviews.forEach((review) => {
                if (counts[review.RATING_SERVICE] !== undefined) {
                    counts[review.RATING_SERVICE]++;
                }
            });
            return counts;
        }
    },
    methods: {
        async fetchApprovedReviews() {
            try {
                const response = await axiosClient.get("/reviews/approved");
                if (response.data.success) {
                    this.reviews = response.data.reviews;
                    this.filteredReviews = this.reviews;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đánh giá đã duyệt:", error);
            }
        },
        filterReviews() {
            this.filteredReviews = this.reviews.filter((review) => {
                const matchesFood = this.selectedFoodStar
                    ? review.RATING_FOOD === parseInt(this.selectedFoodStar)
                    : true;
                const matchesService = this.selectedServiceStar
                    ? review.RATING_SERVICE === parseInt(this.selectedServiceStar)
                    : true;
                return matchesFood && matchesService;
            });
            this.currentPage = 1; // Reset về trang đầu khi lọc
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleDateString("vi-VN", options);
        },
        getRatingPercentage(count) {
            return Math.round((count / this.reviews.length) * 100);
        }
    },
    mounted() {
        this.fetchApprovedReviews();
    },
};
</script>

<style scoped>
.reviews-container {
    background-image: url(../../assets/rating3.webp);
}

.approved-reviews-container {
    background-color: rgba(255, 255, 255, 0.8) !important;
    /* Đảm bảo áp dụng */
    padding: 20px;
    max-width: 800px;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


h2 {
    text-align: center;
    color: #0b4e5d;
    margin-bottom: 20px;
}

.statistics {
    background-color: #E6F4F1;
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    border-radius: 20px;
    padding-top: 10px;
}



.average-rating {
    text-align: center;
    margin-bottom: 20px;


}

.star-rating {
    font-size: 20px;
}

.star {
    color: #ddd;
    position: relative;
}

.star.filled {
    color: #ffd700;
}

.star.half-filled {
    background: linear-gradient(to right, #ffd700 50%, #ddd 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.rating-breakdown {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.rating-bar {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bar {
    background-color: #e0e0e0;
    width: 100px;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
}

.filled-bar {
    background-color: #e3f636;
    height: 100%;
}

.filter {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.filter label {
    color: rgb(0, 0, 0);
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.filter select {
    appearance: none;
    background-color: #64bcb8;
    /* Màu nền xanh tối */
    color: white;
    font-size: 16px;
    font-weight: bold;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    outline: none;
    width: 150px;
    /* Đảm bảo kích thước đẹp */
    position: relative;
}

.filter select:focus {
    box-shadow: 0 0 5px #0d9488;
    /* Hiệu ứng tập trung */
}

.filter select option {
    background-color: #83d9d9;
    /* Màu nền tùy chọn */
    color: white;
}

.filter select::after {
    content: "▼";
    /* Biểu tượng mũi tên */
    position: absolute;
    right: 10px;
    font-size: 12px;
    pointer-events: none;
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

.review-content {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
}

.review-ratings {
    flex: 1;
    max-width: 250px;
    /* Đặt kích thước tối đa để giới hạn chiều rộng của phần đánh giá */
}

.review-comment {
    flex: 2;
    padding-left: 20px;
    border-left: 2px solid #e0e0e0;
    /* Đường kẻ giữa phần đánh giá và bình luận */
    color: #555;
}

.review-body p {
    margin: 5px 0;
}

.star-rating {
    display: flex;
    font-size: 20px;
}

.star {
    color: #ddd;
}

.star.filled {
    color: #ffd700;
}

p {
    margin: 0;
}

.rating2 {
    justify-content: center;
}

.star-rating-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.average-score-value {
    font-size: 1.1rem;
    color: #0c1355;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    background-color: #e6f4f1;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination button,
.pagination span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: none;
    background-color: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

.pagination button.disabled,
.pagination button:disabled {
    background-color: #ddd;
    color: #aaa;
    cursor: not-allowed;
}

.pagination button:hover:not(:disabled),
.pagination span:hover {
    background-color: #25a18e;
    color: white;
}

.pagination span.active {
    background-color: #25a18e;
    color: white;
    font-weight: bold;
    cursor: default;
}
</style>
