<template>
    <div class="voucher-page">
        <h2>Danh sách Voucher</h2>

        <!-- Nút thêm Voucher mới -->
        <button @click="openAddVoucherModal" class="btn-add-voucher">Thêm Voucher Mới</button>

        <!-- Modal thêm hoặc chỉnh sửa Voucher -->
        <div v-if="showVoucherForm" class="modal-overlay" @click.self="closeVoucherModal">
            <div class="modal-content">
                <h3>{{ isEditMode ? "Chỉnh sửa Voucher" : "Thêm Voucher" }}</h3>
                <form @submit.prevent="isEditMode ? updateVoucher() : addVoucher()">
                    <label for="phone">Mã Voucher:</label>
                    <input v-model="voucherForm.CODE" type="text" placeholder="Mã Voucher" required />
                    <label for="phone">Mô tả:</label>
                    <input v-model="voucherForm.DESCRIPTION" type="text" placeholder="Mô tả" required />
                    <label for="phone">Tỷ lệ giảm:</label>
                    <input v-model.number="voucherForm.DISCOUNT_PERCENT" type="number" placeholder="Phần trăm giảm giá"
                        min="1" max="100" required />
                    <label for="phone">lượt dùng tối đa:</label>
                    <input v-model.number="voucherForm.USAGE_LIMIT" type="number" placeholder="Lượt sử dụng" required />
                    <label for="phone">Điểm yêu cầu:</label>
                    <input v-model.number="voucherForm.REQUIRED_POINTS" type="number" placeholder="Điểm yêu cầu"
                        required />
                    <label for="phone">Ngày hết hạn:</label>
                    <input v-model="voucherForm.EXPIRATION_DATE" type="date" required />
                    <div class="modal-buttons">
                        <button type="submit">{{ isEditMode ? "Cập nhật" : "Tạo Voucher" }}</button>
                        <button type="button" @click="closeVoucherModal">Hủy</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Danh sách Voucher -->
        <div class="voucher-list">
            <div v-for="voucher in vouchers" :key="voucher._id" class="voucher-card">
                <h3>{{ voucher.CODE }}</h3>
                <p><strong>Mô tả:</strong> {{ voucher.DESCRIPTION }}</p>
                <p><strong>Giảm giá:</strong> {{ voucher.DISCOUNT_PERCENT }}%</p>
                <p><strong>Điểm yêu cầu:</strong> {{ voucher.REQUIRED_POINTS }}</p>
                <p><strong>Số lượt dùng còn lại:</strong> {{ voucher.USAGE_LIMIT }}</p>
                <p><strong>Hạn sử dụng:</strong> {{ formatDate(voucher.EXPIRATION_DATE) }}</p>
                <p><strong>Trạng thái:</strong> {{ voucher.STATUS ? "Kích hoạt" : "Vô hiệu hóa" }}</p>
                <button @click="toggleVoucherStatus(voucher)"
                    :class="{ 'btn-active': voucher.STATUS, 'btn-inactive': !voucher.STATUS }">
                    {{ voucher.STATUS ? "Vô hiệu hóa" : "Kích hoạt" }}
                </button>
                <button class="btn-edit" @click="openEditVoucherModal(voucher)">Chỉnh sửa</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            vouchers: [],
            showVoucherForm: false,
            isEditMode: false,
            voucherForm: {
                CODE: "",
                DESCRIPTION: "",
                DISCOUNT_PERCENT: null,
                REQUIRED_POINTS: null,
                USAGE_LIMIT: null,
                EXPIRATION_DATE: "",
                STATUS: true,
            },
            currentVoucherId: null, // ID của voucher hiện tại khi ở chế độ chỉnh sửa
        };
    },
    methods: {
        async toggleVoucherStatus(voucher) {
            try {
                // Kiểm tra USAGE_LIMIT trước khi thay đổi trạng thái
                if (voucher.USAGE_LIMIT === 0) {
                    this.$message.error("Hãy tăng lượt sử dụng lên trước khi kích hoạt.");
                    return; // Không thực hiện thay đổi trạng thái nếu không có lượt sử dụng
                }

                const updatedStatus = !voucher.STATUS;
                const response = await axios.patch(`http://localhost:3001/vouchers/updateStatus/${voucher._id}`, {
                    status: updatedStatus,
                });
                if (response.data.success) {
                    voucher.STATUS = updatedStatus;
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái voucher:", error);
            }
        },

        async fetchVouchers() {
            try {
                const response = await axios.get("http://localhost:3001/vouchers/getAll");
                if (response.data.success) {
                    this.vouchers = response.data.data;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách voucher:", error);
            }
        },
        openAddVoucherModal() {
            this.isEditMode = false;
            this.resetVoucherForm();
            this.showVoucherForm = true;
        },
        openEditVoucherModal(voucher) {
            this.isEditMode = true;
            this.currentVoucherId = voucher._id;
            this.voucherForm = { ...voucher };
            this.voucherForm.EXPIRATION_DATE = new Date(voucher.EXPIRATION_DATE).toISOString().substr(0, 10); // Định dạng lại ngày
            this.showVoucherForm = true;
        },
        closeVoucherModal() {
            this.showVoucherForm = false;
            this.resetVoucherForm();
        },

        async addVoucher() {
            try {
                const response = await axios.post("http://localhost:3001/vouchers/create", this.voucherForm);
                if (response.data.success) {
                    this.vouchers.push(response.data.data);
                    this.closeVoucherModal();
                }
            } catch (error) {
                console.error("Lỗi khi thêm voucher mới:", error);
            }
        },
        async updateVoucher() {
            try {
                const response = await axios.put(`http://localhost:3001/vouchers/edit/${this.currentVoucherId}`, this.voucherForm);
                if (response.data.success) {
                    // Cập nhật voucher đã chỉnh sửa trong danh sách
                    const index = this.vouchers.findIndex(v => v._id === this.currentVoucherId);
                    if (index !== -1) {
                        this.vouchers[index] = response.data.data;
                    }
                    this.closeVoucherModal();
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật voucher:", error);
            }
        },
        resetVoucherForm() {
            this.voucherForm = {
                CODE: "",
                DESCRIPTION: "",
                DISCOUNT_PERCENT: null,
                REQUIRED_POINTS: null,
                USAGE_LIMIT: null,
                EXPIRATION_DATE: "",
                STATUS: true,
            };
        },
        formatDate(date) {
            const options = { day: "2-digit", month: "2-digit", year: "numeric" };
            return new Date(date).toLocaleDateString("vi-VN", options);
        }
    },
    mounted() {
        this.fetchVouchers();
    },
};
</script>

<style scoped>
.voucher-page {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #6d4c41;
}

.btn-add-voucher {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 10px auto;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
}

.modal-content h3 {
    margin-top: 0;
    color: #333;
}

.modal-content form input,
.modal-content form button {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
}

.modal-buttons button[type="submit"] {
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}

.modal-buttons button[type="button"] {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}

/* Voucher List Styles */
.voucher-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.voucher-card {
    flex: 1 1 45%;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.voucher-card h3 {
    color: #e74c3c;
    font-size: 1.2rem;
}

.voucher-card p {
    margin: 5px 0;
}

.btn-active {
    background-color: #f44336;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-inactive {
    background-color: #4caf50;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-edit {
    background-color: #1d25b8;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 5px;
}
</style>
