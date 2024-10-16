<template>
    <nav class="sidebar">
        <!-- Thêm logo và tên trang web -->
        <div class="sidebar-header">
            <img src="../../assets/logoNoText.png" alt="Logo" class="logo" />
            <h2 class="website-name">TFood</h2>
        </div>

        <!-- Các mục của sidebar -->
        <ul>
            <li :class="{ active: activeTab === 'dashboard' }" @click="setActiveTab('dashboard')">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </li>
            <li :class="{ active: activeTab === 'menu' }" @click="setActiveTab('menu')">
                <i class="fas fa-utensils"></i> Thực đơn
            </li>
            <li :class="{ active: activeTab === 'booking' }" @click="setActiveTab('booking')">
                <i class="fas fa-file-invoice"></i> Đơn đặt
            </li>
            <li :class="{ active: activeTab === 'booking' }" @click="setActiveTab('booking')">
                <i class="fas fa-calendar-check"></i> Bàn ăn
            </li>
            <li :class="{ active: activeTab === 'users' }" @click="setActiveTab('users')">
                <i class="fas fa-users"></i> Người dùng
            </li>
            <li :class="{ active: activeTab === 'promotions' }" @click="setActiveTab('promotions')">
                <i class="fas fa-tags"></i> Khuyến mãi
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        activeTab: {
            type: String,
            required: true,
        },
    },
    methods: {
        setActiveTab(tab) {
            this.$emit('update-tab', tab); // Truyền sự kiện 'update-tab' để cập nhật tab đang hoạt động
        },
    },
};
</script>

<style scoped>
.sidebar {
    background-color: #34495E;
    width: 240px;
    padding: 20px;
    color: white;
}

/* Phần header chứa logo và tên trang web */
.sidebar-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.logo {
    width: auto;
    /* Để logo tự động lấy kích thước phù hợp */
    height: 40px;
    /* Chiều cao cố định, logo sẽ co dãn theo tỉ lệ */
    object-fit: contain;
    /* Giữ tỉ lệ của logo mà không bị cắt hoặc biến dạng */
    margin-right: 10px;
}

.website-name {
    font-size: 24px;
    font-weight: bold;
    color: white;
}

/* Danh sách các mục */
.sidebar ul {
    list-style-type: none;
    padding: 0;
}

.sidebar ul li {
    padding: 15px 10px;
    margin: 10px 0;
    cursor: pointer;
    font-size: 18px;
    color: white;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.sidebar ul li:hover {
    background-color: #3b5776;
}

.sidebar ul li.active {
    background-color: #2c3e50;
    color: blanchedalmond;
}
</style>
