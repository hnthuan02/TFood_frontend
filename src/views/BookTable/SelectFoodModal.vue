<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>{{ modalMode === 'edit' ? 'Chỉnh sửa' : 'Thêm' }} món cho bàn {{ tableInfo.tableInfo.TABLE_NUMBER }}
            </h2>
            <div class="food-list">
                <div v-for="food in displayedFoods" :key="food._id" class="food-item">
                    <img :src="food.IMAGES[0]" :alt="food.NAME" />
                    <div class="food-info">
                        <h4>{{ food.NAME }}</h4>
                        <p>{{ formatPrice(food.PRICE) }}</p>
                        <input type="number" v-model.number="quantities[food._id]" min="0" placeholder="Số lượng" />
                        <button v-if="quantities[food._id] > 0 && modalMode === 'edit'" @click="removeFood(food._id)"
                            class="remove-button">
                            Xóa
                        </button>
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
                alert('Vui lòng chọn ít nhất một món ăn.');
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

                alert('Đã thêm món ăn vào bàn.');
                this.$emit('update-cart');
                this.close();
            } catch (error) {
                console.error('Lỗi khi thêm món ăn vào bàn:', error);
                alert('Thêm món ăn vào bàn thất bại.');
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

                alert('Đã cập nhật số lượng món ăn.');
                this.$emit('update-cart');

                if (selectedFoods.length === 0) {
                    this.close();
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật món ăn:', error);
                alert('Cập nhật món ăn thất bại.');
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

                alert('Đã cập nhật số lượng món ăn.');
                this.$emit('update-cart');

                if (selectedFoods.length === 0) {
                    this.close();
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật món ăn:', error);
                alert('Cập nhật món ăn thất bại.');
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

                alert('Đã xóa món ăn khỏi bàn.');
                this.quantities[foodId] = 0;
                this.$emit('update-cart');
            } catch (error) {
                console.error('Lỗi khi xóa món ăn khỏi bàn:', error);
                alert('Xóa món ăn khỏi bàn thất bại.');
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        },
        close() {
            this.$emit('close');
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
    /* Thay đổi từ 400px thành 90% */
    max-width: 1000px;
    /* Thêm max-width để giới hạn chiều rộng tối đa */
}

.food-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.food-item {
    width: calc(25% - 20px);
    /* Điều chỉnh để có 4 món trên mỗi hàng */
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

.remove-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 6px 10px;
    margin-top: 5px;
    border-radius: 5px;
    cursor: pointer;
}

.remove-button:hover {
    background-color: #c0392b;
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

button:hover {
    background-color: #2980b9;
}
</style>
