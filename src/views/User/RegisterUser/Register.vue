<template>
  <section class="text-center">
    <div class="container py-5">
      <div class="row justify-content-center align-items-stretch form-banner-row">
        <!-- Banner -->
        <div class="col-md-6 mb-5 mb-md-0 h-100 d-flex justify-content-center align-items-center banner-container">
          <img src="../../../assets/banner.jpg" alt="" class="img-fluid rounded banner-image">
        </div>

        <!-- Form -->
        <div class="col-md-6 d-flex align-items-center form-container">
          <div class="card mx-2 mx-md-5 shadow-5-strong bg-body-light form-card">
            <div class="card-body py-4 px-md-5">
              <h2 class="fw-bold mb-2 text-danger">Đăng ký</h2>
              <form @submit.prevent="handleSubmit">
                <!-- Input group -->
                <div class="form-floating mb-4">
                  <input v-model="form.firstName" type="text" id="form3Example1"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example1" class="text-danger">Họ và tên</label>
                </div>

                <div class="form-floating mb-4">
                  <input v-model="form.lastName" type="text" id="form3Example2"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example2" class="text-danger">Số điện thoại</label>
                </div>

                <div class="form-floating mb-4">
                  <input v-model="form.email" type="email" id="form3Example3"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example3" class="text-danger">Email</label>
                </div>

                <div class="form-floating mb-4">
                  <input v-model="form.address" type="text" id="form3Example4"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example4" class="text-danger">Địa chỉ</label>
                </div>

                <div class="form-floating mb-4">
                  <input v-model="form.password" type="password" id="form3Example5"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example5" class="text-danger">Mật khẩu</label>
                </div>
                <div class="form-floating mb-4">
                  <input v-model="form.password" type="password" id="form3Example5"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example5" class="text-danger">Xác nhận mật khẩu</label>
                </div>
                <div class="d-grid">
                  <button type="submit" class=" btn btn-danger rounded-pill btn-block mb-4">Đăng ký</button>
                </div>



                <div class="text-center">
                  <a href="/user/login" class="btn btn-link text-danger">Đã có tài khoản?</a>
                </div>

                <!-- <div class="text-center">
                  <p class="text-muted">hoặc đăng ký với:</p>
                  <button type="button" class="btn btn-link btn-floating mx-1 text-danger">
                    <i class="fab fa-facebook-f"></i>
                  </button>

                  <button type="button" class="btn btn-link btn-floating mx-1 text-danger">
                    <i class="fab fa-google"></i>
                  </button>

                  <button type="button" class="btn btn-link btn-floating mx-1 text-danger">
                    <i class="fab fa-twitter"></i>
                  </button>

                  <button type="button" class="btn btn-link btn-floating mx-1 text-danger">
                    <i class="fab fa-github"></i>
                  </button>
                </div> -->
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
      }
    };
  },
  mounted() {
    this.syncBannerHeight();
    window.addEventListener('resize', this.syncBannerHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.syncBannerHeight);
  },
  methods: {
    handleSubmit() {
      // Xử lý logic gửi form ở đây
      console.log('Form submitted:', this.form);
      // Bạn có thể muốn gọi API ở đây
    },
    syncBannerHeight() {
      const formHeight = this.$refs.formCard.clientHeight;
      this.$refs.bannerContainer.style.height = `${formHeight}px`;
    }
  }
};
</script>

<style scoped>
/* Đảm bảo phần banner và form có chiều cao bằng nhau */
.form-banner-row {
  display: flex;
  align-items: stretch;
  height: 100vh;
}

.banner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-image {
  width: 100%;
  object-fit: cover;
  height: 100%;
}

.form-card {
  width: 100%;
  max-width: 100%;
}

/* Custom styles for input focus effects */
.form-floating>.form-control:focus~label,
.form-floating>.form-control:not(:placeholder-shown)~label {
  transform: scale(0.85) translateY(-1.5rem);
  opacity: 1;
  color: #dc3545;
}

.form-floating>.form-control {
  border-radius: 0.5rem;
}

.form-label {
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.form-control:focus {
  box-shadow: none;
  border-color: #dc3545;
}

.card {
  border: 1px solid rgba(220, 53, 69, 0.3);
}

/* Thêm hiệu ứng fade-in cho banner và form */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.banner-container,
.form-card {
  animation: fadeIn 1s ease-out;
}

/* Hiệu ứng cho nút đăng ký */
.btn-danger,
.text-danger {
  animation: fadeIn 1.5s ease-out;
  animation-delay: 0s;
}
</style>
