<template>
    <div class="containPage">
      <section>
        <div class="container h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-xl-10">
              <div class="card loginForm">
                <div class="row g-0">
                  <div class="col-md-6 col-lg-6">
                    <div class="wrapper">
                      <div class="title">Welcome Back!</div>
                      <p>
                        Hãy đến với Passages, bạn sẽ có được kiến thức, kinh
                        nghiệm và trải nghiệm.
                      </p>
                      <router-link to="/user/login" class="button btn-login">
                        <span>LOGIN</span>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-6 d-flex align-items-center">
                    <div class="card-body p-4 p-lg-4 text-black">
                      <form
                        @submit.prevent="register"
                        enctype="multipart/form-data"
                      >
                        <div class="d-flex align-items-center mb-3">
                          <div class="titleWeb">Create account</div>
                        </div>
                        <div class="fw-normal desLogin">
                          Register for a store employee account
                        </div>
                        
                        <div class="group">
                          <label for="username"
                            ><i class="fa-solid fa-user iconForm"></i
                          ></label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            v-model="username"
                            class="groupInput"
                            autocomplete="off"
                            placeholder="Nhập họ tên"
                            required
                          />
                        </div>
                        <div class="group">
                          <label for="fullname"
                            ><i class="fa-solid fa-signature"></i>
                          </label>
                          <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            v-model="fullname"
                            class="groupInput"
                            autocomplete="off"
                            placeholder="Nhập họ và tên"
                            required
                          />
                        </div>
  
                        <div class="group">
                          <label for="email"
                            ><i class="fa-regular fa-envelope"></i
                          ></label>
                          <input
                            type="text"
                            id="email"
                            name="email"
                            v-model="email"
                            class="groupInput"
                            autocomplete="off"
                            placeholder="Nhập email"
                            required
                          />
                        </div>
                        <div class="group2">
                          <label for="password"
                            ><i class="fa-solid fa-lock iconForm"></i
                          ></label>
                          <input
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            name="password"
                            id="password"
                            class="groupInput"
                            autocomplete="off"
                            placeholder="Nhập mật khẩu"
                            required
                          />
                          <div @click="toggleShowPassword" class="iconPassword">
                            <div v-if="showPassword">
                              <i class="fa-solid fa-eye"></i>
                            </div>
                            <div v-else>
                              <i class="fa-solid fa-eye-slash"></i>
                            </div>
                          </div>
                        </div>
                        <div class="pt-1 mb-4">
                          <button class="btnPay" type="submit">SIGN UP</button>
                        </div>
                      </form>
                      <a-modal v-model:visible="otpModalVisible" title="Nhập mã OTP" @cancel="cancelOTP">
                        <input type="text" v-model="otp" placeholder="Nhập mã OTP" />
                        <a-button type="primary" @click="submitOTP">Xác nhận</a-button>
                      </a-modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
    import { message, Modal } from 'ant-design-vue';
    const register = async () => {
  try {
    // Thực hiện yêu cầu đăng ký tài khoản tới server
    const response = await axios.post('/api/register', {
      username: username.value,
      fullname: fullname.value,
      email: email.value,
      password: password.value,
    });

    // Kiểm tra xem yêu cầu có thành công không
    if (response.status === 200) {
      // Nếu thành công, hiển thị thông báo và mở hộp thoại nhập OTP
      message.success('Đăng ký thành công!');
      openOtpModal();
    } else {
      // Nếu không thành công, hiển thị thông báo lỗi
      message.error('Đăng ký thất bại!');
    }
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình xử lý yêu cầu, hiển thị thông báo lỗi
    console.error('Error:', error);
    message.error('Đã xảy ra lỗi khi đăng ký!');
  }
};

// Hàm để mở hộp thoại nhập OTP
const openOtpModal = () => {
  Modal.confirm({
    title: 'Nhập mã OTP',
    content: 'Vui lòng nhập mã OTP đã được gửi tới email của bạn:',
    onOk() {
      // Xử lý khi người dùng nhấn nút OK
      // Ví dụ: validateOtp(otpInput.value);
    },
    onCancel() {
      // Xử lý khi người dùng nhấn nút Cancel
      // Ví dụ: closeOtpModal();
    },
  });
};
  
  </script>
  <style lang="scss" scoped>
  @import "./RegisterUser.scss";
  </style>
  