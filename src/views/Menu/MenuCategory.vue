<template>
    <div :class="['menu-category', isScrolled ? 'scrolled' : '']">
        <div class="container">
            <div class="menu-item" v-for="category in categories" :key="category.id">
                <a :href="category.url">{{ category.name }}
                    <img :src="category.image" class="thumbnail" width="100px" />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MenuCategory',
    data() {
        return {
            categories: [
                { id: 1, name: 'Món Ngon Phải Thử', url: '/menu', image: 'https://jollibee.com.vn//media/catalog/category/web-12_1_1.png' },
                { id: 2, name: 'Gà Giòn Vui Vẻ', url: '/ga-gion-vui-ve.html', image: 'https://jollibee.com.vn//media/catalog/category/web-05_1.png' },
                { id: 3, name: 'Mì Ý Jolly', url: '/mi-y-sot-bo-bam.html', image: 'https://jollibee.com.vn//media/catalog/category/web-06.png' },
                { id: 4, name: 'Burger', url: '/burger-com.html', image: 'https://jollibee.com.vn//media/catalog/category/cat_burger_1.png' },
                { id: 5, name: 'Món Tráng Miệng', url: '/mon-trang-mieng.html', image: 'https://jollibee.com.vn//media/catalog/category/trangmieng.png' },
                { id: 6, name: 'Thức Uống', url: '/thuc-uong.html', image: 'https://jollibee.com.vn//media/catalog/category/thucuong.png' }
            ],
            isScrolled: false // Biến trạng thái để kiểm tra cuộn trang
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            const scrollTop = window.scrollY;
            this.isScrolled = scrollTop > 100; // Thay đổi điều kiện theo yêu cầu
        }
    }
};
</script>

<style scoped>
.menu-category {
    background-color: #EE4545;
    padding: 10px 0;
    position: sticky;
    top: 0;
    z-index: 999;
    transition: margin-top 0.5s ease;
    margin-top: 100px;
    margin-left: 250px;
    margin-right: 250px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
}

.menu-category.scrolled {
    margin-top: 0;
}

.menu-category .container {
    display: flex;
    justify-content: center;
    gap: 20px;
    overflow-x: auto;
}

.menu-category .menu-item {
    font-size: 1rem;
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
}

.menu-category .menu-item a {
    color: #fff;
    text-decoration: none;
    display: block;
}

.menu-category .menu-item:hover {
    color: #ee4545;
}

.menu-item {
    color: #fff;
    font-size: 1rem;
    text-align: center;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        color: #ee4545;
    }

    &:hover img {
        transition: transform 0.5s ease, filter 0.5s ease;
        transform: scale(1.2);
        filter: brightness(90%);
    }
}

.MenuPage {
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

    /* Phần category cố định khi cuộn */
    .sticky-category {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
}
</style>
