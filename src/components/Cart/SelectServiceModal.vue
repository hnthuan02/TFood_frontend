<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2>Chọn dịch vụ cho bàn {{ tableInfo.tableInfo.TABLE_NUMBER }}</h2>
            <div class="service-list">
                <div v-for="service in services" :key="service._id" class="service-item">
                    <input type="checkbox" :value="service._id" v-model="selectedServiceIds" />
                    <label>{{ service.serviceName }} - {{ formatPrice(service.servicePrice) }}</label>
                </div>
            </div>
            <button @click="saveServices">Lưu dịch vụ</button>
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
            services: [],
            selectedServiceIds: [],
        };
    },
    async created() {
        await this.fetchServices();
    },
    methods: {
        async fetchServices() {
            try {

                const response = await axiosClient.get('/serviceTables/services', {
                    params: {
                        type: this.tableInfo.tableInfo.TYPE
                    },
                }); // API lấy danh sách dịch vụ
                this.services = response.data.data; // Giả sử response trả về danh sách dịch vụ
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            }
        },
        async saveServices() {
            try {
                const payload = {
                    tableId: this.tableInfo.TABLE_ID,
                    selectedServiceIds: this.selectedServiceIds,
                };

                await axiosClient.post('/carts/addServiceToCart', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                alert('Đã cập nhật dịch vụ cho bàn.');
                this.$emit('update-cart');
                this.close();
            } catch (error) {
                console.error('Lỗi khi thêm dịch vụ vào bàn:', error);
                alert('Cập nhật dịch vụ thất bại.');
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
/* Thêm CSS tương tự như modal khác */
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

.service-list {
    display: flex;
    flex-direction: column;
}

.service-item {
    margin: 10px 0;
}
</style>
