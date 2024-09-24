<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>Chọn món cho bàn {{ tableInfo.tableInfo.TABLE_NUMBER }}</h2>
            <div class="food-list">
                <div v-for="food in foods" :key="food._id" class="food-item">
                    <img :src="food.IMAGES[0]" :alt="food.NAME" />
                    <div class="food-info">
                        <h4>{{ food.NAME }}</h4>
                        <p>{{ formatPrice(food.PRICE) }}</p>
                        <input type="number" v-model.number="quantities[food._id]" min="0" placeholder="Số lượng" />
                    </div>
                </div>
            </div>
            <button @click="addFoodsToTable">Thêm món</button>
            <button @click="close">Đóng</button>
        </div>
    </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';

export default {
    props: {
        tableInfo: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            foods: [],
            quantities: {},
        };
    },
    async created() {
        await this.fetchFoods();
    },
    methods: {
        async fetchFoods() {
            try {
                const response = await axiosClient.get('/foods/allFood');
                this.foods = response.data;

                // Giả sử bạn có dữ liệu số lượng món ăn đã chọn trước đó
                const selectedQuantities = this.tableInfo.selectedQuantities || {}; // Lấy từ props hoặc một nơi khác

                // Khởi tạo quantities với giá trị từ selectedQuantities hoặc 0 nếu không có
                this.foods.forEach(food => {
                    this.quantities[food._id] = selectedQuantities[food._id] || 0;
                });
            } catch (error) {
                console.error('Lỗi khi lấy danh sách món ăn:', error);
            }
        },

        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        async addFoodsToTable() {
            // Lọc ra các món ăn có số lượng > 0
            const selectedFoods = Object.entries(this.quantities)
                .filter(([foodId, quantity]) => quantity > 0)
                .map(([foodId, quantity]) => ({
                    FOOD_ID: foodId,
                    QUANTITY: quantity,
                }));

            if (selectedFoods.length === 0) {
                alert('Vui lòng chọn ít nhất một món ăn.');
                return;
            }

            try {
                const payload = {
                    tableId: this.tableInfo.TABLE_ID,
                    listFood: selectedFoods, // Gửi danh sách món ăn
                };

                console.log('Payload:', payload); // Kiểm tra payload trước khi gửi

                await axiosClient.post('/carts/addFoodToTable', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                alert('Đã thêm món ăn vào bàn.');
                this.$emit('update-cart');
                this.close();
            } catch (error) {
                console.error('Lỗi khi thêm món ăn vào bàn:', error.response.data);
                alert('Thêm món ăn vào bàn thất bại. Lỗi: ' + error.response.data.message);
            }
        },


        close() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
/* CSS cho modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-height: 80vh;
    overflow-y: auto;
}

.food-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.food-item {
    width: 200px;
    margin: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
}

.food-item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
}

.food-info {
    margin-top: 10px;
}

.food-info h4 {
    margin: 10px 0;
}

.food-info input {
    width: 60px;
    text-align: center;
    margin-top: 5px;
}

button {
    margin: 10px 5px 0 5px;
    padding: 8px 12px;
    background-color: #c0392b;
    color: #FAE8B2;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #a93226;
}
</style>
