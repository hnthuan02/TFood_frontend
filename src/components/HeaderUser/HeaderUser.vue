<template>
  <header :class="headerClass">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <a class="navbar-brand logo" href="/TFood">
          <img src="@/assets/logoNoText.png" alt="TFOOD Logo" />
        </a>
        <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation" @click="toggleNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link active" href="/TFood">Trang Chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="/table">Đặt Bàn</a></li>
            <li class="nav-item dropdown hover-dropdown">
              <a class="nav-link" href="/menu/best-seller">
                Thực Đơn
              </a>
            </li>

            <li class="nav-item"><a class="nav-link" href="/voucher">Khuyến Mãi</a></li>
            <li class="nav-item"><a class="nav-link" href="/contact">Liên Hệ</a></li>
            <li class="nav-item"><a class="nav-link" href="/review">Đánh Giá</a></li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <!-- Hiển thị nút Đăng nhập/Đăng ký khi chưa đăng nhập -->
            <li class="nav-item" v-if="!isLoggedIn">
              <a class="btn" href="/user/login">Đăng nhập</a>
            </li>
            <li class="nav-item ms-2" v-if="!isLoggedIn">
              <a class="btn" href="/user/signup">Đăng ký</a>
            </li>

            <!-- Hiển thị thông tin người dùng và nút Đăng xuất khi đã đăng nhập -->
            <li class="nav-item" v-else>
              <div class="d-flex align-items-center">
                <router-link to="/user/info" class="user-info" style="text-decoration: none; color: inherit;">
                  <div class="avatar me-2">
                    {{ getInitials(userInfo?.FULLNAME) || 'User' }}
                  </div>
                  <span class="username me-3">{{ userInfo?.FULLNAME || 'User' }}</span>
                </router-link>
                <a class="btn" href="#" @click="logout">Đăng xuất</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'HeaderComponent',

  computed: {
    ...mapGetters(['isLoggedIn', 'userInfo']),
    headerClass() {
      return this.$route.path.startsWith('/menu') ? 'header absolute' : 'header sticky';
    }

  },
  methods: {
    ...mapActions(['logout']),
    toggleNavbar() {
      const collapseElement = document.getElementById('navbarSupportedContent');
      const bsCollapse = new bootstrap.Collapse(collapseElement, {
        toggle: true
      });
      if (collapseElement.classList.contains('show')) {
        bsCollapse.hide();
      } else {
        bsCollapse.show();
      }
    },
    getInitials(fullName) {
      if (!fullName) return '';
      const names = fullName.trim().split(' ');
      return names.length > 1 ? names[names.length - 1][0].toUpperCase() : fullName[0].toUpperCase();
    }
  },
  mounted() {
    this.$store.dispatch('checkToken'); // Kiểm tra trạng thái đăng nhập khi component được mount
  }
};
</script>

<style lang="scss">
@import "./Updated_HeaderUser.scss";
</style>
