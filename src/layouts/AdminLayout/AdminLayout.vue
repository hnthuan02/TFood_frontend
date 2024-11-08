<template>
    <div class="dashboard-layout">
        <Sidebar :activeTab="activeTab" @update-tab="setActiveTab" />
        <div class="dashboard-main">
            <HeaderAdmin />
            <div class="dashboard-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin.vue"; // Đảm bảo đường dẫn đến HeaderAdmin là đúng
import Sidebar from "../../components/SidebarAdmin/SidebarAdmin.vue"; // Đảm bảo đường dẫn đến Sidebar là đúng

export default {
    components: {
        Sidebar,
        HeaderAdmin,
    },
    data() {
        return {
            activeTab: "dashboard", // Tab mặc định
        };
    },
    methods: {
        setActiveTab(tab) {
            this.activeTab = tab; // Cập nhật tab đang chọn
            // Logic điều hướng khi tab được chọn
            if (tab === "dashboard") {
                this.$router.push("/dashboard");
            } else if (tab === "menu") {
                this.$router.push("/dashboard/menu");
            } else if (tab === "bill") {
                this.$router.push("/dashboard/bill");
            } else if (tab === "booking") {
                this.$router.push("/dashboard/booking");
            } else if (tab === "users") {
                this.$router.push("/dashboard/users");
            } else if (tab === "promotions") {
                this.$router.push("/dashboard/promotions");
            }
        },
    },
};
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    height: 100vh;
}

/* Phần chính của dashboard bao gồm header và content */
.dashboard-main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* Phần nội dung chính */
.dashboard-content {
    flex-grow: 1;
    padding: 20px;
    background-color: #ecf0f1;
    overflow-y: auto;
    max-width: 1336px;
}
</style>