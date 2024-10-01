<template>
    <div>
        <!-- Hero Section -->
        <section class="hero text-center py-5">
            <div class="container-top">
                <h1 class="display-4">Chào mừng đến với TFOOD</h1>
                <p class="lead">Khám phá các món ăn ngon và ưu đãi hấp dẫn của chúng tôi</p>
            </div>
        </section>

        <!-- Product Carousel -->
        <section class="product-carousel py-5">
            <div class="container">
                <div id="carouselExampleCaptions" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="https://assets.architecturaldigest.in/photos/632c2468b1c1612420a1690d/3:2/w_1620,h_1080,c_limit/INDR3006.png"
                                class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Hương vị tinh hoa, đẳng cấp</h5>
                                <p>Trải nghiệm ẩm thực đỉnh cao với các món ăn chế biến từ nguyên liệu tươi ngon và tinh
                                    tế.</p>

                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://images.squarespace-cdn.com/content/v1/60ac14afc57b695813c01b62/1622058935682-K6Q7PP2EK6Z2QSQZ2PLJ/VT+interiors+%2817%29.jpg?format=1500w"
                                class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Không gian sang trọng, ấm cúng</h5>
                                <p>Thưởng thức bữa ăn trong không gian đẳng cấp, mang lại cảm giác thoải mái và thư
                                    giãn.</p>

                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://www.hoteljob.vn/uploads/images/2023/03/09/64099b11c6a500_88785066_crop_1170_400_100.jpg"
                                class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Dịch vụ chu đáo, tận tình</h5>
                                <p>Đội ngũ nhân viên chuyên nghiệp, sẵn sàng phục vụ với nụ cười và sự tận tâm.</p>

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
/* Phong cách sang trọng với tông màu đỏ thẳm */
.container-top {
    background: linear-gradient(to right, rgba(43, 27, 23, 0.8), rgba(60, 47, 47, 0.8)), url('../../../assets/backgroundBannner.webp') no-repeat center center;
    background-size: cover;
    padding: 60px;
    text-align: center;
    color: #ffd700;
    /* Màu chữ vàng nhạt */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

h1,
p,
.lead,
h5 {
    color: #FAE8B2;
}

.display-4 {
    font-size: 3.5rem;
    font-weight: 700;
    text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.7);
    font-family: 'Playfair Display', serif;
    /* Font sang trọng */
}

.lead {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #FAE8B2;
    /* Màu vàng nhạt */
    font-family: 'Playfair Display', serif;
}

.hero {
    padding: 100px 0;
    background: linear-gradient(to right, #ffffff, #2b1b17);
    /* Màu nền đỏ thẳm */
    color: #ffd700;
}

.hero h1,
.hero p {
    margin-bottom: 20px;
}

.btn-light {
    background-color: #ffd700;
    color: #2b1b17;
    border: 2px solid #ffd700;
    transition: all 0.3s ease;
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: bold;
    font-family: 'Playfair Display', serif;
}

.btn-light:hover {
    background-color: #a93226;
    color: #fff;
    border: 2px solid #a93226;
    transform: scale(1.1);
}

.product-carousel {
    background-color: #ffffff;
}

.product-carousel .carousel-inner img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.carousel-caption {
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 8px;
    color: #ffd700;
    font-family: 'Playfair Display', serif;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    filter: invert(100%);
}

.about {
    padding: 50px 20px;
    background: #2b1b17;
    color: #ffd700;

    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

h2 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: 'Playfair Display', serif;
}

.about p {
    font-size: 1.2rem;
    line-height: 1.6;
}
</style>
