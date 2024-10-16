<template>
    <div class="food-list">
        <div class="header-section">
            <h2 style="color: black;">Danh sách món ăn</h2>

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
                <button @click="openAddFoodModal" class="add-food-button">Thêm món ăn</button>
            </div>
        </div>

        <div v-if="showModal" class="modal-foodAdmin">
            <div class="modal-content">
                <h3>{{ isEditing ? 'Sửa món ăn' : 'Thêm món ăn mới' }}</h3>
                <form @submit.prevent="isEditing ? updateFood() : createFood()">
                    <div class="form-group">
                        <label for="food-name">Tên món ăn:</label>
                        <input v-model="newFood.NAME" id="food-name" required />
                    </div>
                    <div class="form-group">
                        <label for="food-type">Loại món ăn:</label>
                        <select v-model="newFood.TYPE" class="modal-select" required>
                            <option value="" disabled>Chọn loại món ăn</option>
                            <option value="Steak">Steak</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Drink">Drink</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="food-price">Giá:</label>
                        <input v-model="newFood.PRICE" id="food-price" type="number" required />
                    </div>
                    <div class="form-group">
                        <label for="food-description">Mô tả:</label>
                        <textarea v-model="newFood.DESCRIPTION" id="food-description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="food-image">Hình ảnh (URL):</label>
                        <input v-model="newFood.IMAGES[0]" id="food-image" required />
                    </div>
                    <div class="form-group buttons">
                        <button type="submit" class="save-button">{{ isEditing ? 'Cập nhật' : 'Lưu' }}</button>
                        <button type="button" @click="closeModal" class="cancel-button">Hủy</button>
                    </div>
                </form>
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
                <!-- Nút Sửa và Xóa xuất hiện khi hover -->
                <div class="action-buttons">
                    <button class="edit-button" @click="openEditFoodModal(food)">Sửa</button>
                    <button class="delete-button" @click="deleteFood(food._id)">Xóa</button>
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
            showModal: false, // Trạng thái hiển thị modal
            isEditing: false, // Trạng thái chỉnh sửa hay thêm mới
            editFoodId: null, // ID của món ăn đang được chỉnh sửa
            newFood: {
                NAME: "",
                TYPE: "",
                PRICE: null,
                DESCRIPTION: "",
                IMAGES: [""], // URL hình ảnh
            }, // Thông tin món ăn mới hoặc đang chỉnh sửa
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
        // Mở modal thêm món ăn mới
        openAddFoodModal() {
            this.isEditing = false;
            this.resetNewFood();
            this.showModal = true;
        },
        // Mở modal để chỉnh sửa món ăn
        openEditFoodModal(food) {
            this.isEditing = true;
            this.editFoodId = food._id;
            this.newFood = { ...food }; // Sao chép thông tin món ăn cần sửa vào form
            this.showModal = true;
        },
        // Đóng modal
        closeModal() {
            this.showModal = false;
        },
        // Reset thông tin món ăn mới
        resetNewFood() {
            this.newFood = {
                NAME: "",
                TYPE: "",
                PRICE: null,
                DESCRIPTION: "",
                IMAGES: [""],
            };
        },
        // Tạo món ăn mới
        async createFood() {
            try {
                const response = await axiosClient.post("/foods/createFood", this.newFood);
                if (response.status === 201 || response.status === 200) {
                    this.showModal = false;
                    this.fetchFoods(); // Làm mới danh sách món ăn
                } else {
                    console.error("Lỗi khi thêm món ăn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi thêm món ăn:", error);
            }
        },
        // Cập nhật món ăn
        async updateFood() {
            try {
                const response = await axiosClient.put(`/foods/updateFood/${this.editFoodId}`, this.newFood);
                if (response.status === 200) {
                    this.showModal = false;
                    this.fetchFoods(); // Làm mới danh sách món ăn
                } else {
                    console.error("Lỗi khi cập nhật món ăn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật món ăn:", error);
            }
        },
        // Xóa món ăn
        async deleteFood(foodId) {
            try {
                await axiosClient.delete(`/foods/deleteFood/${foodId}`);
                this.fetchFoods(); // Làm mới danh sách món ăn sau khi xoá thành công
            } catch (error) {
                console.error("Lỗi khi xóa món ăn:", error);
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

<style lang="scss">
@import "./MenuAdmin.scss";
</style>