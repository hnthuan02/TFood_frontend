<template>
    <div class="contain-voucher-page">

        <div class="voucher-page">
            <p class="page-description">Khám phá những ưu đãi hấp dẫn cho bạn. Nhấn để sao chép mã và tận hưởng!</p>

            <!-- Danh sách các voucher -->
            <div class="voucher-list">
                <div v-for="voucher in vouchers" :key="voucher._id" class="voucher-card">
                    <h3 class="voucher-code">{{ voucher.CODE }}</h3>
                    <p class="voucher-description">{{ voucher.DESCRIPTION }}</p>

                    <p class="voucher-detail">
                        <i class="fas fa-percent detail-icon"></i>
                        Giảm giá: <strong>{{ voucher.DISCOUNT_PERCENT }}%</strong>
                    </p>
                    <p class="voucher-detail">
                        <i class="fas fa-users detail-icon"></i>
                        Số lượt dùng còn lại: <strong>{{ voucher.USAGE_LIMIT }}</strong>
                    </p>
                    <p class="voucher-detail">
                        <i class="fas fa-star detail-icon"></i>
                        Điểm yêu cầu: <strong>{{ voucher.REQUIRED_POINTS }}</strong>
                    </p>
                    <p class="voucher-detail">
                        <i class="fas fa-clock detail-icon"></i>
                        Hạn sử dụng: {{ formatExpirationDate(voucher.EXPIRATION_DATE) }}
                    </p>
                    <button @click="copyVoucherCode(voucher.CODE)" class="btn-copy">
                        <i class="fa-solid fa-copy fa-shake"></i>
                    </button>
                </div>
            </div>

            <!-- Thông báo sao chép thành công -->
            <div v-if="showCopyMessage" class="copy-message">{{ copyMessage }}</div>
        </div>
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
.contain-voucher-page {
    background-image: url(../../assets/bannervoucher.webp);
    background-size: cover;
    background-repeat: no-repeat;
}

.voucher-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: rgba(255, 255, 255, 0.416);
    text-align: center;
    font-family: 'Roboto', sans-serif;
}

.page-title {
    font-size: 2.5rem;
    color: #e74c3c;
    margin-bottom: 10px;
}

.page-description {
    font-size: 1.2rem;
    color: #34495e;
    margin-bottom: 30px;
    font-style: italic;
}

.voucher-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.voucher-card {
    background: linear-gradient(145deg, #FF5F6D, #FFC371);
    border: none;
    border-radius: 15px;
    padding: 20px;
    width: 300px;
    text-align: center;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2), -5px -5px 15px rgba(255, 255, 255, 0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.voucher-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.voucher-code {
    font-size: 1.8rem;
    font-weight: bold;
    color: #eee7ab;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.voucher-description {
    font-size: 1rem;
    color: #ffffff;
    margin-bottom: 15px;
    font-style: italic;
    line-height: 1.4;
}

.voucher-discount,
.voucher-points,
.voucher-expiration {
    font-size: 1rem;
    margin-bottom: 10px;
    color: #2c3e50;
    font-weight: 500;
}

.voucher-discount strong,
.voucher-points strong,
.voucher-expiration strong {
    color: #e74c3c;
}

.btn-copy {
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-copy:hover {
    background-color: #16a085;
    transform: translateY(-2px);
}

.copy-message {
    position: fixed;
    top: 100px;
    left: 45%;
    transform: translateX(-50%);
    background-color: #1abc9c;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    font-size: 1rem;
    opacity: 0.95;
    z-index: 1000;
    animation: fadeInOut 3s ease;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    10% {
        opacity: 1;
        transform: translateY(0);
    }

    90% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-10px);
    }
}

.voucher-detail {
    background: #f9f9f9;
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 500;
}

.detail-icon {
    font-size: 1.2rem;
    color: #e74c3c;
}
</style>
