<template>
  <section class="my text-center">
    <div class="container py-5">
      <div class="row justify-content-center align-items-stretch form-banner-row">
        <!-- Banner -->
        <div ref="bannerContainer"
          class="col-md-6 mb-5 mb-md-0 h-100 d-flex justify-content-center align-items-center banner-container">
          <img src="../../../assets/backgroundBannner.webp" alt="" class="img-fluid rounded banner-image">
        </div>

        <!-- Login Form -->
        <div class="col-md-6 d-flex align-items-center form-container">
          <div ref="formCard" class="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary form-card">
            <div class="card-body py-4 px-md-5">
              <h2 class="fw-bold mb-4">Đăng nhập</h2>
              <form @submit.prevent="handleSubmit">
                <!-- Input group -->
                <div class="form-floating mb-4">
                  <input v-model="identifier" type="text" id="form3Example1"
                    class="form-control form-control-lg border-submit" placeholder=" " />
                  <label for="form3Example1" class="text-submit">Email hoặc SĐT</label>
                </div>

                <div class="form-floating mb-2">
                  <input v-model="password" type="password" id="form3Example2"
                    class="form-control form-control-lg border-submit" placeholder=" " />
                  <label for="form3Example2" class="text-submit">Mật khẩu</label>
                </div>
                <div class="mb-3 d-flex justify-content-between">
                  <a href="/user/signup" class="btn btn-link text-formLogin">Chưa có tài khoản?</a>
                  <a href="#" class="btn btn-link text-formLogin" data-bs-toggle="modal"
                    data-bs-target="#forgotPasswordModal">Quên mật khẩu?</a>
                </div>
                <div class="d-grid mb-4">
                  <button type="submit" class="btn btn-submit rounded-pill btn-block">Đăng nhập</button>
                </div>
                <div class="text-center mb-4">
                  <p class="text-formLogin">hoặc đăng nhập bằng:</p>
                  <div class="d-grid mb-4">
                    <button type="button" class="btn btn-google rounded-pill mb-2 btn-block">
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

    <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel"
      aria-hidden="false" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-5-strong bg-body-tertiary">
          <div class="modal-header border-0">
            <h5 class="modal-title text-light fw-bold" id="forgotPasswordModalLabel">Quên mật khẩu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-5">
            <form @submit.prevent="handleForgotPassword">
              <div class="form-floating mb-4">
                <input type="email" v-model="currentEmail" class="form-control border-submit" id="forgotPasswordEmail"
                  placeholder=" " required>
                <label for="forgotPasswordEmail" class="text-form">Nhập email của bạn</label>
              </div>

              <div v-if="showOtpField" class="form-floating mb-4">
                <input type="text" v-model="otpResetPass" class="form-control border-submit" id="otpInput"
                  placeholder=" " required>
                <label for="otpInput" class="text-form">Nhập mã OTP</label>
              </div>

              <div v-if="showNewPasswordField" class="form-floating mb-4">
                <input type="password" v-model="newPassword" class="form-control border-submit" id="passwordInput"
                  placeholder=" " required>
                <label for="newPasswordInput" class="text-form">Nhập mật khẩu mới</label>
              </div>
              <div v-if="showConfirmNewPasswordField" class="form-floating mb-4">
                <input type="password" v-model="confirmNewPassword" class="form-control border-submit"
                  id="newPasswordInput" placeholder=" " required>
                <label for="newPasswordInput" class="text-form">Xác nhận mật khẩu mới</label>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-submit rounded-pill">{{ showOtpField ? 'Xác nhận' : 'Gửi'
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
import { notification } from 'ant-design-vue';
import { mapActions } from 'vuex';
import axiosClient from '../../../api/axiosClient';


export default {
  data() {
    return {
      form: {
        identifier: "",
        password: "",
      },
      currentEmail: '',
      newPassword: '',
      confirmNewPassword: '',
      forgotPasswordEmail: '',
      showOtpField: false,
      showNewPasswordField: false,
      showConfirmNewPasswordField: false,
      otpResetPass: ''
    };
  },

  methods: {
    ...mapActions(['login']),
    async handleSubmit() {
      const isEmail = this.identifier.includes('@');
      const payload = {
        [isEmail ? 'EMAIL' : 'PHONE_NUMBER']: this.identifier,
        PASSWORD: this.password,
      };
      try {
        await this.login(payload);
        localStorage.setItem('isLoggedIn', 'true');
        notification.success(
          {
            message: 'Đăng nhập thành công!',
            description: 'Chào mừng đến với nhà hàng TFood.',
          }
        );
      } catch (error) {
        this.$message.error(
          error.response?.data?.message || "Đăng nhập thất bại!"
        );
      }
    },

    async handleForgotPassword() {
      try {
        const response = await axiosClient.post("/users/forgotPassword", {
          email: this.currentEmail,
        });
        if (response.data.success) {
          this.$message.success("Vui lòng kiểm tra Email!");
          this.showOtpField = true;
          this.showNewPasswordField = true;
          this.showConfirmNewPasswordField = true;
          this.handleForgotPassword = this.handleResetPassword;
        } else if (response.data.errors) {
          this.errors = response.data.errors;
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error registering user:", error);
          this.$message.error("Đã xảy ra lỗi khi gửi mail!");
        }
      }


    },
    async handleResetPassword() {
      this.errors = {};

      if (this.newPassword !== this.confirmNewPassword) {
        this.errors.confirmNewPassword = "Mật khẩu không khớp!";
        return;
      }
      try {
        const response = await axiosClient.post("/users/resetPassword", {
          email: this.currentEmail,
          otp: this.otpResetPass,
          newPassword: this.newPassword,
        });
        if (response.data.success) {
          notification.success({
            message: 'Thay đổi mật khẩu thành công!',
            description: 'Mật khẩu của bạn đã được thay đổi thành công.',
          });
          setTimeout(() => {
            location.reload();
          }, 300);
        } else if (response.data.errors) {
          this.errors = response.data.errors;
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error registering user:", error);
          notification.error({
            message: 'Đã xảy ra lỗi!',
            description: 'Có lỗi khi gửi mail!',
          });
        }
      }
    },

  }
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
