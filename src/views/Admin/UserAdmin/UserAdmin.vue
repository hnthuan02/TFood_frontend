<template>
    <div class="user-management-container">
        <!-- Tabs -->
        <div class="tabs">
            <button :class="{ active: activeTab === 'users' }"
                @click="activeTab = 'users'; fetchUsers(selectedUserStatus)">
                Người Dùng
            </button>
            <button :class="{ active: activeTab === 'staff' }"
                @click="activeTab = 'staff'; fetchUsers(selectedUserStatus)">
                Nhân Viên
            </button>
        </div>

        <!-- Bộ lọc và tìm kiếm -->
        <div class="search-filter-container">
            <div class="filter-container">
                <select v-model="selectedUserStatus" @change="fetchUsers(selectedUserStatus)">
                    <option value="1">Chưa kích hoạt</option>
                    <option value="2">Đã kích hoạt</option>
                    <option value="3">Bị chặn</option>
                    <option value="4">Tất cả</option>
                </select>
            </div>
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm theo họ tên, email hoặc số điện thoại"
                    @input="handleSearch" class="search-input" />
            </div>
        </div>

        <!-- Danh sách người dùng dạng thẻ -->
        <div class="user-card-container">
            <div v-for="user in filteredUsers" :key="user._id" class="user-card">
                <div class="user-card-header">
                    <h3>{{ user.FULLNAME }}</h3>
                    <span class="user-status">
                        {{ user.IS_ACTIVATED ? 'Đã kích hoạt' : 'Chưa kích hoạt' }}
                    </span>
                </div>
                <div class="user-card-body">
                    <p><strong>Email:</strong> {{ user.EMAIL }}</p>
                    <p><strong>Số điện thoại:</strong> {{ user.PHONE_NUMBER }}</p>
                </div>
                <div v-if="!userInfo?.ROLE.STAFF" class="user-card-footer">
                    <button class="action-button" @click="toggleBlockUser(user)">
                        {{ user.IS_BLOCKED?.CHECK ? 'Bỏ chặn' : 'Chặn' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Phân trang -->
        <pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
            @page-changed="fetchUsers(selectedUserStatus)" />
    </div>
</template>

<script>
import Swal from "sweetalert2"; // Import SweetAlert2
import { mapActions, mapGetters } from 'vuex';
import axiosClient from "../../../api/axiosClient";
export default {
    data() {
        return {
            activeTab: "users",
            selectedUserStatus: "4",
            searchQuery: "",
            users: [],
            staff: [],
            totalPages: 0,
            currentPage: 1,
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        shouldHideBlockButton() {
            // Đảm bảo user.ROLE tồn tại và kiểm tra giá trị ROLE.STAFF
            return this.user && this.user.ROLE && this.user.ROLE.STAFF === true;
        },
        filteredUsers() {
            const allUsers = this.activeTab === 'users' ? this.users : this.staff;
            return allUsers.filter(user => {
                const query = this.searchQuery.toLowerCase();
                return (
                    user.FULLNAME.toLowerCase().includes(query) ||
                    user.EMAIL.toLowerCase().includes(query) ||
                    user.PHONE_NUMBER.toLowerCase().includes(query)
                );
            });
        },
    },
    methods: {
        ...mapActions(["fetchUsers"]),
        handleSearch() {
            this.fetchUsers(this.selectedUserStatus);
        },
        async fetchUsers(status) {
            try {
                const response = await axiosClient.get("/users/getAllUsers", {
                    params: {
                        tabStatus: status,
                        page: this.currentPage,
                        limit: 10,
                    },
                });
                this.users = response.data.data.filter(user => (!user.ROLE.STAFF && !user.ROLE.ADMIN));
                this.staff = response.data.data.filter(user => (user.ROLE.STAFF));
                this.totalPages = response.data.totalPages;
            } catch (error) {
                console.error("Lỗi khi lấy người dùng:", error);
            }
        },
        async toggleBlockUser(user) {
            const isBlocked = !user.IS_BLOCKED?.CHECK;
            const result = await Swal.fire({
                title: isBlocked ? "Bạn có chắc chắn muốn chặn người dùng này không?" : "Bạn có chắc chắn muốn bỏ chặn người dùng này không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: isBlocked ? "Chặn" : "Bỏ chặn",
                cancelButtonText: "Hủy",
                confirmButtonColor: isBlocked ? "#d33" : "#4CAF50",
            });
            if (result.isConfirmed) {
                try {
                    await axiosClient.post('/users/blockUser', {
                        IS_BLOCKED: isBlocked,
                        userId: user._id,
                    });
                    await this.fetchUsers(this.selectedUserStatus);
                    this.$message.success(`Đã ${isBlocked ? 'chặn' : 'bỏ chặn'} người dùng thành công!`);
                } catch (error) {
                    console.error("Lỗi khi chặn/bỏ chặn người dùng:", error);
                    this.$message.error("Có lỗi xảy ra, không thể thực hiện hành động!");
                }
            }
        },
    },
    mounted() {
        this.fetchUsers(this.selectedUserStatus);
    },
};
</script>

<style scoped>
.user-management-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tabs {
    display: flex;
    margin-bottom: 20px;
}

.tabs button {
    flex: 1;
    padding: 12px;
    font-weight: bold;
    background-color: #e8e8e8;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #34495E;
    transition: background-color 0.3s, color 0.3s;
}

.tabs button.active {
    background-color: #34495E;
    color: white;
}

.tabs button:hover {
    background-color: #d9d9d9;
}

.search-filter-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.search-container {

    flex: 1;
    margin-right: 10px;
}

.search-input {
    margin-left: 10px;
    height: 45px;
    width: 100%;
    padding: 10px;
    border: 2px solid #1d2d4a;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.search-input:focus {
    border-color: #6d4c41;
    outline: none;
}

.filter-container select {
    height: 45px;
    padding: 10px;
    border: 2px solid #213451;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.filter-container select:focus {
    border-color: #6d4c41;
    outline: none;
}

.user-card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.user-card {
    width: 320px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.user-card-header {
    padding: 15px;
    background-color: #6d4c41;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-card-header h3 {
    font-size: 18px;
    margin: 0;
}

.user-status {
    font-size: 14px;
    font-weight: bold;
}

.user-card-body {
    padding: 15px;
}

.user-card-body p {
    margin: 5px 0;
    font-size: 14px;
}

.user-card-footer {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
}

.action-button {
    background-color: #1f2043;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.action-button:hover {
    background-color: #5b5ed7;
}
</style>
