<template>
    <div class="voucher-page">
        <p class="page-description">Khám phá những ưu đãi hấp dẫn cho bạn. Nhấn để sao chép mã và tận hưởng!</p>

        <!-- Danh sách các voucher -->
        <div class="voucher-list">
            <div v-for="voucher in vouchers" :key="voucher._id" class="voucher-card">
                <h3 class="voucher-code">{{ voucher.CODE }}</h3>
                <p class="voucher-description">{{ voucher.DESCRIPTION }}</p>
                <p class="voucher-discount">Giảm giá: <strong>{{ voucher.DISCOUNT_PERCENT }}%</strong></p>
                <p class="voucher-points">Số lượt dùng còn lại: <strong>{{ voucher.USAGE_LIMIT }}</strong></p>
                <p class="voucher-points">Điểm yêu cầu: <strong>{{ voucher.REQUIRED_POINTS }}</strong></p>
                <p class="voucher-expiration">
                    Hạn sử dụng: {{ formatExpirationDate(voucher.EXPIRATION_DATE) }}
                </p>
                <button @click="copyVoucherCode(voucher.CODE)" class="btn-copy">
                    Sao chép mã
                </button>
            </div>
        </div>

        <!-- Thông báo sao chép thành công -->
        <div v-if="showCopyMessage" class="copy-message">{{ copyMessage }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Voucher',
    data() {
        return {
            vouchers: [], // Danh sách voucher
            copyMessage: '', // Thông báo sao chép mã
            showCopyMessage: false, // Hiển thị thông báo sao chép
        };
    },
    mounted() {
        this.fetchVouchers();
    },
    methods: {
        async fetchVouchers() {
            try {
                const response = await axios.get('http://localhost:3001/vouchers/getAll');
                if (response.data.success) {
                    // Lọc các voucher có STATUS là true
                    this.vouchers = response.data.data.filter(voucher => voucher.STATUS === true);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách voucher:", error);
            }
        },
        copyVoucherCode(code) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    this.copyMessage = `Đã sao chép mã: ${code}`;
                    this.showCopyMessage = true;
                    setTimeout(() => {
                        this.showCopyMessage = false;
                    }, 1000); // Hiển thị thông báo trong 1 giây
                })
                .catch(err => {
                    console.error("Lỗi khi sao chép mã:", err);
                });
        },
        formatExpirationDate(date) {
            return new Date(date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        },
    },
};
</script>

<style scoped>
.voucher-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #fdfdfd;
    text-align: center;
}

.page-title {
    font-size: 2.5rem;
    color: #e74c3c;
    margin-bottom: 10px;
}

.page-description {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 30px;
}

.voucher-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.voucher-card {
    background: linear-gradient(135deg, #f39c12, #e74c3c);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.voucher-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.voucher-code {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10px;
}

.voucher-description {
    font-size: 1rem;
    margin-bottom: 15px;
    font-style: italic;
}

.voucher-discount,
.voucher-points,
.voucher-expiration {
    font-size: 1rem;
    margin-bottom: 8px;
}

.btn-copy {
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-copy:hover {
    background-color: #27ae60;
}

.copy-message {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    font-size: 1.1rem;
    opacity: 0.9;
    transition: opacity 0.5s ease;
    z-index: 1000;
}
</style>
