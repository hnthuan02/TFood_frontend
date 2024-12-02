<template>
    <div class="contain-page">
        <div class="user-profile">
            <h1 class="profile-title">Thông tin người dùng</h1>
            <div class="profile-info">
                <div class="info-item">
                    <span class="info-label">ID người dùng:</span>
                    <span class="info-value">{{ user._id }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Họ và tên:</span>
                    <span class="info-value">{{ user.FULLNAME }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Số điện thoại:</span>
                    <span class="info-value">{{ user.PHONE_NUMBER }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ user.EMAIL }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tổng tiền đã đặt:</span>
                    <span class="info-value">{{ formatCurrency(totalBookingAmount) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tổng điểm tích luỹ:</span>
                    <span class="info-value">{{ user.CUMULATIVE_POINTS }}</span>
                </div>
            </div>

            <div class="button-group">
                <button class="btn-edit" @click="showEditModal">Chỉnh sửa</button>
                <button class="btn-change-password" @click="showChangePasswordModal">Đổi mật khẩu</button>
                <button class="btn-history" @click="goToBookingHistory">Lịch sử đặt bàn</button>
            </div>

            <div v-if="isPasswordModalVisible" class="modal-overlay" @click.self="closePasswordModal">
                <div class="modal-content">
                    <h2>Đổi mật khẩu</h2>
                    <form @submit.prevent="sendForgotPasswordEmail">
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" v-model="user.EMAIL" disabled />
                        </div>
                        <div class="buttons">
                            <button type="submit" class="btn-confirm">Gửi OTP</button>
                            <button type="button" @click="closePasswordModal" class="btn-close">Đóng</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Form nhập OTP và mật khẩu mới -->
            <div v-if="isOTPPasswordVisible" class="modal-overlay" @click.self="closeOTPPasswordModal">
                <div class="modal-content">
                    <h2>Nhập OTP và mật khẩu mới</h2>
                    <form @submit.prevent="resetPassword">
                        <div class="form-group">
                            <label for="otp">OTP:</label>
                            <input type="text" id="otp" v-model="otpPassword" required />
                        </div>
                        <div class="form-group">
                            <label for="newPassword">Mật khẩu mới:</label>
                            <input type="password" id="newPassword" v-model="newPassword" required />
                        </div>
                        <div class="buttons">
                            <button type="submit" class="btn-confirm">Xác nhận</button>
                            <button type="button" @click="closeOTPPasswordModal" class="btn-close">Đóng</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal Chỉnh sửa thông tin người dùng -->
            <div v-if="isModalVisible" class="modal-overlay" @click.self="closeEditModal">
                <div class="modal-content">
                    <h2>Chỉnh sửa thông tin người dùng</h2>
                    <form @submit.prevent="validateFormBeforeOtp">
                        <div class="form-group">
                            <label for="fullname">Họ tên:</label>
                            <input type="text" id="fullname" v-model="form.FULLNAME" required />
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" v-model="form.EMAIL" required />
                        </div>
                        <div class="form-group">
                            <label for="phone">Số điện thoại:</label>
                            <input type="text" id="phone" v-model="form.PHONE_NUMBER" required />
                        </div>
                        <div class="form-group">
                            <label for="password">Nhập mật khẩu xác nhận:</label>
                            <input type="password" id="password" v-model="passwordConfirm" required />
                        </div>

                        <div class="buttons">
                            <button type="submit" class="btn-confirm">Xác nhận</button>
                            <button type="button" @click="closeEditModal" class="btn-close">Đóng</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Popup Nhập OTP -->
            <div v-if="isOTPVisible" class="otp-popup">
                <div class="otp-popup-content">
                    <h3>Nhập OTP</h3>
                    <input type="text" v-model="otp" placeholder="Nhập mã OTP" required />
                    <button @click="verifyOTP" class="btn-confirm">Xác thực OTP</button>
                    <button @click="closeOTPModal" class="btn-close">Đóng</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosClient from '../../../api/axiosClient';

export default {
    data() {
        return {
            user: {},
            totalBookingAmount: 0,
            isModalVisible: false,
            form: {
                FULLNAME: '',
                EMAIL: '',
                PHONE_NUMBER: '',
            },
            passwordConfirm: '',
            isOTPVisible: false, // Trạng thái hiển thị form OTP
            otp: '', // Giá trị OTP nhập vào
            isEmailChanged: false, // Trạng thái để kiểm tra xem email có thay đổi không
            isPasswordModalVisible: false, // Hiển thị modal đổi mật khẩu
            isOTPPasswordVisible: false, // Hiển thị form nhập OTP và mật khẩu mới
            otpPassword: '', // Giá trị OTP nhập vào
            newPassword: '', // Mật khẩu mới
        };
    },
    async created() {
        await this.fetchUserProfile();
        await this.fetchTotalBookingAmount();
    },
    methods: {
        async fetchTotalBookingAmount() {
            try {
                const response = await axiosClient.get('http://localhost:3001/booking/total-amount-by-user');
                if (response.data.success) {
                    this.totalBookingAmount = response.data.totalAmount;
                } else {
                    console.error('Lỗi khi lấy tổng số tiền đã đặt:', response.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy tổng số tiền đã đặt:', error);
            }
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        },
        goToBookingHistory() {
            this.$router.push('/user/booked'); // Chuyển hướng đến trang /user/booked
        },
        async fetchUserProfile() {
            try {
                const response = await axiosClient.get('http://localhost:3001/users/profile');
                this.user = response.data;
                // Khởi tạo form với thông tin người dùng
                this.form.FULLNAME = this.user.FULLNAME;
                this.form.EMAIL = this.user.EMAIL;
                this.form.PHONE_NUMBER = this.user.PHONE_NUMBER;
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        },
        showEditModal() {
            this.isModalVisible = true;
        },
        closeEditModal() {
            this.isModalVisible = false;
            this.passwordConfirm = ''; // Reset password confirm
            this.isOTPVisible = false; // Ẩn form OTP khi đóng modal
            this.otp = ''; // Reset OTP
        },
        validateFormBeforeOtp() {
            // Kiểm tra nếu email đã thay đổi
            this.isEmailChanged = this.form.EMAIL !== this.user.EMAIL;

            // Kiểm tra nếu mật khẩu chưa được nhập
            if (this.isEmailChanged && !this.passwordConfirm) {
                this.$message.error("Bạn cần nhập mật khẩu trước khi thay đổi email.");
                return;
            }

            // Nếu email đã thay đổi và mật khẩu đã nhập, hiển thị form OTP
            if (this.isEmailChanged) {
                this.showOtpForm();
                this.updateEmail();
            } else {
                this.updateUserInfo(); // Cập nhật thông tin nếu không thay đổi email
            }
        },
        showOtpForm() {
            this.isOTPVisible = true; // Hiển thị form OTP
        },
        async verifyOTP() {
            try {
                const response = await axiosClient.post('http://localhost:3001/users/verifyUserByOTP', {
                    email: this.form.EMAIL,
                    otp: this.otp
                });

                if (response.data.success) {
                    this.$message.success('OTP xác thực thành công!');
                    location.reload();
                } else {
                    this.$message.error('Mã OTP không hợp lệ!');
                }
            } catch (error) {
                console.error('Lỗi khi xác thực OTP:', error);
                this.$message.error('Xác thực OTP thất bại!');
            }
        },
        async updateEmail() {
            const payload = {
                EMAIL: this.form.EMAIL,
                PASSWORD: this.passwordConfirm, // Thêm mật khẩu vào payload
            };

            try {
                await axiosClient.put('http://localhost:3001/users/editUser', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.showOtpForm();
            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
                this.$message.error('Cập nhật Email thất bại!');
            }
        },
        async updateUserInfo() {
            try {
                // Kiểm tra mật khẩu xác nhận
                if (!this.passwordConfirm) {
                    this.$message.error('Vui lòng nhập mật khẩu xác nhận.');
                    return;
                }

                // Tạo payload chỉ chứa các trường đã thay đổi
                const payload = {};
                if (this.form.FULLNAME !== this.user.FULLNAME) {
                    payload.FULLNAME = this.form.FULLNAME;
                }
                if (this.form.PHONE_NUMBER !== this.user.PHONE_NUMBER) {
                    payload.PHONE_NUMBER = this.form.PHONE_NUMBER;
                }

                // Nếu không có trường nào thay đổi, không gửi yêu cầu
                if (Object.keys(payload).length === 0) {
                    this.$message.error('Không có thay đổi nào để cập nhật.');
                    return;
                }

                payload.PASSWORD = this.passwordConfirm; // Thêm mật khẩu vào payload

                await axiosClient.put('http://localhost:3001/users/editUser', payload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                this.$message.success('Cập nhật thông tin thành công!');
                this.closeEditModal();
                await this.fetchUserProfile(); // Cập nhật lại thông tin người dùng
            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
                this.$message.error('Cập nhật thông tin thất bại!');
            }
        },
        closeOTPModal() {
            this.isOTPVisible = false; // Đóng popup OTP
        },

        // Hiển thị modal đổi mật khẩu
        showChangePasswordModal() {
            this.isPasswordModalVisible = true;
        },

        // Đóng modal đổi mật khẩu
        closePasswordModal() {
            this.isPasswordModalVisible = false;
        },

        // Gửi yêu cầu đến API để gửi OTP qua email
        async sendForgotPasswordEmail() {
            try {
                await axiosClient.post('http://localhost:3001/users/forgotPassword', {
                    email: this.user.EMAIL,
                });
                this.$message.success('OTP đã được gửi đến email của bạn.');
                this.isPasswordModalVisible = false;
                this.isOTPPasswordVisible = true; // Hiển thị form nhập OTP và mật khẩu mới
            } catch (error) {
                console.error('Lỗi khi gửi OTP:', error);
                this.$message.error('Không thể gửi OTP. Vui lòng thử lại.');
            }
        },

        // Đóng modal nhập OTP và mật khẩu mới
        closeOTPPasswordModal() {
            this.isOTPPasswordVisible = false;
        },

        // Gửi yêu cầu API để cập nhật mật khẩu mới
        async resetPassword() {
            try {
                const response = await axiosClient.post('http://localhost:3001/users/resetPassword', {
                    email: this.user.EMAIL,
                    otp: this.otpPassword,
                    newPassword: this.newPassword,
                });
                if (response.data.success) {
                    this.$message.success('Mật khẩu đã được thay đổi thành công.');
                    this.closeOTPPasswordModal();
                } else {
                    this.$message.error('OTP không chính xác hoặc hết hạn.');
                }
            } catch (error) {
                console.error('Lỗi khi đổi mật khẩu:', error);
                this.$message.error('Không thể thay đổi mật khẩu. Vui lòng thử lại.');
            }
        },
    }
};
</script>


<style scoped>
.contain-page {
    background-image: url(https://i.pinimg.com/474x/2f/ea/20/2fea20034894e0b7960cd1c402f2d91d.jpg);
    padding-top: 50px;
    padding-bottom: 50px;
}

.user-profile {

    max-width: 700px;
    margin: 0px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
    color: #2c3e50;
}


.profile-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
}

.profile-info {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
    margin-top: 20px;
}

.info-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-label {
    font-weight: bold;
    color: #555;
}

.info-value {
    margin-left: auto;
    color: #333;
    font-size: 16px;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}

.btn-edit,
.btn-change-password,
.btn-history {
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
}

.btn-edit {
    background-color: #3498db;
}


.btn-edit:hover {
    background-color: #2980b9;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-family: 'Roboto', sans-serif;
}

.modal-content h2 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #2c3e50;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.btn-confirm,
.btn-close {
    width: 48%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px 1%;
    text-align: center;
}

.btn-confirm {
    background-color: #2ecc71;
    color: white;
}

.btn-confirm:hover {
    background-color: #27ae60;
    color: white;
}

.btn-close {
    background-color: #e74c3c;
    color: white;
}

.btn-close:hover {
    background-color: #c0392b;
    color: #fff;
}

.button-group {
    display: flex;
    justify-content: space-between;
}


.otp-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.otp-popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
}

.otp-popup-content input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn-confirm {
    background-color: #2ecc71;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-confirm:hover {
    background-color: #4d6e8e;
}

.btn-close {
    background-color: #e74c3c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-close:hover {
    background-color: #c0392b;
}


.buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
    --b: 5px;
    /* the border thickness */
    --h: 1.8em;
    /* the height */
}

.buttons button {
    --_c: #33485D;
    flex: calc(1.25 + var(--_s, 0));
    min-width: 0;
    font-size: 20px;
    font-weight: bold;
    height: var(--h);
    cursor: pointer;
    color: var(--_c);
    border: var(--b) solid var(--_c);
    background:
        conic-gradient(at calc(100% - 1.3*var(--b)) 0, var(--_c) 209deg, #0000 211deg) border-box;
    clip-path: polygon(0 0, 100% 0, calc(100% - 0.577*var(--h)) 100%, 0 100%);
    padding: 0 calc(0.288*var(--h)) 0 0;
    margin: 0 calc(-0.288*var(--h)) 0 0;
    box-sizing: border-box;
    transition: flex .4s;
}

.buttons button+button {
    --_c: #FF003C;
    flex: calc(.75 + var(--_s, 0));
    background:
        conic-gradient(from -90deg at calc(1.3*var(--b)) 100%, var(--_c) 119deg, #0000 121deg) border-box;
    clip-path: polygon(calc(0.577*var(--h)) 0, 100% 0, 100% 100%, 0 100%);
    margin: 0 0 0 calc(-0.288*var(--h));
    padding: 0 0 0 calc(0.288*var(--h));
}

.buttons button:focus-visible {
    outline-offset: calc(-2*var(--b));
    outline: calc(var(--b)/2) solid #000;
    background: none;
    clip-path: none;
    margin: 0;
    padding: 0;
}

.buttons button:focus-visible+button {
    background: none;
    clip-path: none;
    margin: 0;
    padding: 0;
}

.buttons button:has(+ button:focus-visible) {
    background: none;
    clip-path: none;
    margin: 0;
    padding: 0;
}

button:hover,
button:active:not(:focus-visible) {
    --_s: .75;
}

button:active {
    box-shadow: inset 0 0 0 100vmax var(--_c);
    color: #fff;
}

/* Thêm nút Đổi mật khẩu */
.btn-change-password {
    background-color: #e67e22;
}

.btn-change-password:hover {
    background-color: #d35400;
}

.btn-history {
    background-color: #06c03a;
}

.btn-history:hover {
    background-color: #047260;
}

@media (max-width: 768px) {
    .user-profile {
        padding: 20px;
    }

    .info-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .info-value {
        margin-top: 5px;
    }
}
</style>
