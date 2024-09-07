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
            <li class="nav-item"><a class="nav-link" href="about-us.html">Giới Thiệu</a></li>
            <li class="nav-item dropdown hover-dropdown">
              <a class="nav-link dropdown-toggle" href="menu" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Thực Đơn
              </a>
              <MenuCategory />
            </li>
            <li class="nav-item dropdown hover-dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Khuyến Mãi
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Khuyến Mãi 1</a></li>
                <li><a class="dropdown-item" href="#">Khuyến Mãi 2</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="contact.html">Liên Hệ</a></li>
          </ul>

          <!-- Thêm nút đăng nhập, đăng ký và đăng xuất ở đây -->
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="!isLoggedIn">
              <a class="btn btn-outline-danger" href="/user/login">Đăng nhập</a>
            </li>
            <li class="nav-item ms-2" v-if="!isLoggedIn">
              <a class="btn btn-outline-danger" href="/user/signup">Đăng ký</a>
            </li>
            <li class="nav-item" v-else="isLoggedIn">
              <span class="username text-danger">{{ userInfo.FULLNAME || 'User' }}</span>
            </li>
            <li class="nav-item d-flex align-items-center" v-else="isLoggedIn">
              <div class="avatar me-2">
                {{ getInitials(userInfo.FULLNAME) }}
              </div>
              <span class="username text-danger me-3">{{ userInfo.FULLNAME || 'User' }}</span>
              <a class="btn btn-danger" href="#" @click="logout">Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MenuCategory from './MenuCategory.vue';

export default {
  name: 'HeaderComponent',
  components: {
    MenuCategory
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'userInfo']),
    headerClass() {
      return this.$route.path === '/menu/best-seller' ? 'header absolute' : 'header sticky';
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
  }
};
</script>




<style lang="scss">
@import "./HeaderUser.scss";
</style>
