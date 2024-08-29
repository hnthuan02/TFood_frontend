<template>
  <div class="package-management" v-if="isLoggedIn">
    <div class="title">
      <h2>Danh sách các gói của hệ thống</h2>
    </div>

    <!-- Danh sách các gói -->
    <div class="package-list">
      <div
        v-for="packageItem in packages"
        :key="packageItem._id"
        class="package-card"
      >
        <div class="card-header">
          <h3>
            <strong>{{ packageItem.TITLE }}</strong>
          </h3>
          <p style="margin-top: 10px">{{ packageItem.DESCRIPTION }}</p>
        </div>
        <hr />
        <div class="card-body">
          <p style="margin-top: 10px">
            Giảm ngay {{ packageItem.DISCOUNT }}% khi mua gói này.
          </p>
          <p class="current-price" style="margin-top: 10px">
            {{ formatCurrency(packageItem.COST) }}<span class="vnđ">VNĐ</span>
          </p>
          <p>
            <b>Giá đã giảm:</b>
            <span class="blinking">
              {{
                formatCurrency(
                  calculateDiscountedPrice(
                    packageItem.COST,
                    packageItem.DISCOUNT
                  )
                )
              }}
              <span class="vnđ">VNĐ</span>
            </span>
          </p>
        </div>

        <div class="actionItem">
          <button
            v-if="isLoggedIn"
            @click="showModal(packageItem)"
            class="payment"
          >
            <i class="fa-solid fa-credit-card"></i> Mua ngay
          </button>
        </div>

        <div class="card-footer">
          <h5>Thông tin gói:</h5>
          <p><b>Level:</b> {{ packageItem.LEVEL }}</p>
          <p><b>Số lượng sản phẩm:</b> {{ packageItem.NUMBER_OF_PRODUCT }}</p>
          <p><b>Số lượt bình luận:</b> {{ packageItem.NUMBER_OF_COMMENT }}</p>
          <!-- <p><b>Mô tả:</b> {{ packageItem.DESCRIPTION }}</p> -->
          <p><b>Thời gian:</b> {{ packageItem.MONTH }} tháng</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <a-modal
      v-model:open="isModalVisible"
      :class="'custom-modal'"
      title="Thông tin gói sản phẩm"
      :ok-text="'Mua hàng'"
      @ok="purchasePackage"
      @cancel="handleCancel"
    >
      <!-- Sử dụng v-if để hiển thị a-spin khi isLoading là true -->
      <a-spin :spinning="isLoading" size="large">
        <!-- Nội dung modal sẽ được bao bọc bởi a-spin -->
        <div v-if="!isLoading">
          <div v-if="selectedPackage">
            <div class="card-header">
              <h3>
                <strong>{{ selectedPackage.TITLE }}</strong>
              </h3>
              <p style="margin-top: 10px">{{ selectedPackage.DESCRIPTION }}</p>
            </div>
            <hr />

            <div class="card-body">
              <p style="margin-top: 10px">
                Giảm ngay {{ selectedPackage.DISCOUNT }}% khi mua gói này.
              </p>
              <p class="current-price" style="margin-top: 10px">
                {{ formatCurrency(selectedPackage.COST) }}
                <span class="vnđ">VNĐ</span>
              </p>
              <p>
                <b>Giá đã giảm:</b>
                <span class="discounted-price">
                  {{
                    formatCurrency(
                      calculateDiscountedPrice(
                        selectedPackage.COST,
                        selectedPackage.DISCOUNT
                      )
                    )
                  }}
                  <span class="vnđ">VNĐ</span>
                </span>
              </p>
            </div>
            <div class="card-footer">
              <h5>Thông tin gói:</h5>
              <p><b>Level:</b> {{ selectedPackage.LEVEL }}</p>
              <p>
                <b>Số lượng sản phẩm:</b>
                {{ selectedPackage.NUMBER_OF_PRODUCT }}
              </p>
              <p>
                <b>Số lượt bình luận:</b>
                {{ selectedPackage.NUMBER_OF_COMMENT }}
              </p>
              <p><b>Thời gian:</b> {{ selectedPackage.MONTH }} tháng</p>
            </div>
          </div>

          <!-- Phần chọn phương thức thanh toán -->
          <div class="actionItem">
            <p class="blinking">Bạn có chắc chắn mua gói này???</p>
          </div>
          <div class="paymentGateway">
            <div class="nameMethod">
              <p><strong>Vui lòng chọn phương thức thanh toán:</strong></p>
            </div>
            <div class="payment-options">
              <label for="momoPayment" class="payment-option">
                <input
                  class="payment-option-momo"
                  type="radio"
                  id="momoPayment"
                  value="momo"
                  v-model="paymentGateway"
                />
                <!-- MoMo -->
                <img
                  src="https://event.mediacdn.vn/thumb_w/1000/257767050295742464/image/cca/2023/9/17/momo-16949607838381240407833.jpg"
                  alt="MoMo"
                />
              </label>
              <label for="zalopayPayment" class="payment-option">
                <input
                  class="payment-option-zalo"
                  type="radio"
                  id="zalopayPayment"
                  value="zalopay"
                  v-model="paymentGateway"
                />
                <!-- ZaloPay -->
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                  alt="ZaloPay"
                />
              </label>
            </div>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>

  <div v-else class="denied">
    <h3 class="text-center mt-5">Vui lòng đăng nhập để xử dụng dịch vụ</h3>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axiosClient from "../../../api/axiosClient";
import { message, Modal } from "ant-design-vue";

export default {
  components: {
    "a-modal": Modal,
  },
  computed: {
    ...mapState(["isLoggedIn", "packages"]),
  },
  data() {
    return {
      isLoading: false,
      isModalVisible: false,
      selectedPackage: null,
      paymentGateway: "momo",
    };
  },
  mounted() {
    this.$store.dispatch("fetchPackages");
  },
  methods: {
    calculateDiscountedPrice(originalPrice, discountPercentage) {
      const discount = parseFloat(discountPercentage) / 100;
      const discountedPrice = originalPrice * (1 - discount);
      return discountedPrice.toFixed(2);
    },

    formatCurrency(value) {
      const formattedValue = parseFloat(value)
        .toFixed(0)
        .replace(/\d(?=(\d{3})+$)/g, "$&.");
      return formattedValue;
    },

    showModal(packageItem) {
      this.selectedPackage = packageItem;
      this.isModalVisible = true;
    },

    handleOk() {
      this.isModalVisible = false;
    },

    handleCancel() {
      this.isModalVisible = false;
    },

    async purchasePackage() {
      this.isLoading = true;
      try {
        const requestData = {
          packageId: this.selectedPackage._id,
          paymentGateway: this.paymentGateway,
        };

        // Gửi yêu cầu lên server để xử lý thanh toán
        const response = await axiosClient.post("/invoice/buy", requestData);

        // Lấy URL thanh toán từ response
        const paymentUrl = response.data.url;

        // Chuyển hướng người dùng đến URL thanh toán tương ứng
        window.open(paymentUrl, "_blank");

        this.isModalVisible = false;
      } catch (error) {
        console.error("Error purchasing package:", error);
        message.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Menu.scss";
</style>
