<template>
  <section class="text-center">
    <div class="container py-5">
      <div class="row justify-content-center align-items-stretch form-banner-row">
        <!-- Banner -->
        <div ref="bannerContainer"
          class="col-md-6 mb-5 mb-md-0 h-100 d-flex justify-content-center align-items-center banner-container">
          <img src="../../../assets/banner.jpg" alt="" class="img-fluid rounded banner-image">
        </div>

        <!-- Login Form -->
        <div class="col-md-6 d-flex align-items-center form-container">
          <div ref="formCard" class="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary form-card">
            <div class="card-body py-5 px-md-5">
              <h2 class="fw-bold mb-4 text-danger">Đăng nhập</h2>
              <form @submit.prevent="handleSubmit">
                <!-- Input group -->
                <div class="form-floating mb-4">
                  <input v-model="form.identifier" type="text" id="form3Example1"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example1" class="text-danger">Email hoặc SĐT</label>
                </div>

                <div class="form-floating mb-2">
                  <input v-model="form.password" type="password" id="form3Example2"
                    class="form-control form-control-lg border-danger" placeholder=" " />
                  <label for="form3Example2" class="text-danger">Mật khẩu</label>
                </div>
                <div class="mb-3 d-flex justify-content-between">
                  <a href="/user/signup" class="btn btn-link text-danger">Đã có tài khoản?</a>
                  <a href="#" class="btn btn-link text-danger" data-bs-toggle="modal"
                    data-bs-target="#forgotPasswordModal">Quên mật khẩu?</a>
                </div>
                <div class="d-grid mb-4">
                  <button type="submit" class="btn btn-danger rounded-pill btn-block">Đăng nhập</button>
                </div>
                <div class="text-center mb-4">
                  <p class="text-muted">hoặc đăng nhập bằng:</p>
                  <div class="d-grid mb-4">
                    <button type="button" class="btn btn-google rounded-pill mb-2">
                      <i class="fab fa-google"></i> Google
                    </button>
                  </div>
                  <div class="d-grid mb-4">
                    <button type="button" class="btn btn-facebook rounded-pill mb-2">
                      <i class="fab fa-facebook-f"></i> Facebook
                    </button>
                  </div>
                  <div class="d-grid mb-4">
                    <button type="button" class="btn btn-apple rounded-pill mb-2">
                      <i class="fab fa-apple"></i> Apple
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-5-strong bg-body-tertiary">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger fw-bold" id="forgotPasswordModalLabel">Quên mật khẩu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-5">
            <form @submit.prevent="handleForgotPassword">
              <div class="form-floating mb-4">
                <input type="email" v-model="forgotPasswordEmail" class="form-control border-danger"
                  id="forgotPasswordEmail" placeholder=" " required>
                <label for="forgotPasswordEmail" class="text-danger">Nhập email của bạn</label>
              </div>

              <!-- Trường OTP xuất hiện ngay dưới ô nhập email khi showOtpField là true -->
              <div v-if="showOtpField" class="form-floating mb-4">
                <input type="text" v-model="otp" class="form-control border-danger" id="otpInput" placeholder=" "
                  required>
                <label for="otpInput" class="text-danger">Nhập mã OTP</label>
              </div>

              <div class="d-grid">
                <!-- Nút "Gửi" chuyển thành "Xác nhận" khi hiển thị trường OTP -->
                <button type="submit" class="btn btn-danger rounded-pill">{{ showOtpField ? 'Xác nhận' : 'Gửi'
                  }}</button>
              </div>
            </form>
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
        identifier: '',
        password: ''
      },
      forgotPasswordEmail: '', // Email nhập vào trong modal quên mật khẩu
      showOtpField: false, // Biến để kiểm soát việc hiển thị trường OTP
      otp: '' // Biến để lưu giá trị OTP nhập vào
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
      console.log('Login submitted:', this.form);
    },
    handleForgotPassword() {
      // Giả lập gửi email khôi phục mật khẩu
      console.log('Email khôi phục mật khẩu:', this.forgotPasswordEmail);

      // Hiển thị trường OTP sau khi gửi email
      this.showOtpField = true;
    },
    handleOtpSubmit() {
      // Xử lý logic OTP ở đây
      console.log('OTP đã nhập:', this.otp);

      // Ẩn modal sau khi xử lý OTP thành công
      const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
      modal.hide();
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
  height: 100%;
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

/* Custom styles for social login buttons */
.btn-google {
  background-color: #28A745;
  color: white;
}

.btn-facebook {
  background-color: #3b5998;
  color: white;
}

.btn-apple {
  background-color: #333;
  color: white;
}

.btn-google:hover,
.btn-facebook:hover,
.btn-apple:hover {
  opacity: 0.8;
}

.btn i {
  margin-right: 0.5rem;
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
.form-card,
.modal-content {
  animation: fadeIn 1s ease-out;
}

/* Hiệu ứng cho nút đăng ký */
.btn-danger,
.text-danger {
  animation: fadeIn 1.5s ease-out;
  animation-delay: 0s;
}

/* Modal styles */
.modal-header {
  border-bottom: none;
}

.modal-content {
  border-radius: 0.5rem;
  padding: 20px;
}

.modal-body {
  padding: 20px;
}

.modal-title {
  font-weight: bold;
  color: #dc3545;
}
</style>
