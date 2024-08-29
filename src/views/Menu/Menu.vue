<template>
    <div class="mon-moi-mon-ngon">
        <!-- Header -->


        <!-- Main Content -->
        <main>
            <section class="hero">
                <div class="container">
                    <h1>Chào Mừng Bạn Đến Với Jollibee</h1>
                    <p>Khám Phá Các Món Mới Ngon Miệng</p>
                </div>
            </section>

            <section class="new-dishes">
                <div class="container">
                    <h2>Món Mới</h2>
                    <div class="dish-grid">
                        <div class="dish-card" v-for="dish in dishes" :key="dish.id">
                            <img :src="dish.image" :alt="dish.name" />
                            <h3>{{ dish.name }}</h3>
                            <p>{{ dish.description }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer>
            <div class="container">
                <p>&copy; 2024 Jollibee Vietnam. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'MonMoiMonNgon',
    data() {
        return {
            isLoggedIn: false, // Giả lập trạng thái đăng nhập
            dishes: [
                { id: 1, name: 'Món 1', description: 'Mô tả món 1', image: '@/assets/dish1.jpg' },
                { id: 2, name: 'Món 2', description: 'Mô tả món 2', image: '@/assets/dish2.jpg' },
                // Thêm các món khác
            ],
        };
    },
    methods: {
        toggleNavbar() {
            const collapseElement = document.getElementById('navbarSupportedContent');
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: true
            });
            if (collapseElement.classList.contains('show')) {
                bsCollapse.hide();
            } else {
                bsCollapse.show();
            }
        },
        logout() {
            // Xử lý logic đăng xuất ở đây
            console.log('User logged out');
            this.isLoggedIn = false; // Cập nhật trạng thái đăng nhập
        }
    }
};
</script>

<style lang="scss">
.mon-moi-mon-ngon {

    /* Basic styles for the page */
    .hero {
        background: url('@/assets/hero-bg.jpg') no-repeat center center;
        background-size: cover;
        color: #fff;
        text-align: center;
        padding: 60px 0;

        h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }

        p {
            font-size: 1.25rem;
        }
    }

    .new-dishes {
        padding: 60px 0;

        .dish-grid {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;

            .dish-card {
                flex: 1 1 calc(33.333% - 20px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
                text-align: center;

                img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                h3 {
                    margin: 10px 0;
                }

                p {
                    padding: 0 10px;
                }
            }
        }
    }

    footer {
        background: #eee;
        padding: 20px 0;
        text-align: center;
    }
}
</style>