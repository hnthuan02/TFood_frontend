<template>
  <section class="text-center">
    <div class="container py-5">
      <div class="row justify-content-center align-items-stretch form-banner-row">
        <div class="col-md-6 mb-5 mb-md-0 h-100 d-flex justify-content-center align-items-center banner-container">
          <img src="../../../assets/backgroundBannner.webp" alt="" class="img-fluid rounded banner-image">
        </div>
        <div class="col-md-6 d-flex align-items-center form-container">
          <div class="card mx-2 mx-md-5 shadow-5-strong bg-body-light form-card">
            <div class="card-body py-4 px-md-5">
              <h2 class="fw-bold mb-2 text-formLogin">Đăng ký</h2>
              <form @submit.prevent="handleSubmit">
                <div class="form-floating mb-4">
                  <input v-model="FULLNAME" type="text" id="form3Example1"
                    class="form-control form-control-lg border-primary" placeholder=" " />
                  <label for="form3Example1" class="text-form">Họ và tên</label>
                  <span v-if="errors.FULLNAME" class="text-danger">{{ errors.FULLNAME }}</span>
                </div>
                <div class="form-floating mb-4">
                  <input v-model="PHONE_NUMBER" type="text" id="form3Example2"
                    class="form-control form-control-lg border-primary" placeholder=" " />
                  <label for="form3Example2" class="text-form">Số điện thoại</label>
                  <span v-if="errors.PHONE_NUMBER" class="text-danger">{{ errors.PHONE_NUMBER }}</span>
                </div>
                <div class="form-floating mb-4">
                  <input v-model="EMAIL" type="email" id="form3Example3"
                    class="form-control form-control-lg border-primary" placeholder=" " />
                  <label for="form3Example3" class="text-form">Email</label>
                  <span v-if="errors.EMAIL" class="text-danger">{{ errors.EMAIL }}</span>
                </div>
                <div class="form-floating mb-4">
                  <input v-model="ADDRESS" type="text" id="form3Example4"
                    class="form-control form-control-lg border-primary" placeholder=" " />
                  <label for="form3Example4" class="text-form">Địa chỉ</label>
                  <span v-if="errors.ADDRESS" class="text-danger">{{ errors.ADDRESS }}</span>
                </div>
                <div class="form-floating mb-4">
                  <input v-model="PASSWORD" type="password" id="form3Example5"
                    class="form-control form-control-lg border-primary" placeholder=" " />
                  <label for="form3Example5" class="text-form">Mật khẩu</label>
                  <span v-if="errors.PASSWORD" class="text-danger">{{ errors.PASSWORD }}</span>
                </div>
                <div class="form-floating mb-4">
                  <input v-model="confirmPassword" type="password" id="form3Example6"
                    class="form-control form-control-lg border-primary" placeholder=" " />
                  <label for="form3Example6" class="text-form">Xác nhận mật khẩu</label>
                  <span v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</span>
                </div>
                <div class="d-grid">
                  <button type="submit" class=" btn btn-danger rounded-pill btn-block mb-4">Đăng
                    ký</button>
                </div>

                <div class="text-center">
                  <a href="/user/login" class="btn btn-link text-formLogin">Đã có tài khoản?</a>
                </div>
              </form>

              <div class="modal fade" id="otpModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="otpModalLabel">Xác thực OTP</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <p>Mã OTP đã được gửi đến địa chỉ email {{ EMAIL }}. Vui lòng kiểm tra email
                        để xác thực.</p>
                      <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="otpInput" v-model="otp" placeholder="Nhập mã OTP">
                        <label for="otpInput">Nhập mã OTP</label>
                        <span v-if="otpErrors.otp" class="text-danger">{{ otpErrors.otp
                          }}</span>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                      <button @click.prevent="verifyOtp" type="button" class="btn btn-danger">Xác
                        thực</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axiosClient from '../../../api/axiosClient';

export default {
  data() {
    return {
      FULLNAME: "",
      EMAIL: "",
      ADDRESS: "",
      PHONE_NUMBER: "",
      PASSWORD: "",
      confirmPassword: "",
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
      otp: "",
      otpErrors: {},
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      // Kiểm tra họ và tên
      if (!this.FULLNAME) {
        this.errors.FULLNAME = "Vui lòng nhập họ và tên.";
      }

      // Kiểm tra số điện thoại
      const phonePattern = /^[0-9]{10,11}$/;
      if (!this.PHONE_NUMBER) {
        this.errors.PHONE_NUMBER = "Vui lòng nhập số điện thoại.";
      } else if (!phonePattern.test(this.PHONE_NUMBER)) {
        this.errors.PHONE_NUMBER = "Số điện thoại không hợp lệ. Chỉ nhập 10-11 chữ số.";
      }

      // Kiểm tra email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.EMAIL) {
        this.errors.EMAIL = "Vui lòng nhập email.";
      } else if (!emailPattern.test(this.EMAIL)) {
        this.errors.EMAIL = "Email không hợp lệ.";
      }

      // Kiểm tra địa chỉ
      if (!this.ADDRESS) {
        this.errors.ADDRESS = "Vui lòng nhập địa chỉ.";
      }

      // Kiểm tra mật khẩu
      if (!this.PASSWORD) {
        this.errors.PASSWORD = "Vui lòng nhập mật khẩu.";
      } else if (this.PASSWORD.length < 8) {
        this.errors.PASSWORD = "Mật khẩu phải chứa ít nhất 8 ký tự.";
      }

      // Kiểm tra xác nhận mật khẩu
      if (this.PASSWORD !== this.confirmPassword) {
        this.errors.confirmPassword = "Mật khẩu không khớp!";
      }
    },
    async handleSubmit() {
      this.validateForm();

      if (Object.keys(this.errors).length > 0) {
        return; // Nếu có lỗi, dừng việc gửi form
      }

      try {
        const response = await axiosClient.post("/users/registerUser", {
          FULLNAME: this.FULLNAME,
          ADDRESS: this.ADDRESS,
          EMAIL: this.EMAIL,
          PHONE_NUMBER: this.PHONE_NUMBER,
          PASSWORD: this.PASSWORD,
        });

        if (response.data.success) {
          this.$message.success("Đăng ký người dùng thành công!");
          const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
          otpModal.show();
        } else if (response.data.errors) {
          this.errors = response.data.errors;
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error registering user:", error);
          this.$message.error("Đã xảy ra lỗi khi đăng ký!");
        }
      }
    },

    async verifyOtp() {
      this.otpErrors = {};

      try {
        const response = await axiosClient.post("/users/verifyUserByOTP", {
          email: this.EMAIL,
          otp: this.otp,
        });

        if (response.data.success) {
          //alert("Xác thực thành công!");
          //location.reload();
          this.$router.push('/user/login');
          setTimeout(() => {
            location.reload();
          }, 400);
        } else if (response.data.errors) {
          this.otpErrors = response.data.errors;
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.otpErrors = error.response.data.errors;
        } else {
          console.error("Error verifying OTP:", error);
          this.$message.error("Đã xảy ra lỗi khi xác thực mã OTP!");
        }
      }
    },

    togglePasswordVisibility(field) {
      if (field === "PASSWORD") {
        this.showPassword = !this.showPassword;
      } else if (field === "confirmPassword") {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
  },
};
</script>

<style lang="scss">
@import "./RegisterUser.scss";
</style>