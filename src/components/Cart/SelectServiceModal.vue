<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h2 class="d-flex justify-content-center">Chọn dịch vụ cho bàn</h2>
            <h2 class="d-flex justify-content-center">{{ tableInfo.tableInfo.TABLE_NUMBER }}</h2>
            <div class="service-list">
                <div v-for="service in services" :key="service._id" class="service-item d-flex justify-content-center">
                    <div class="checkbox-wrapper-31">
                        <input type="checkbox" :id="`service-${service._id}`" :value="service._id"
                            v-model="selectedServiceIds" />
                        <svg viewBox="0 0 35.6 35.6">
                            <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                            <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                            <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                        </svg>
                    </div>
                    <label class="tag-service" :for="`service-${service._id}`"> {{ service.serviceName }} - {{
                        formatPrice(service.servicePrice) }}</label>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button class="save-btn" @click="saveServices">Lưu dịch vụ</button>
                <button class="close-btn" @click="close">Đóng</button>
            </div>



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
h2 {
    color: #F9F1BE;
}

/* CSS cho nút Lưu và Đóng */
button {
    border: none;
    /* Không có đường viền */
    margin: 5px;
    /* Khoảng cách giữa các nút */
    width: 120px;
    /* Chiều rộng nút */
    height: 40px;
    /* Chiều cao nút */
    border-radius: 20px;
    /* Bo góc */
    font-size: 16px;
    /* Kích thước chữ */
    font-weight: bold;
    /* Chữ đậm */
    cursor: pointer;
    /* Con trỏ khi di chuột qua nút */
    transition: background-color 0.3s, transform 0.3s;
    /* Hiệu ứng chuyển động */
}

/* Nút Lưu dịch vụ */
.save-btn {
    background-color: #3A302F;
    /* Màu nền */
    color: #fff;
    /* Màu chữ */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    /* Đổ bóng */
}

.save-btn:hover {
    background-color: #3A302F;
    /* Màu nền khi hover */
    transform: translateY(-2px);
    /* Hiệu ứng đẩy lên khi hover */
}

/* Nút Đóng */
.close-btn {
    background-color: #850d00;
    /* Màu nền */
    color: #fff;
    /* Màu chữ */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    /* Đổ bóng */
}

.close-btn:hover {
    background-color: #c0392b;
    /* Màu nền khi hover */
    transform: translateY(-2px);
    /* Hiệu ứng đẩy lên khi hover */
}


.tag-service {
    padding-left: 6px;
    border: #34495E solid 1px;
    border-radius: 50px;
    width: 250px;
    margin-left: 5px;
    color: #ffffff;


}

.tag-service:hover {
    background-color: #34495E;
    color: #fff;
    transition: background-color 0.3s;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s;
}

.tag-service:active {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    /* Màu nền khi nhấn */
}

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
    background-image: url('https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg');
    /* Thay URL ảnh nền mới ở đây */
    background-size: cover;
    /* Đảm bảo ảnh nền bao phủ toàn bộ modal */
    background-position: center;
    /* Căn giữa ảnh nền */
    padding: 20px;
    border-radius: 8px;
    max-height: 80vh;
    overflow-y: auto;
    width: 90%;
    max-width: 400px;
}



.service-list {
    display: flex;
    flex-direction: column;
}

.service-item {
    margin: 7px 0;

}

/* Thêm CSS cho checkbox mới */
.checkbox-wrapper-31 {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
}

.checkbox-wrapper-31 .background {
    fill: #ccc;
    transition: ease all 0.6s;
}

.checkbox-wrapper-31 .stroke {
    fill: none;
    stroke: #fff;
    stroke-miterlimit: 10;
    stroke-width: 2px;
    stroke-dashoffset: 100;
    stroke-dasharray: 100;
    transition: ease all 0.6s;
}

.checkbox-wrapper-31 .check {
    fill: none;
    stroke: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
    stroke-dashoffset: 22;
    stroke-dasharray: 22;
    transition: ease all 0.6s;
}

.checkbox-wrapper-31 input[type=checkbox] {
    position: absolute;
    width: 70%;
    height: 50%;
    left: 0;
    top: 0;
    margin: 0;
    opacity: 0;
    -appearance: none;
}

.checkbox-wrapper-31 input[type=checkbox]:hover {
    cursor: pointer;
}

.checkbox-wrapper-31 input[type=checkbox]:checked+svg .background {
    fill: #34495E;
}

.checkbox-wrapper-31 input[type=checkbox]:checked+svg .stroke {
    stroke-dashoffset: 0;
}

.checkbox-wrapper-31 input[type=checkbox]:checked+svg .check {
    stroke-dashoffset: 0;
}
</style>
