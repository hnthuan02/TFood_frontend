<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3 class="footer-title">Thông Tin Liên Hệ</h3>
                    <p class="phone-number">{{ phoneNumber }}</p>
                </div>
                <div class="footer-section">
                    <h3 class="footer-title">Liên Kết</h3>
                    <ul class="footer-links">
                        <li><a href="/about-us">Giới Thiệu</a></li>
                        <li><a href="/contact">Liên Hệ</a></li>
                        <li><a href="/privacy-policy">Chính Sách Bảo Mật</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3 class="footer-title">Theo Dõi Chúng Tôi</h3>
                    <div class="social-icons">
                        <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 TFood. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            phoneNumber: '0934 123 456' // Số điện thoại giao hàng
        };
    }
};
</script>

<style scoped>
.footer {
    background-color: #ee4545;
    /* Màu đỏ chủ đạo */
    color: #ffffff;
    padding: 20px 0;
}

.footer-content {
    display: flex;
    justify-content: space-between;
}

.footer-section {
    flex: 1;
    margin: 0 20px;
}

.footer-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.phone-number {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    /* Màu chữ đỏ */
}

.footer-links {
    list-style: none;
    padding: 0;
}

.footer-links li {
    margin-bottom: 8px;
}

.footer-links a {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: #f8f8f8;
}

.social-icons {
    display: flex;
    gap: 10px;
}

.social-icon {
    color: #ffffff;
    font-size: 24px;
    text-decoration: none;
    transition: color 0.3s;
}

.social-icon:hover {
    color: #f8f8f8;
}

.footer-bottom {
    text-align: center;
    margin-top: 20px;
}

.footer-bottom p {
    margin: 0;
}
</style>