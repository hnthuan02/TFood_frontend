<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <a class="navbar-brand logo" href="index.html">
          <img src="@/assets/logoNoText.png" alt="TFOOD Logo" />
        </a>
        <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation" @click="toggleNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link active" href="index.html">Trang Chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="about-us.html">Giới Thiệu</a></li>
            <li class="nav-item"><a class="nav-link" href="menu.html">Thực Đơn</a></li>
            <li class="nav-item dropdown">
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
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
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

    .container {
      display: flex;
      justify-content: space-between;
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

          .nav-link {
            color: #333;
            transition: color 0.3s;

            &:hover {
              color: #007bff;
            }
          }

          .dropdown-menu {
            background-color: #ffffff;
            border: 1px solid #e3e3e3;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

            .dropdown-item {
              color: #333;
              transition: background-color 0.3s;

              &:hover {
                background-color: #f8f9fa;
              }
            }
          }
        }
      }
    }
  }
}
</style>
