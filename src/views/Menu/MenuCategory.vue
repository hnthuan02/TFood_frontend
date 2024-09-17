<template>
    <div :class="['menu-category', isScrolled ? 'scrolled' : '']" :style="{ marginTop: marginTop }">
        <div class="container">
            <div class="menu-item" v-for="category in categories" :key="category.id">
                <!-- Đưa name lên trên phần image -->
                <a :href="category.url">
                    <span>{{ category.name }}</span> <!-- Name phía trên -->
                    <img :src="category.image" class="thumbnail" />
                </a>
            </div>
        </div>
    </div>
</template>


<script>
import { useRoute } from 'vue-router';
export default {
    name: 'MenuCategory',
    props: {
        isScrolled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            categories: [
                { id: 1, name: 'Món Ngon Phải Thử', url: '/menu/best-seller', image: 'https://i.pinimg.com/564x/50/44/b1/5044b12bdf8f60ce34552b9fec651240.jpg' },
                { id: 2, name: 'Beef Steak', url: '/menu/friedchicken', image: 'https://i.pinimg.com/736x/a6/23/67/a623676f5796b7b345ef051632a3d147.jpg' },
                { id: 3, name: 'Mì Ý', url: '/menu/pasta', image: 'https://i.pinimg.com/736x/0b/da/22/0bda2231163c662d1407d0ce9ca84b17.jpg' },
                { id: 4, name: 'Món Tráng Miệng', url: '/menu/dessert', image: 'https://i.pinimg.com/564x/ac/64/12/ac6412becf871ab6199b395f7372b88f.jpg' },
                { id: 5, name: 'Thức Uống', url: '/menu/drink', image: 'https://i.pinimg.com/736x/24/03/36/2403362ccef7bccb254f0a7447a41631.jpg' }
            ]
        };
    },
    computed: {
        marginTop() {
            const route = useRoute();
            // Nếu là trang best-seller thì giữ margin-top 100px, nếu không thì đặt về 0
            return this.isScrolled || route.path !== '/menu/best-seller' ? '0' : '100px';
        }
    }
};
</script>

<style scoped>
.container {
    background-color: #330505;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 100px;
}

.menu-category {
    background-color: #330505;
    padding: 0px 0;
    position: sticky;
    top: 0;
    z-index: 999;
    margin-top: 100px;
    /* margin-left: 250px;
    margin-right: 250px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px; */
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
    padding: 8px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
    margin: 0 20px;
}

.menu-category .menu-item a {
    display: flex;
    flex-direction: column;
    /* Đặt thành cột để name ở trên image */
    align-items: center;
    /* Căn giữa cả name và image */
    color: #fff;
    text-decoration: none;
}

.menu-category .menu-item a span {
    margin-bottom: 10px;
    /* Tạo khoảng cách giữa name và image */
    font-size: 1rem;
    /* Điều chỉnh kích thước của name */
    font-weight: bold;
}

.menu-category .menu-item:hover {
    color: #330505;
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
        transform: scale(1.1);
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
