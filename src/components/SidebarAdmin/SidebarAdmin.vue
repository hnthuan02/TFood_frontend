<template>
    <nav class="sidebar">
        <!-- Thêm logo và tên trang web -->
        <div class="sidebar-header">
            <img src="../../assets/logoNoText.png" alt="Logo" class="logo" />
            <h2 class="website-name">TFood</h2>
        </div>

        <!-- Các mục của sidebar -->
        <ul>
            <li :class="{ active: currentTab === 'dashboard' }" @click="setActiveTab('dashboard')">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </li>
            <li :class="{ active: currentTab === 'menu' }" @click="setActiveTab('menu')">
                <i class="fas fa-utensils"></i> Thực đơn
            </li>
            <li :class="{ active: currentTab === 'bill' }" @click="setActiveTab('bill')">
                <i class="fas fa-file-invoice"></i> Đơn đặt
            </li>
            <li :class="{ active: currentTab === 'booking' }" @click="setActiveTab('booking')">
                <i class="fas fa-calendar-check"></i> Bàn ăn
            </li>
            <li :class="{ active: currentTab === 'users' }" @click="setActiveTab('users')">
                <i class="fas fa-users"></i> Người dùng
            </li>
            <li :class="{ active: currentTab === 'promotions' }" @click="setActiveTab('promotions')">
                <i class="fas fa-tags"></i> Khuyến mãi
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            currentTab: '', // Tab hiện tại
        };
    },
    watch: {
        // Theo dõi thay đổi của route
        $route(to) {
            this.updateActiveTab(to.path); // Cập nhật tab hoạt động khi route thay đổi
        },
    },
    created() {
        this.updateActiveTab(this.$route.path); // Thiết lập tab khi component được khởi tạo
    },
    methods: {
        setActiveTab(tab) {
            if (tab === 'dashboard') {
                this.$router.push('/dashboard'); // Điều hướng đến /dashboard
            } else {
                this.$router.push(`/dashboard/${tab}`); // Điều hướng đến các trang khác
            }
        },
        updateActiveTab(path) {
            // Lấy phần cuối của đường dẫn để thiết lập tab
            const lastSegment = path.split('/').pop();
            // Kiểm tra nếu đường dẫn là /dashboard (tab chính)
            this.currentTab = lastSegment === 'dashboard' ? 'dashboard' : lastSegment;
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

.sidebar-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.logo {
    width: auto;
    height: 40px;
    object-fit: contain;
    margin-right: 10px;
}

.website-name {
    font-size: 24px;
    font-weight: bold;
    color: white;
}

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
