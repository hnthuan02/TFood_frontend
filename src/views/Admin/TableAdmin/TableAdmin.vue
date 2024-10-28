<template>
    <div class="table-list">
        <div class="header-section">
            <h2 style="color: black;">Danh sách bàn</h2>
            <div class="filter-section">
                <div class="select">
                    <select id="food-type" v-model="selectedType" @change="filterTables">
                        <option value="">Tất cả</option>
                        <option v-for="type in tablesTypes" :key="type" :value="type">
                            {{ translateType(type) }}
                        </option>
                    </select>
                </div>
                <button @click="openAddTableModal" class="add-table-button">Thêm bàn</button>
            </div>
        </div>

        <div v-if="filteredTables.length > 0" class="table-grid">
            <div v-for="table in filteredTables" :key="table._id" class="table-item"
                @mouseenter="hoveredTable = table._id" @mouseleave="hoveredTable = null">
                <img :src="table.IMAGES[0]" alt="Table Image" class="table-image" />
                <div class="table-info">
                    <h3>{{ table.TYPE == 'Normal' ? 'Bàn' : 'Phòng' }} {{ table.TABLE_NUMBER }}</h3>
                    <p>Loại: {{ translateType(table.TYPE) }}</p>
                    <p>Mô tả: {{ table.DESCRIPTION }}</p>
                    <p>Sức chứa: {{ table.CAPACITY }} người</p>
                    <!-- Phần CURRENT với màu nền -->
                    <p class="table-status" :style="getTableStatusStyle(table.CURRENT)">
                        {{ table.CURRENT }}
                    </p>
                </div>

                <!-- Nút Xóa và Sửa -->
                <div class="action-buttons" v-if="hoveredTable === table._id">
                    <button @click.stop="deleteTable(table._id)" class="delete-button">Xóa</button>
                    <button @click.stop="openEditTableModal(table)" class="edit-button">Sửa</button>
                </div>
            </div>
        </div>



        <div v-else>
            <p>Không có bàn nào được tìm thấy.</p>
        </div>

        <!-- Modal thêm bàn -->
        <div v-if="showModalAdd" class="modal-tableAdmin">
            <div class="modal-content">
                <h3>{{ isEditing ? 'Sửa' : 'Thêm' }} bàn mới</h3>
                <form @submit.prevent="isEditing ? updateTable() : createTable()">
                    <div class="form-group">
                        <label for="table-type">Loại bàn:</label>
                        <select v-model="newTable.TYPE" id="table-type" required>
                            <option value="Normal">Bàn thường</option>
                            <option value="Room">Phòng riêng</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="table-description">Mô tả:</label>
                        <textarea v-model="newTable.DESCRIPTION" id="table-description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="table-capacity">Sức chứa:</label>
                        <select v-model="newTable.CAPACITY" id="table-capacity" required>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="8">8</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="table-image">Hình ảnh:</label>
                        <input v-model="newTable.IMAGES[0]" id="table-image" placeholder="URL hình ảnh" required />
                    </div>
                    <div class="form-group buttons">
                        <button type="submit" class="save-button">{{ isEditing ? 'Cập nhật' : 'Lưu' }}</button>
                        <button type="button" @click="closeModalAdd" class="cancel-button">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>



<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo axiosClient đúng đường dẫn

export default {
    data() {
        return {
            tables: [], // Dữ liệu bàn
            selectedType: "",
            tablesTypes: [],
            showModal: false, // Trạng thái hiển thị modal
            showModalAdd: false, // Tr
            hoveredTable: null,
            isEditing: false,
            selectedTable: null, // Bàn được chọn để hiển thị chi tiết
            newTable: {
                TYPE: "Normal", // Mặc định là bàn thường
                DESCRIPTION: "",
                CAPACITY: 2,
                IMAGES: [""], // URL hình ảnh
            }, // Thông tin bàn mới
        };
    },
    computed: {
        filteredTables() {
            // Lọc danh sách món ăn dựa trên loại món ăn được chọn
            if (this.selectedType) {
                return this.tables.filter(table => table.TYPE === this.selectedType);
            }
            return this.tables; // Hiển thị tất cả nếu không chọn loại
        }
    },
    mounted() {
        this.fetchTables(); // Gọi hàm lấy danh sách bàn khi component được mount
    },
    methods: {
        async fetchTableDetails(tableId) {
            try {
                const response = await axiosClient.get(`/tables/oneTable/${tableId}`);
                if (response.data.success) {
                    this.selectedTable = response.data.data;
                    this.showModal = true; // Mở modal khi nhận được dữ liệu
                } else {
                    console.error("Không thể lấy thông tin bàn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin bàn:", error);
            }
        },
        filterTables() {
            // Hàm lọc món ăn sẽ được gọi khi thay đổi loại món ăn
            // Không cần làm gì ở đây vì đã xử lý qua computed property
        },
        translateType(type) {
            switch (type) {
                case "Normal":
                    return "Bàn thường";
                case "Room":
                    return "Phòng riêng";
                default:
                    return type;
            }
        },
        openAddTableModal() {
            this.isEditing = false;
            this.showModalAdd = true;
            this.resetNewTable();
        },
        openEditTableModal(table) {
            this.isEditing = true;
            this.newTable = { ...table };
            this.showModalAdd = true;
        },
        closeModal() {
            this.showModal = false; // Đóng modal
        },
        closeModalAdd() {
            this.showModalAdd = false; // Đóng modal
        },
        resetNewTable() {
            this.newTable = {
                TYPE: "Normal",
                DESCRIPTION: "",
                CAPACITY: 2,
                IMAGES: [""],
            };
        },
        async createTable() {
            try {
                const response = await axiosClient.post("/tables/createTable", this.newTable);
                if (response.status === 201 || response.status === 200) {
                    this.showModal = false; // Đóng modal
                    this.fetchTables(); // Làm mới danh sách bàn
                } else {
                    console.error("Lỗi khi thêm bàn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi thêm bàn:", error);
            }
        },
        async fetchTables() {
            try {
                const response = await axiosClient.get("/tables/all-tables-with-status");
                this.tables = response.data.data; // Gán dữ liệu bàn
                this.tablesTypes = [...new Set(this.tables.map(table => table.TYPE))];
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bàn:", error);
            }
        },
        async updateTable() {
            try {
                const response = await axiosClient.post(`/tables/updateTable/${this.newTable._id}`, this.newTable);
                if (response.status === 200) {
                    this.showModalAdd = false;
                    this.fetchTables();
                } else {
                    console.error("Lỗi khi cập nhật bàn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật bàn:", error);
            }
        },
        async deleteTable(tableId) {
            try {
                const response = await axiosClient.delete(`/tables/deleteTable/${tableId}`);
                if (response.status === 200) {
                    this.fetchTables();
                } else {
                    console.error("Lỗi khi xóa bàn:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi xóa bàn:", error);
            }
        },
        getTableStatusStyle(current) {
            if (current === "Đang có khách") {
                return { backgroundColor: "#f44336", color: "white" }; // Nền đỏ
            } else if (current === "Sắp có khách") {
                return { backgroundColor: "#ff9800", color: "white" }; // Nền vàng
            } else {
                return { backgroundColor: "#4caf50", color: "white" }; // Nền xanh
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
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 500px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.close-button {
    background-color: #27ae60;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    display: block;
    width: 100%;
    text-align: center;
}

.close-button:hover {
    background-color: #219150;
}

.table-list {
    padding: 0px;
}

.table-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Hiển thị 3 bàn trên mỗi hàng */
    gap: 20px;
}

.table-item {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    align-items: center;
    position: relative;
    transition: box-shadow 0.3s ease, background-color 0.3s ease;
}


.table-item:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.action-buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
}

.delete-button,
.edit-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.edit-button {
    background-color: #3498db;
}

.delete-button:hover {
    background-color: #c0392b;
}

.edit-button:hover {
    background-color: #2980b9;
}

.table-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 20px;
}

.table-info {
    flex: 1;
}

h3 {
    margin: 10px 0;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-table-button {
    background-color: #27ae60;
    /* Màu xanh cho nút thêm bàn */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 20px;
}

.table-status {
    padding: 5px 10px;
    border-radius: 4px;
    display: inline-block;
    margin-top: 5px;
    font-weight: bold;
}


.modal-tableAdmin {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Các kiểu cho các form-group */
.form-group {
    margin-bottom: 15px;
}

.buttons {

    display: flex;
    justify-content: space-between;
}
</style>
