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
                            {{ translateType(type) }}
                        </option>
                    </select>
                </div>

                <!-- Dropdown sắp xếp theo số lượng đặt hàng -->
                <div class="select">
                    <select v-model="sortOption" @change="sortFoods">
                        <option value="">Sắp xếp</option>
                        <option value="most-ordered">Bán chạy nhất</option>
                        <option value="least-ordered">Bán ít nhất</option>
                    </select>
                </div>

                <button @click="openAddFoodModal" class="add-food-button">Thêm món ăn</button>
            </div>

        </div>

        <div v-if="loading" class="spinner-overlay">
            <div class="spinner"></div>
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
                            <option value="Steak">Bít tết</option>
                            <option value="Pasta">Mỳ Ý</option>
                            <option value="Dessert">Tráng miệng</option>
                            <option value="Drink">Đồ uống</option>
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
                        <label for="image-input-type">Chọn cách nhập hình ảnh:</label>
                        <select v-model="imageInputType" id="image-input-type" @change="resetImageFields" required>
                            <option value="file">Chọn file</option>
                            <option value="url">Nhập URL</option>
                        </select>
                    </div>

                    <div class="form-group" v-if="imageInputType === 'file'">
                        <label for="food-image">Hình ảnh:</label>
                        <input type="file" @change="handleFileUpload" id="food-image" accept="image/*" required />
                    </div>

                    <div class="form-group" v-if="imageInputType === 'url'">
                        <label for="food-image-url">Hình ảnh (URL):</label>
                        <input v-model="newFood.IMAGES[0]" id="food-image-url" required />
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
                    <p>Loại: {{ translateType(food.TYPE) }}</p>
                    <p>Giá: {{ formatCurrency(food.PRICE) }}</p>
                    <p>{{ food.DESCRIPTION }}</p>
                    <p><strong>Số lần đặt:</strong> {{ food.totalQuantity }}</p>
                </div>
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
            sortOption: "",
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
            imagePreview: "",
            imageInputType: 'url',
            loading: false, // Trạng thái loading
        };
    },
    computed: {
        filteredFoods() {
            // Lọc danh sách món ăn dựa trên loại món ăn được chọn
            let filtered = this.foods;
            if (this.selectedType) {
                filtered = filtered.filter(food => food.TYPE === this.selectedType);
            }

            // Sắp xếp danh sách món ăn theo lựa chọn
            if (this.sortOption === "most-ordered") {
                filtered.sort((a, b) => b.totalQuantity - a.totalQuantity);
            } else if (this.sortOption === "least-ordered") {
                filtered.sort((a, b) => a.totalQuantity - b.totalQuantity);
            }

            return filtered;
        }
    },
    mounted() {
        this.fetchFoods(); // Gọi hàm lấy danh sách món ăn khi component được mount
    },
    methods: {
        sortFoods() {
            this.filteredFoods();
        },
        translateType(type) {
            switch (type) {
                case "Steak":
                    return "Bít tết";
                case "Pasta":
                    return "Mỳ Ý";
                case "Dessert":
                    return "Tráng miệng";
                case "Drink":
                    return "Đồ uống";
                default:
                    return type;
            }
        },
        resetImageFields() {
            // Reset hình ảnh mỗi khi người dùng thay đổi kiểu nhập hình ảnh
            if (this.imageInputType === 'file') {
                this.newFood.IMAGES = [""];
                this.imagePreview = "";
            } else if (this.imageInputType === 'url') {
                this.imagePreview = ""; // Xóa preview nếu nhập bằng URL
            }
        },
        handleFileUpload(event) {
            const files = event.target.files; // Lấy tất cả tệp đã chọn
            this.newFood.IMAGES = []; // Đặt lại mảng IMAGES

            for (let i = 0; i < files.length; i++) {
                this.newFood.IMAGES.push(files[i]); // Thêm từng tệp vào mảng IMAGES
            }

            if (files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result; // Hiển thị hình ảnh xem trước
                };
                reader.readAsDataURL(files[0]); // Hiển thị hình ảnh xem trước cho tệp đầu tiên
            }
        },

        async fetchFoods() {
            try {
                // Gọi API để lấy danh sách món ăn
                const foodsResponse = await axiosClient.get("/foods/allFood");
                const foodsData = foodsResponse.data;

                // Gọi API để lấy tổng số lần đặt của từng món ăn
                const totalQuantityResponse = await axiosClient.get("/booking/total-food-quantity");
                const totalQuantityData = totalQuantityResponse.data.data;

                // Kết hợp thông tin totalQuantity vào từng món ăn
                this.foods = foodsData.map(food => {
                    const matchingFood = totalQuantityData.find(f => f._id === food._id);
                    return {
                        ...food,
                        totalQuantity: matchingFood ? matchingFood.totalQuantity : 0 // Mặc định là 0 nếu không tìm thấy
                    };
                });

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
            this.loading = true; // Bắt đầu trạng thái loading
            try {
                const formData = new FormData();
                formData.append("NAME", this.newFood.NAME);
                formData.append("TYPE", this.newFood.TYPE);
                formData.append("PRICE", this.newFood.PRICE);
                formData.append("DESCRIPTION", this.newFood.DESCRIPTION);

                // Thêm ảnh vào FormData
                this.newFood.IMAGES.forEach((image) => {
                    formData.append("IMAGES[]", image); // Sử dụng IMAGES[] để khớp với cấu hình Multer
                });

                const response = await axiosClient.post("/foods/createFood", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data' // Thiết lập loại nội dung
                    }
                });

                if (response.status === 201 || response.status === 200) {
                    this.showModal = false;
                    this.fetchFoods(); // Làm mới danh sách món ăn
                } else {
                    console.error("Lỗi khi thêm món ăn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi thêm món ăn:", error);
            } finally {
                this.loading = false; // Kết thúc trạng thái loading
            }
        },

        // Cập nhật món ăn
        async updateFood() {
            this.loading = true; // Bắt đầu trạng thái loading
            try {
                const formData = new FormData();
                formData.append("NAME", this.newFood.NAME);
                formData.append("TYPE", this.newFood.TYPE);
                formData.append("PRICE", this.newFood.PRICE);
                formData.append("DESCRIPTION", this.newFood.DESCRIPTION);

                // Nếu có hình ảnh mới, thêm vào FormData
                if (this.newFood.IMAGES.length > 0) {
                    this.newFood.IMAGES.forEach((image) => {
                        formData.append("IMAGES[]", image); // Sử dụng IMAGES[] để khớp với cấu hình Multer
                    });
                }

                const response = await axiosClient.put(`/foods/updateFood/${this.editFoodId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data' // Thiết lập loại nội dung
                    }
                });

                if (response.status === 200) {
                    this.showModal = false;
                    this.fetchFoods(); // Làm mới danh sách món ăn
                } else {
                    console.error("Lỗi khi cập nhật món ăn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật món ăn:", error);
            } finally {
                this.loading = false; // Kết thúc trạng thái loading
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
