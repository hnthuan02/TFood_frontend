<template>
    <div class="rating-container">
        <div class="header-container">
            <h2>Danh sách đánh giá</h2>
            <select v-model="selectedStatus" @change="filteredReviews" class="status-filter">
                <option value="all">Tất cả</option>
                <option value="approved">Đã duyệt</option>
                <option value="pending">Chưa duyệt</option>
            </select>
        </div>

        <div v-if="filteredReviews.length > 0" class="table-container">
            <table class="reviews-table">
                <thead>
                    <tr>
                        <th>Người dùng</th>
                        <th>Ngày</th>
                        <th>Đánh giá món ăn</th>
                        <th>Đánh giá dịch vụ</th>
                        <th>Bình luận</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="review in filteredReviews" :key="review._id">
                        <td>{{ review.USER_ID.FULLNAME }}</td>
                        <td>{{ formatDate(review.createdAt) }}</td>
                        <td>{{ review.RATING_FOOD }}/5</td>
                        <td>{{ review.RATING_SERVICE }}/5</td>
                        <td>{{ review.COMMENT }}</td>
                        <td :class="{ 'status-active': review.STATUS, 'status-inactive': !review.STATUS }">
                            {{ review.STATUS ? 'Đã duyệt' : 'Chưa duyệt' }}
                        </td>
                        <td>
                            <button class="status-toggle" @click="toggleStatus(review)">
                                {{ review.STATUS ? 'Ẩn' : 'Duyệt' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
            selectedStatus: "all",
        };
    },
    computed: {
        filteredReviews() {
            if (this.selectedStatus === "approved") {
                return this.reviews.filter(review => review.STATUS === true);
            } else if (this.selectedStatus === "pending") {
                return this.reviews.filter(review => review.STATUS === false);
            }
            return this.reviews;
        }
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
    max-width: 1200px;
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

.table-container {
    margin-top: 20px;
    overflow-x: auto;
}

.reviews-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

.reviews-table th,
.reviews-table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
}

.reviews-table th {
    background-color: #f2f2f2;
    color: #34495E;
    font-weight: bold;
}

.status-active {
    width: 92px;
    color: #27ae60;
    font-weight: bold;
}

.status-inactive {
    width: 92px;
    color: #c0392b;
    font-weight: bold;
}

.status-toggle {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    background-color: #7274ff;
    transition: background-color 0.3s;
    width: 66px;
}

.status-toggle:hover {
    background-color: #5b5ed7;
}

.header-container select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    color: #34495E;
    transition: border-color 0.2s;
    background-color: white;
    width: 20%;
    margin-bottom: 10px;
}
</style>
