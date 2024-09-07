<template>
    <div class="mon-moi-mon-ngon">
        <!-- MenuCategory -->
        <section class="menu-category">
            <MenuCategory />
        </section>

        <!-- Main Content -->
        <main>
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
    </div>
</template>

<script>
import MenuCategory from './MenuCategory.vue'; // Import component

export default {
    name: 'MonMoiMonNgon',
    components: {
        MenuCategory
    },
    data() {
        return {
            dishes: [
                { id: 1, name: 'Món 1', description: 'Mô tả món 1', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
                { id: 2, name: 'Món 2', description: 'Mô tả món 2', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
                { id: 1, name: 'Món 1', description: 'Mô tả món 1', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
                { id: 2, name: 'Món 2', description: 'Mô tả món 2', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
                { id: 1, name: 'Món 1', description: 'Mô tả món 1', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
                { id: 2, name: 'Món 2', description: 'Mô tả món 2', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
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
}
</style>