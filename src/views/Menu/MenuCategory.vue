<template>
    <div class="menu-category-wrapper">
        <div class="menu-category">
            <div class="container">
                <div class="menu-item" v-for="category in categories" :key="category.id">
                    <a :href="category.url">
                        <span>{{ category.name }}</span>
                        <img :src="category.image" class="thumbnail" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
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
                { id: 2, name: 'Beef Steak', url: '/menu/steak', image: 'https://i.pinimg.com/736x/a6/23/67/a623676f5796b7b345ef051632a3d147.jpg' },
                { id: 3, name: 'Mì Ý', url: '/menu/pasta', image: 'https://i.pinimg.com/736x/0b/da/22/0bda2231163c662d1407d0ce9ca84b17.jpg' },
                { id: 4, name: 'Món Tráng Miệng', url: '/menu/dessert', image: 'https://i.pinimg.com/564x/ac/64/12/ac6412becf871ab6199b395f7372b88f.jpg' },
                { id: 5, name: 'Thức Uống', url: '/menu/drink', image: 'https://i.pinimg.com/736x/24/03/36/2403362ccef7bccb254f0a7447a41631.jpg' }
            ]
        };
    },

};
</script>

<style scoped>
.container {
    background-color: #330505;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 100px;
}

.menu-category-wrapper {
    background-color: #2B1B17;
    padding: 0 250px;
    position: sticky;
    top: 0;
    z-index: 998;
}

.menu-category {
    background-color: #330505;
    padding: 0;
    margin-top: 100px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    border-radius: 50px;
    z-index: 999;
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
    align-items: center;
    color: #fff;
    text-decoration: none;
}

.menu-category .menu-item a span {
    margin-bottom: 10px;
    font-size: 1rem;
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
