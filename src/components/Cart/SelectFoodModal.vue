<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>{{ modalMode === 'edit' ? 'Chỉnh sửa' : 'Thêm' }} món cho bàn {{ tableInfo.tableInfo.TABLE_NUMBER }}
            </h2>

            <!-- Dropdown để lọc món ăn theo loại -->
            <div class="filter-section">
                <label for="food-type" style="color: aliceblue;">Lọc theo loại:</label>
                <select id="food-type" v-model="selectedType" @change="filterFoods">
                    <option value="">Tất cả</option>
                    <option value="Steak">Bít tết</option>
                    <option value="Pasta">Mỳ Ý</option>
                    <option value="Dessert">Tráng miệng</option>
                    <option value="Drink">Đồ uống</option>
                </select>
            </div>

            <div class="food-list">
                <div v-for="food in displayedFoods" :key="food._id" class="food-item">
                    <img :src="food.IMAGES[0]" :alt="food.NAME" class="food-image" />
                    <div class="food-info">
                        <h4>{{ food.NAME }}</h4>
                        <p>{{ formatPrice(food.PRICE) }}</p>
                    </div>
                    <input type="number" v-model.number="quantities[food._id]" min="0" placeholder="Số lượng"
                        class="quantity-input" />
                    <button v-if="quantities[food._id] > 0 && modalMode === 'edit'" @click="removeFood(food._id)"
                        class="remove-button">
                        Xóa
                    </button>
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
            quantities: {},
            selectedType: '',
        };
    },
    async created() {
        await this.fetchFoods();
        this.initializeQuantities();
    },
    computed: {
        displayedFoods() {
            // Lọc món ăn theo loại nếu có
            let filteredFoods = this.foods;

            if (this.selectedType) {
                filteredFoods = filteredFoods.filter(food => food.TYPE === this.selectedType);
            }

            if (this.modalMode === 'edit') {
                const foodIdsInCart = this.tableInfo.LIST_FOOD.map(f => f.FOOD_ID);
                return filteredFoods.filter(food => foodIdsInCart.includes(food._id));
            } else {
                return filteredFoods;
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
        filterFoods() {
            // Hàm này sẽ tự động được gọi khi người dùng thay đổi loại món ăn
            this.selectedType = this.selectedType;
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
    background-image: url('https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg');
    background-size: cover;
    background-position: center;
    padding: 20px;
    border-radius: 8px;
    max-height: 80vh;
    overflow-y: auto;
    width: 50%;
    max-width: 1000px;
}

.food-list {
    display: flex;
    flex-direction: column;
    /* Chuyển thành cột để mỗi món ăn là 1 hàng */
    margin-top: 20px;
}

.food-item {
    display: flex;
    /* Sử dụng flexbox để sắp xếp các thuộc tính theo chiều ngang */
    align-items: center;
    /* Căn giữa theo chiều dọc */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    /* Khoảng cách giữa các món ăn */
    background-color: rgb(255, 255, 255);
}

.food-image {
    width: 100px;
    /* Đặt kích thước hình ảnh */
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 20px;
    /* Khoảng cách giữa hình ảnh và thông tin món ăn */
}

.food-info {
    flex: 1;
    /* Để phần thông tin chiếm hết không gian còn lại */
    margin-right: 20px;
    /* Khoảng cách giữa thông tin và ô nhập số lượng */
}

.quantity-input {
    width: 60px;
    /* Đặt kích thước cho ô nhập số lượng */
    text-align: center;
    /* Căn giữa nội dung */
    margin-right: 10px;
    /* Khoảng cách giữa ô nhập số lượng và nút xóa */
}

.remove-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 6px 10px;
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

.filter-section {
    margin-bottom: 20px;
    margin-left: auto;
}

.filter-section select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-left: 10px;
}
</style>
