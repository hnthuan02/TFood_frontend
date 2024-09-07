<template>
    <ul class="dropdown-menu">
        <li v-for="category in categories" :key="category.id" class="nav-item">
            <a :href="category.url" class="dropdown-item">
                <img :src="category.image" class="thumbnail" width="100px" />
                {{ category.name }}
            </a>
        </li>
    </ul>
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
.dropdown-menu {
    background-color: #d61818;
    border: 1px solid #e51717;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 100%;
    color: #d61818;
    left: 0;
    width: 300px;
    z-index: 1000;
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;
    text-decoration: none;
    color: #100101;
    /* Màu chữ mặc định */
}

.dropdown-item:hover {
    color: #fff;
}

.thumbnail {
    margin-right: 10px;
}
</style>
