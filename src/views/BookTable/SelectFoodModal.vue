<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>{{ modalMode === 'edit' ? 'Chỉnh sửa' : 'Thêm' }} món cho bàn {{ tableInfo.tableInfo.TABLE_NUMBER }}
            </h2>

            <!-- Danh sách món ăn -->
            <div class="food-list">
                <div v-for="food in displayedFoods" :key="food._id" class="food-item">
                    <img :src="food.IMAGES[0]" :alt="food.NAME" />
                    <div class="food-info">
                        <h4>{{ food.NAME }}</h4>
                        <p>{{ formatPrice(food.PRICE) }}</p>
                        <div class="quantity-selector">
                            <button @click="decreaseQuantity(food._id)" class="quantity-button">-</button>
                            <span class="quantity-display">{{ quantities[food._id] || 0 }}</span>
                            <button @click="increaseQuantity(food._id)" class="quantity-button">+</button>
                        </div>
                        <button v-if="quantities[food._id] > 0 && modalMode === 'edit'" @click="removeFood(food._id)"
                            class="remove-button">Xóa</button>
                    </div>
                </div>
            </div>

            <!-- Phần chọn dịch vụ -->
            <h3>Chọn dịch vụ</h3>
            <div class="service-list">
                <div v-for="service in services" :key="service._id" class="service-item">
                    <input type="checkbox" :value="service._id" v-model="selectedServiceIds" />
                    <label>{{ service.serviceName }} - {{ formatPrice(service.servicePrice) }}</label>
                </div>
            </div>

            <!-- Nút lưu thay đổi -->
            <button @click="saveChanges">{{ modalMode === 'edit' ? 'Lưu thay đổi' : 'Thêm món' }}</button>
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
        modalMode: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            foods: [],
            services: [], // Danh sách dịch vụ
            quantities: {},
            selectedServiceIds: [],
        };
    },
    async created() {
        await this.fetchFoods();
        await this.fetchServices();
        this.initializeQuantities();
    },
    computed: {
        displayedFoods() {
            if (this.modalMode === 'edit') {
                const foodIdsInCart = this.tableInfo.LIST_FOOD.map(f => f.FOOD_ID);
                return this.foods.filter(food => foodIdsInCart.includes(food._id));
            } else {
                return this.foods;
            }
        },
    },
    watch: {
        tableInfo() {
            this.initializeQuantities();
        },
    },
    methods: {
        async fetchFoods() {
            try {
                const response = await axiosClient.get('/foods/allFood');
                this.foods = response.data;
                this.initializeQuantities();
            } catch (error) {
                console.error('Lỗi khi lấy danh sách món ăn:', error);
            }
        },
        async fetchServices() {
            try {
                const response = await axiosClient.get('/serviceTables/services?type=Normal');
                this.services = response.data; // Giả sử response trả về danh sách dịch vụ
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            }
        },
        initializeQuantities() {
            this.quantities = {};
            if (this.tableInfo && this.tableInfo.LIST_FOOD) {
                this.tableInfo.LIST_FOOD.forEach(foodInCart => {
                    this.quantities[foodInCart.FOOD_ID] = foodInCart.QUANTITY || 0;
                });
            } else {
                this.foods.forEach(food => {
                    this.quantities[food._id] = 0;
                });
            }
        },
        async saveChanges() {
            if (this.modalMode === 'edit') {
                this.updateFoodsInTable();
            } else {
                this.addFoodsToTable();
            }
        },
        async addFoodsToTable() {
            const selectedFoods = Object.entries(this.quantities)
                .filter(([foodId, quantity]) => quantity > 0)
                .map(([foodId, quantity]) => ({
                    FOOD_ID: foodId,
                    QUANTITY: quantity,
                }));

            if (selectedFoods.length === 0) {
                this.$message.error('Vui lòng chọn ít nhất một món ăn.');
                return;
            }

            try {
                const payload = {
                    tableId: this.tableInfo.TABLE_ID,
                    listFood: selectedFoods,
                };

                await axiosClient.post('/carts/addFoodToTable', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                this.$message.success('Đã thêm món ăn vào bàn.');
                this.$emit('update-cart');
                this.close();
            } catch (error) {
                console.error('Lỗi khi thêm món ăn vào bàn:', error);
                this.$message.error('Thêm món ăn vào bàn thất bại.');
            }
        },
        async updateFoodsInTable() {
            const selectedFoods = Object.entries(this.quantities)
                .filter(([foodId, quantity]) => quantity > 0)
                .map(([foodId, quantity]) => ({
                    foodId,
                    newQuantity: quantity,
                }));

            try {
                for (const food of selectedFoods) {
                    const payload = {
                        tableId: this.tableInfo.TABLE_ID,
                        foodId: food.foodId,
                        newQuantity: food.newQuantity,
                    };
                    await axiosClient.put('/carts/updateFoodInTable', payload, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                }

                this.$message.success('Đã cập nhật số lượng món ăn.');
                this.$emit('update-cart');
                this.close();
            } catch (error) {
                console.error('Lỗi khi cập nhật món ăn:', error);
                this.$message.error('Cập nhật món ăn thất bại.');
            }
        },
        async removeFood(foodId) {
            try {
                const payload = {
                    tableId: this.tableInfo.TABLE_ID,
                    foodId,
                };
                await axiosClient.post('/carts/removeFoodFromTable', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                this.$message.success('Đã xóa món ăn khỏi bàn.');
                this.quantities[foodId] = 0;
                this.$emit('update-cart');
            } catch (error) {
                console.error('Lỗi khi xóa món ăn khỏi bàn:', error);
                this.$message.error('Xóa món ăn khỏi bàn thất bại.');
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        close() {
            this.$emit('close');
        },
        increaseQuantity(foodId) {
            this.quantities[foodId] = (this.quantities[foodId] || 0) + 1; // Tăng số lượng
        },
        decreaseQuantity(foodId) {
            if (this.quantities[foodId] > 0) {
                this.quantities[foodId] -= 1; // Giảm số lượng
            }
        },
    },
};
</script>

<style scoped>
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
    width: 90%;
    max-width: 1000px;
}

.food-list {
    display: flex;
    flex-direction: column;
    /* Hiển thị theo hàng dọc */
    gap: 10px;
}

.food-item {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
}

.food-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 10px;
}

.food-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.food-info h4 {
    margin: 0;
}

.quantity-selector {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.quantity-button {
    width: 30px;
    height: 30px;
    background-color: #f9f9f9;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 20px;
    transition: background-color 0.3s ease;
}

.quantity-display {
    margin: 0 10px;
    font-size: 18px;
    width: 30px;
    text-align: center;
}

.remove-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 6px 10px;
    margin-top: 5px;
    border-radius: 5px;
    cursor: pointer;
}

button {
    margin: 10px 5px 0 5px;
    padding: 8px 12px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
