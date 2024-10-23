<template>
    <header class="header-admin">
        <div class="header-left">
            <h2 style="margin-bottom: 0;">Quản Lý Nhà Hàng</h2>
        </div>
        <div class="header-right">
            <router-link to="/user/info" class="user-info" style="text-decoration: none; color: inherit;">

                <div class="user-info">
                    <span class="user-name">{{ userInfo?.FULLNAME }} </span>
                    <font-awesome-icon :icon="['fas', 'user']" />
                </div>
            </router-link>
            <button @click="logout" class="logout-button">Đăng xuất</button>
        </div>
    </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {

    data() {
        return {

        };
    },
    computed: {
        ...mapGetters(['isLoggedIn', 'userInfo']),
    },
    methods: {
        ...mapActions(['logout']),
    },
    mounted() {
        this.$store.dispatch('checkToken'); // Kiểm tra trạng thái đăng nhập khi component được mount
    }
};
</script>

<style scoped>
.header-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #34495e;
    padding: 15px;
    color: white;
}

.header-left {
    display: flex;
    align-items: center;
}

.menu-icon {
    font-size: 24px;
    margin-right: 20px;
    cursor: pointer;
}

.search-input {
    padding: 10px;
    border-radius: 20px;
    border: none;
    font-size: 16px;
    width: 300px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    outline: none;
}

.header-right {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
}

.user-name {
    margin-right: 10px;
    font-size: 18px;
    font-weight: bold;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
}

.logout-button {
    background-color: #E5D761;
    color: rgb(0, 0, 0);
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
}

.logout-button:hover {
    transition: 0.5s;
    background-color: #aba03b;
}
</style>