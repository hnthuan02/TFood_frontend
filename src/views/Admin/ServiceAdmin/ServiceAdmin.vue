<template>
    <div class="service-management">
        <div class="header">
            <h2>Quản lý Dịch Vụ</h2>
            <button @click="openAddModal" class="add-button">Thêm Dịch Vụ</button>
        </div>

        <!-- Bộ lọc loại dịch vụ -->
        <div class="filters">
            <label for="serviceType">Lọc theo loại dịch vụ:</label>
            <select v-model="filterType" @change="fetchServices">
                <option value="">Tất cả</option>
                <option value="Normal">Normal</option>
                <option value="Room">Room</option>
            </select>
        </div>

        <!-- Bảng danh sách dịch vụ -->
        <table class="service-table">
            <thead>
                <tr>
                    <th>Tên dịch vụ</th>
                    <th>Giá</th>
                    <th>Loại</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="service in services" :key="service._id">
                    <td>{{ service.serviceName }}</td>
                    <td>{{ formatCurrency(service.servicePrice) }}</td>
                    <td>{{ service.type }}</td>
                    <td>
                        <button @click="openEditModal(service)" class="edit-button">Sửa</button>
                        <button @click="openDeleteModal(service._id)" class="delete-button">Xóa</button>

                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal xác nhận xóa -->
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
            <div class="modal-content">
                <h4>Xác Nhận Xóa Dịch Vụ</h4>
                <p>Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.</p>
                <div class="modal-buttons">
                    <button @click="confirmDeleteService" class="modal-delete-button">Xóa</button>
                    <button @click="closeDeleteModal" class="modal-cancel-button">Hủy</button>
                </div>
            </div>
        </div>

        <div v-if="services.length === 0" class="no-services">
            <p>Không có dịch vụ nào.</p>
        </div>

        <!-- Modal thêm / sửa dịch vụ -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h4>{{ isEditing ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ' }}</h4>
                <label for="">Tên dịch vụ</label>
                <input v-model="serviceData.serviceName" placeholder="" />
                <label for="">Giá dịch vụ</label>
                <input v-model.number="serviceData.servicePrice" placeholder="Giá dịch vụ" type="number" />
                <label for="">Dịch vụ dành cho loại bàn</label>
                <select v-model="serviceData.type">
                    <option value="Normal">Normal</option>
                    <option value="Room">Room</option>
                </select>
                <div class="modal-buttons">
                    <button @click="isEditing ? updateService() : createService()" class="modal-save-button">
                        {{ isEditing ? 'Cập Nhật' : 'Thêm' }}
                    </button>
                    <button @click="closeModal" class="modal-close-button">Hủy</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosClient from "../../../api/axiosClient"; // Đảm bảo đúng đường dẫn đến axiosClient

export default {
    data() {
        return {
            services: [],
            filterType: '', // Lọc theo loại dịch vụ
            showModal: false,
            isEditing: false,
            serviceData: {
                serviceName: '',
                servicePrice: 0,
                type: 'Normal',
            },
            showDeleteModal: false,
            serviceIdToDelete: null,
        };
    },
    mounted() {
        this.fetchServices(); // Lấy danh sách dịch vụ khi component được mount
    },
    methods: {
        async fetchServices() {
            try {
                const endpoint = this.filterType
                    ? `/serviceTables/services?type=${this.filterType}`
                    : "/serviceTables/services/all";
                const response = await axiosClient.get(endpoint);
                this.services = response.data.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            }
        },
        openAddModal() {
            this.resetServiceData();
            this.isEditing = false;
            this.showModal = true;
        },
        openEditModal(service) {
            this.serviceData = { ...service };
            this.isEditing = true;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.resetServiceData();
        },
        resetServiceData() {
            this.serviceData = {
                serviceName: '',
                servicePrice: 0,
                type: 'Normal',
            };
        },
        openDeleteModal(id) {
            this.serviceIdToDelete = id;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.serviceIdToDelete = null;
        },
        async createService() {
            try {
                const response = await axiosClient.post("/serviceTables/createServices", this.serviceData);
                if (response.data.success) {
                    this.fetchServices();
                    this.closeModal();
                }
            } catch (error) {
                console.error("Lỗi khi tạo dịch vụ:", error);
            }
        },
        async updateService() {
            try {
                const response = await axiosClient.put(
                    `/serviceTables/edit/${this.serviceData._id}`,
                    this.serviceData
                );
                if (response.data.success) {
                    this.fetchServices();
                    this.closeModal();
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật dịch vụ:", error);
            }
        },
        async confirmDeleteService() {
            try {
                const response = await axiosClient.delete(`/serviceTables/delete/${this.serviceIdToDelete}`);
                if (response.data.success) {
                    this.fetchServices(); // Tải lại danh sách dịch vụ sau khi xóa thành công
                    this.closeDeleteModal();
                }
            } catch (error) {
                console.error("Lỗi khi xóa dịch vụ:", error);
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
        },
    },
};
</script>

<style scoped>
.service-management {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #34495E;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

h2 {
    color: #34495E;
}

.filters {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    margin-bottom: 20px;
}

.filters label {
    font-weight: bold;
    color: #34495E;
}

.filters select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    color: #34495E;
    transition: border-color 0.2s;
    background-color: white;
    width: 20%;
    margin: 0;
}

.service-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.service-table th,
.service-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.service-table th {
    background-color: #34495E;
    color: #fff;
}

.add-button {
    padding: 8px 15px;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.add-button:hover {
    background-color: #16a085;
}

.edit-button {
    background-color: #f39c12;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
    font-size: 14px;
}

.edit-button:hover {
    background-color: #e67e22;
}

.delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.delete-button:hover {
    background-color: #c0392b;
}

.no-services {
    text-align: center;
    color: #888;
    margin-top: 20px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

.modal-content h4 {
    color: #c0392b;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
}

.modal-content p {
    color: #333;
    font-size: 16px;
    margin-bottom: 20px;
}

.modal-buttons {
    display: flex;
    justify-content: space-around;
}

.modal-delete-button {
    padding: 10px 20px;
    background-color: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.modal-delete-button:hover {
    background-color: #c0392b;
}

.modal-cancel-button {
    padding: 10px 20px;
    background-color: #bdc3c7;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.modal-cancel-button:hover {
    background-color: #95a5a6;
}


input,
select {
    width: 100%;
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    /* Đẩy các nút sang hai bên */
    gap: 10px;
    /* Khoảng cách giữa các nút */
    margin-top: 15px;
}

.modal-save-button,
.modal-close-button {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
}

.modal-save-button {
    background-color: #1abc9c;
    color: white;
    border: none;
}

.modal-save-button:hover {
    background-color: #16a085;
}

.modal-close-button {
    background-color: #e74c3c;
    color: white;
    border: none;
}

.modal-close-button:hover {
    background-color: #c0392b;
}
</style>
