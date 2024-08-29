<template>
    <div>


        <!-- Hero Section -->
        <section class="hero bg-primary text-danger text-center py-5">
            <div class="container-top">
                <h1 class="display-4 ">Chào mừng đến với TFOOD</h1>
                <p class="lead">Khám phá các món ăn ngon và ưu đãi hấp dẫn của chúng tôi</p>
                <a href="#" class="btn btn-light btn-lg">Đặt Món Ngay</a>
            </div>
        </section>

        <!-- Product Carousel -->
        <section class="product-carousel py-5">
            <div class="container">
                <h2 class="text-center mb-4">Sản phẩm nổi bật</h2>
                <div id="carouselExampleCaptions" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="https://via.placeholder.com/800x400" class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Sản phẩm 1</h5>
                                <p>Đây là mô tả sản phẩm 1.</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://via.placeholder.com/800x400" class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Sản phẩm 2</h5>
                                <p>Đây là mô tả sản phẩm 2.</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://via.placeholder.com/800x400" class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Sản phẩm 3</h5>
                                <p>Đây là mô tả sản phẩm 3.</p>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>

            </div>
        </section>

        <!-- About Section -->
        <section class="about py-5 bg-light">
            <div class="container">
                <h2 class="text-center mb-4">Về chúng tôi</h2>
                <p class="text-center">KFC Vietnam cam kết cung cấp các sản phẩm chất lượng cao và dịch vụ tuyệt vời.
                    Hãy cùng khám phá các món ăn độc đáo và chương trình khuyến mãi của chúng tôi.</p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer bg-dark text-white text-center py-3">
            <div class="container">
                <p>&copy; 2024 KFC Vietnam. All rights reserved.</p>
                <p><a href="#" class="text-white">Chính sách bảo mật</a> | <a href="#" class="text-white">Điều khoản sử
                        dụng</a></p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    mounted() {
        // Any specific logic on page load
    }
};
</script>

<style scoped>
.container-top {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('../../../assets/bannerBack.png') no-repeat center center;
    background-size: cover;
    padding: 50px;
    border-radius: 10px;
    text-align: center;
    color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.display-4 {
    font-size: 3rem;
    font-weight: 700;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
}

.lead {
    font-size: 1.5rem;
    margin-bottom: 20px;
}

.btn-light {
    background-color: #fff;
    color: #333;
    border: 2px solid #333;
    transition: all 0.3s ease;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
}

.btn-light:hover {
    background-color: #333;
    color: #fff;
    border: 2px solid #fff;
    transform: scale(1.1);
}

/* Header Styles */
.header {
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar {
    padding: 1rem;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-link {
    margin-left: 1rem;
}

/* Hero Section Styles */
.hero {
    background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('../../../assets/bannerBack.png') no-repeat center center;
    background-size: cover;
    color: white;
}


.hero h1 {
    font-size: 3rem;
    font-weight: bold;
}

.hero p {
    font-size: 1.25rem;
}

/* Carousel Styles */
.product-carousel .carousel-inner img {
    width: 100%;
    height: auto;
}

/* About Section Styles */
.about {
    padding: 2rem 0;
}

/* Footer Styles */
.footer {
    background-color: #343a40;
}

.footer p {
    margin: 0;
}
</style>