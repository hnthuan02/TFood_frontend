<template>
  <header>
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
            <li class="nav-item dropdown">
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
            <li class="nav-item ms-2" v-if="isLoggedIn">
              <a class="btn btn-danger" href="#" @click="logout">Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import MenuCategory from './MenuCategory.vue';

export default {
  name: 'HeaderComponent',

  components: {
    MenuCategory
  },

  data() {
    return {
      isLoggedIn: false // Giả lập trạng thái đăng nhập, cập nhật trạng thái này theo logic thực tế của bạn
    };
  },
  methods: {
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
    logout() {
      // Xử lý logic đăng xuất ở đây
      console.log('User logged out');
      this.isLoggedIn = false; // Cập nhật trạng thái đăng nhập
    },
    navigateToMenu() {
      window.location.href = '/menu'; // Điều hướng đến trang /menu
    }
  }
};
</script>





<style lang="scss">
header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background 0.4s ease-in-out;

  .navbar {
    padding: 10px 0;
    //background: linear-gradient(to right, #ffffff 70%, #ee4545 30%);
    position: relative;

    .container {
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .logo img {
        height: 50px;
      }

      .navbar-toggler {
        border: none;
        background: transparent;

        .navbar-toggler-icon {
          display: block;
          width: 30px;
          height: 3px;
          background-color: #333;
          position: relative;

          &:before,
          &:after {
            content: '';
            display: block;
            width: 30px;
            height: 3px;
            background-color: #333;
            position: absolute;
            left: 0;
            transition: transform 0.3s ease;
          }

          &:before {
            top: -8px;
          }

          &:after {
            top: 8px;
          }
        }
      }

      .navbar-collapse {
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 15px;

          .nav-item {
            position: relative;

            .nav-link {
              color: #333;
              padding: 10px 15px;
              border-radius: 5px;
              transition: color 0.3s, background-color 0.3s;
              overflow: hidden;
              display: inline-block;

              &:hover {
                color: #fff;
                background-color: #f80000;
              }

              &:hover::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 5px;
                box-sizing: border-box;
                transition: opacity 0.3s;
                opacity: 1;
                pointer-events: none;
              }
            }
          }

          .dropdown-menu {
            background-color: #ffffff;
            border: 1px solid #e3e3e3;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

            .dropdown-item {
              color: #f70a0a;
              transition: background-color 0.3s;

              &:hover {
                background-color: #f5988d;
                color: white;
              }
            }
          }
        }
      }

      .nav-item .btn {
        padding: 8px 15px;
        border-radius: 25px;
        font-weight: 500;
        transition: background-color 0.3s ease, color 0.3s ease;

        &:hover {
          color: #050000;
          background-color: #f0f0f0;
        }

        &.btn-outline-primary {
          color: #007bff;
          border-color: #007bff;

          &:hover {
            background-color: #ff6200;
            color: #ffffff;
          }
        }

        &.btn-primary {
          background-color: #e93d09;
          color: #fff;

          &:hover {
            background-color: #c75205;
          }
        }

        &.btn-outline-danger {
          background-color: #fff7f8;
          color: #170101;

          &:hover {
            color: #ffffff;
            background-color: #ee0808;
          }
        }
      }
    }
  }

}
</style>