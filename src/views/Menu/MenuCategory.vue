<template>
    <div class="menu-category">
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
            ]
        };
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
    margin-top: 70px;
    margin-left: 250px;
    margin-right: 250px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
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
</style>