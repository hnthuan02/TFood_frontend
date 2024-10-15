<template>
    <div class="food-list">
        <div class="header-section">
            <h2>Danh sách món ăn</h2>

            <!-- Dropdown chọn loại món ăn -->
            <div class="filter-section">
                <div class="select">
                    <select id="food-type" v-model="selectedType" @change="filterFoods">
                        <option value="">Tất cả</option>
                        <option v-for="type in foodTypes" :key="type" :value="type">
                            {{ type }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="filteredFoods.length > 0" class="food-grid">
            <div v-for="food in filteredFoods" :key="food._id" class="food-item">
                <img :src="food.IMAGES[0]" alt="Food Image" class="food-image" />
                <div class="food-info">
                    <h3>{{ food.NAME }}</h3>
                    <p>Loại: {{ food.TYPE }}</p>
                    <p>Giá: {{ formatCurrency(food.PRICE) }}</p>
                    <p>{{ food.DESCRIPTION }}</p>
                </div>
            </div>
        </div>

        <div v-else>
            <p>Không có món ăn nào được tìm thấy.</p>
        </div>
    </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo axiosClient đúng đường dẫn

export default {
    data() {
        return {
            foods: [], // Dữ liệu món ăn
            selectedType: "", // Loại món ăn được chọn
            foodTypes: [], // Danh sách các loại món ăn
        };
    },
    computed: {
        filteredFoods() {
            // Lọc danh sách món ăn dựa trên loại món ăn được chọn
            if (this.selectedType) {
                return this.foods.filter(food => food.TYPE === this.selectedType);
            }
            return this.foods; // Hiển thị tất cả nếu không chọn loại
        }
    },
    mounted() {
        this.fetchFoods(); // Gọi hàm lấy danh sách món ăn khi component được mount
    },
    methods: {
        async fetchFoods() {
            try {
                const response = await axiosClient.get("/foods/allFood");
                this.foods = response.data; // Gán dữ liệu món ăn

                // Lấy danh sách các loại món ăn không trùng lặp
                this.foodTypes = [...new Set(this.foods.map(food => food.TYPE))];
            } catch (error) {
                console.error("Lỗi khi lấy danh sách món ăn:", error);
            }
        },
        filterFoods() {
            // Hàm lọc món ăn sẽ được gọi khi thay đổi loại món ăn
            // Không cần làm gì ở đây vì đã xử lý qua computed property
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    },
};
</script>

<style scoped>
h2 {
    color: black;
}

/* CSS mà bạn cung cấp */
:root {
    --background-gradient: linear-gradient(178deg, #ffff33 10%, #3333ff);
    --gray: #34495e;
    --darkgray: #2c3e50;
}

select {
    appearance: none;
    outline: none;
    border: 0;
    box-shadow: none;
    flex: 1;
    padding: 0 1em;
    color: #ffffff;
    background-color: #2c3e50;
    background-image: none;
    cursor: pointer;
}

/* Remove IE arrow */
select::-ms-expand {
    display: none;
}

/* Custom Select wrapper */
.select {
    position: relative;
    display: flex;
    width: 20em;
    height: 3em;
    border-radius: 0.25em;
    overflow: hidden;
}

/* Arrow */
.select::after {
    content: '\25BC';
    position: absolute;
    top: 0;
    right: 0;
    padding: 1em;
    background-color: #34495e;
    transition: 0.25s all ease;
    pointer-events: none;
}

/* Transition */
.select:hover::after {
    color: #f39c12;
}

body {
    color: #fff;
    background: var(--background-gradient);
}

a {
    font-weight: bold;
    color: var(--gray);
    text-decoration: drop-shadow;
    padding: 0.25em;
    border-radius: 0.50em;
    background: pink;
}

.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.down_note {
    display: flex;
    justify-content: center;
}

/* Các style khác */
.food-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Đặt phần tiêu đề và bộ lọc theo loại món ăn nằm ngang */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.filter-section {
    display: flex;
    align-items: center;
}

.food-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* Mỗi hàng hiển thị 2 thẻ */
    gap: 20px;
}

.food-item {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    align-items: center;
}

.food-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 20px;
}

.food-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

h3 {
    margin: 10px 0;
}
</style>
