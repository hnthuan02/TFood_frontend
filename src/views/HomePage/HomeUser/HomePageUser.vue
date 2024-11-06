<template>
    <div>
        <!-- Hero Section -->
        <section class="hero text-center py-5">
            <div class="container-top">
                <h1 class="display-4">Chào mừng đến với TFOOD</h1>
                <p class="lead">Khám phá các món ăn ngon và ưu đãi hấp dẫn của chúng tôi</p>
                <button class="btn-cta">Đặt bàn ngay</button>
            </div>
        </section>

        <!-- About Section -->
        <section class="about-section py-5 text-center">
            <div class="container">
                <h2>Giới thiệu về TFOOD</h2>
                <p class="about-text">TFOOD tự hào mang đến cho bạn những trải nghiệm ẩm thực đỉnh cao, nơi hội tụ hương
                    vị tinh tế và không gian đẳng cấp. Chúng tôi không chỉ phục vụ món ăn, mà còn mang đến những kỷ niệm
                    khó quên.</p>
            </div>
        </section>

        <!-- Product Carousel -->
        <section class="product-carousel py-5">
            <div class="container">
                <div id="carouselExampleCaptions" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="https://assets.architecturaldigest.in/photos/632c2468b1c1612420a1690d/3:2/w_1620,h_1080,c_limit/INDR3006.png"
                                class="d-block w-100 imgcar" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Hương vị tinh hoa, đẳng cấp</h5>
                                <p>Trải nghiệm ẩm thực đỉnh cao với các món ăn chế biến từ nguyên liệu tươi ngon và tinh
                                    tế.</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://images.squarespace-cdn.com/content/v1/60ac14afc57b695813c01b62/1622058935682-K6Q7PP2EK6Z2QSQZ2PLJ/VT+interiors+%2817%29.jpg?format=1500w"
                                class="d-block w-100 imgcar" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Không gian sang trọng, ấm cúng</h5>
                                <p>Thưởng thức bữa ăn trong không gian đẳng cấp, mang lại cảm giác thoải mái và thư
                                    giãn.</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://i.pinimg.com/564x/79/7a/d6/797ad687d33f146a314939d2425764a0.jpg"
                                class="d-block w-100 imgcar" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>Dịch vụ chu đáo, tận tình</h5>
                                <p>Đội ngũ nhân viên chuyên nghiệp, sẵn sàng phục vụ với nụ cười và sự tận tâm.</p>
                            </div>
                        </div>
                        <!-- Các carousel-item khác -->
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

        <!-- Special Dishes Section -->
        <section class="special-dishes py-5">
            <div class="container">
                <h2 class="text-center" style="color: #352C2C;">Món ăn đặc biệt</h2>
                <div class="row">
                    <!-- Các món ăn -->
                    <div class="col-md-4" v-for="(dish, index) in specialDishes" :key="index">
                        <div class="card">
                            <img :src="dish.image" class="card-img-top" :alt="dish.name">
                            <div class="card-body">
                                <h5 class="card-title">{{ dish.name }}</h5>
                                <p class="card-text">{{ dish.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Customer Testimonials Section -->
        <section class="testimonials py-5">
            <div class="container-rating text-center">
                <h2>Khách hàng nói gì về chúng tôi</h2>
                <div class="testimonial-carousel">
                    <!-- Nội dung đánh giá của khách hàng -->
                    <div class="testimonial" v-for="(testimonial, index) in testimonials" :key="index">
                        <p>{{ testimonial.comment }}</p>
                        <h5>{{ testimonial.customerName }}</h5>
                        <p class="rating">Đánh giá trung bình: {{ testimonial.averageRating.toFixed(1) }} / 5</p>
                    </div>
                </div>
            </div>
        </section>


        <!-- Call to Action -->
        <section class="cta-section py-5 text-center">
            <div class="container">
                <h2>Hãy đặt bàn ngay hôm nay!</h2>
                <p>Liên hệ với chúng tôi hoặc đặt bàn để tận hưởng dịch vụ tuyệt vời nhất.</p>
                <button class="btn-cta">Đặt bàn</button>
            </div>
        </section>
    </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo đường dẫn đúng

export default {
    data() {
        return {
            specialDishes: [
                { name: 'Bánh ngọt', description: 'Bánh được làm từ những nguyên liệu thượng hạng.', image: 'https://i.pinimg.com/564x/d1/ba/c3/d1bac35463d539cc055ae7a2ec8adf63.jpg' },
                { name: 'Bò bít tết', description: 'Bò nhập khẩu chế biến vừa chín tới, ngon ngọt.', image: 'https://i.pinimg.com/564x/ad/88/aa/ad88aa0472018d614906eb5fd45d76db.jpg' },
                { name: 'Mì Ý sốt hải sản', description: 'Sợi mì Ý tươi kết hợp với hải sản tươi sống.', image: 'https://i.pinimg.com/564x/f2/e9/d2/f2e9d2ff1394121053423dbe7f76c75b.jpg' },
            ],
            testimonials: [],
        };
    },
    methods: {
        async fetchTopReviews() {
            try {
                const response = await axiosClient.get("http://localhost:3001/reviews/getAllReviews");
                if (response.data.success) {
                    // Sắp xếp đánh giá theo điểm trung bình giảm dần và chỉ lấy 3 đánh giá đầu tiên
                    const sortedReviews = response.data.reviews
                        .map(review => ({
                            ...review,
                            averageRating: (review.RATING_FOOD + review.RATING_SERVICE) / 2
                        }))
                        .sort((a, b) => b.averageRating - a.averageRating)
                        .slice(0, 3);

                    // Gán dữ liệu cho testimonials
                    this.testimonials = sortedReviews.map(review => ({
                        customerName: review.USER_ID.FULLNAME,
                        comment: review.COMMENT,
                        averageRating: review.averageRating
                    }));
                }
            } catch (error) {
                console.error("Lỗi khi lấy đánh giá:", error);
            }
        }
    },
    mounted() {
        this.fetchTopReviews();
    }
};

</script>

<style scoped>
.card-text {
    color: #E1D77D;
}

.imgcar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Giúp ảnh lấp đầy và cắt bớt nếu cần */
    object-position: center;
    /* Đảm bảo trung tâm ảnh được giữ nguyên */
    border-radius: 10px;
    /* Tùy chọn: Bo góc nếu bạn muốn */
}

.carousel-item {
    height: 600px;
}

.container-top {
    background: linear-gradient(to right, rgba(43, 27, 23, 0.8), rgba(60, 47, 47, 0.8)), url('../../../assets/backgroundBannner.webp') no-repeat center center;
    background-size: cover;
    padding: 60px;
    text-align: center;
    color: #ffd700;
}

.btn-cta {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-cta:hover {
    background-color: #c0392b;
}

.about-section {
    background-color: #f8f8f8;
    color: #333;
    padding: 50px 0;
}

.about-section h2 {
    color: #6d4c41;
}

.about-text {
    font-size: 1.1rem;
    max-width: 700px;
    margin: auto;
}

.special-dishes {
    background-color: #f8f9fa;
}

.card {
    margin: 15px 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card img {
    height: 200px;
    object-fit: cover;
}

.card-title {
    color: #e74c3c;
}

.testimonials {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f1f1f1;
    color: #333;
    padding: 50px 0;
}

.testimonials h2 {
    color: #6d4c41;
}

.testimonial-carousel {
    display: flex;
    overflow-x: auto;
    align-items: center;
    justify-content: center;
    gap: 50px;
}

.testimonial {
    flex: 0 0 300px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cta-section {
    background-color: #333;
    color: white;
    padding: 50px 0;
}

.cta-section h2 {
    color: #e74c3c;
}

.cta-section p {
    max-width: 600px;
    margin: 0 auto 20px;
}

.testimonial .rating {
    font-weight: bold;
    color: #e74c3c;
    margin-top: 5px;
}

.container-rating {
    width: 100%;
}
</style>
