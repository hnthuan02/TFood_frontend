<template>
  <div class="containPage">
    <h3>Lịch sử mua hàng</h3>
    <div class="contentPage">
      <div class="invoice-list">
        <div v-if="invoices.length === 0" class="orderEmpty">
          <img src="../../../assets/AuthHeader.png" alt="" />
          <p>Đơn hàng trống</p>
        </div>
        <div v-else class="invoice-container">
          <div
            v-for="invoice in invoices"
            :key="invoice._id"
            class="invoice-card"
          >
            <div class="invoice-item">
              <div class="header-card">
                <!-- <div class="name-card">
                  <p>Chi tiết hóa đơn</p>
                </div> -->
                <div class="packageName">
                  <p>{{ invoice.PACKAGE_NAME }}</p>
                </div>
                <div class="status">
                  <p>
                    <strong>{{
                      invoice.PAID ? "Đã thanh toán" : "Chưa thanh toán"
                    }}</strong>
                  </p>
                </div>
              </div>
              <hr />
              <div class="card-body">
                <p>
                  <strong>Số sản phẩm:</strong>
                  {{ formatCurrency(invoice.NUMBER_OF_PRODUCT) }}
                </p>
                <p>
                  <strong>Số comments:</strong>
                  {{ formatCurrency(invoice.NUMBER_OF_COMMENT) }}
                </p>
                <p><strong>Level:</strong> {{ invoice.LEVEL }}</p>
                <p>
                  <strong>Giá:</strong> {{ formatCurrency(invoice.COST) }}
                  <span class="vnđ">đ</span>
                </p>
                <p><strong>Số tháng:</strong> {{ invoice.MONTH }} tháng</p>
                <p><strong>Giảm giá:</strong> {{ invoice.DISCOUNT }}%</p>
                <p>
                  <strong>Ngày bắt đầu:</strong>
                  {{ formatDate(invoice.created_at) }}
                </p>
                <p>
                  <strong>Ngày đến hạn:</strong>
                  {{ formatDate(invoice.endDate) }}
                </p>
              </div>

              <hr />
              <div class="card-footer">
                <div class="timePayment">
                  <p v-if="invoice.paymentExpired" class="expired-payment">
                    Đã hết hạn thanh toán
                  </p>
                  <p v-else>
                    <a :href="invoice.URL" target="_blank" class="payment-link"
                      >Đến trang thanh toán</a
                    >
                  </p>
                </div>
                <!-- <div class="countTime">
                  <span class="countdown-timer" v-if="!invoice.paymentExpired"
                    >Giao dịch kết thúc trong: {{ invoice.remainingTime }}</span
                  >
                </div> -->
                <div class="amount">
                  <p>
                    <!-- <b>Thành tiền:</b>                    -->
                    <span class="discounted-price">
                      {{ formatCurrency(invoice.AMOUNT) }}
                      <span class="vnđ">Đ</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axiosClient from "../../../api/axiosClient";

export default {
  setup() {
    const invoices = ref([]);
    const timerIntervals = ref([]);

    const sortInvoicesByDate = () => {
      invoices.value.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
    };

    const formatCurrency = (value) => {
      const formattedValue = parseFloat(value)
        .toFixed(0)
        .replace(/\d(?=(\d{3})+$)/g, "$&.");
      return formattedValue;
    };

    const fetchInvoices = async () => {
      try {
        const response = await axiosClient.post("/invoice/getInvoicebyOrgan");
        invoices.value = response.data.map((invoice) => ({
          ...invoice,
          paymentExpired: isPaymentExpired(invoice.created_at, 15),
          remainingTime: isPaymentExpired(invoice.created_at, 15)
            ? "00:00"
            : getRemainingTime(invoice.created_at),
          endDate: calculateEndDate(invoice.created_at, invoice.MONTH),
        }));
        sortInvoicesByDate();
        startCountdownTimers();
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const isPaymentExpired = (dateIssued, minutesLimit) => {
      const issuedDate = new Date(dateIssued);
      const currentTime = new Date();
      const timeDifference = (currentTime - issuedDate) / (1000 * 60);
      return timeDifference > minutesLimit;
    };

    const getRemainingTime = (dateIssued) => {
      const issuedDate = new Date(dateIssued);
      const expiryDate = new Date(issuedDate.getTime() + 15 * 60 * 1000);
      const currentTime = new Date();
      const timeDifference = expiryDate - currentTime;

      if (timeDifference <= 0) {
        return "00:00";
      }

      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    };

    const startCountdownTimers = () => {
      clearIntervals();
      invoices.value.forEach((invoice, index) => {
        const interval = setInterval(() => {
          const expired = isPaymentExpired(invoice.created_at, 15);
          if (expired) {
            invoices.value[index].paymentExpired = true;
            clearInterval(interval);
          } else {
            invoices.value[index].remainingTime = getRemainingTime(
              invoice.created_at
            );
          }
        }, 1000);
        timerIntervals.value.push(interval);
      });
    };

    const clearIntervals = () => {
      timerIntervals.value.forEach((interval) => clearInterval(interval));
      timerIntervals.value = [];
    };

    const calculateEndDate = (startDate, months) => {
      const start = new Date(startDate);
      start.setMonth(start.getMonth() + months);
      return start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    onMounted(() => {
      fetchInvoices();
    });

    onBeforeUnmount(() => {
      clearIntervals();
    });

    return {
      invoices,
      formatCurrency,
      formatDate,
      isPaymentExpired,
      getRemainingTime,
      calculateEndDate,
    };
  },
};
</script>

<style scoped>
.containPage {
  background-color: #f0f0f0; /* Màu nền của trang */
  padding: 20px;
}

.invoice-list {
  background-color: #70c2b4b8; /* Màu nền của card lớn */
  padding: 20px;
  border-radius: 8px;
}

.invoice-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.invoice-card {
  background-color: #ffffff; /* Màu nền của card giao dịch */
  padding: 15px;
  margin: 10px;
  border-radius: 8px;
  flex-basis: calc(33.333% - 20px); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.orderEmpty {
  text-align: center;
  margin-top: 20px;
}

.orderEmpty img {
  max-width: 200px;
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.packageName {
  flex: 1;
  font-size: 20px;
  font-size: 25px;
  color: #ff5722;
  font-weight: bold;
  margin-left: 20px;
}

/* .packageName {
  flex: 1;
  font-weight: bold;
  font-size: 25px;
  color: #ff5722;
  flex: 1;
  text-align: center;
} */

.status {
  flex: 1;
  text-align: right;
  color: rgb(200, 40, 40);
}

.card-body {
  text-align: center;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timePayment {
  flex: 1;
}

.countTime {
  flex: 1;
  text-align: center; /* Canh giữa nội dung trong phần countTime */
}

.amount {
  flex: 1;
  text-align: right; /* Căn phải nội dung trong phần amount */
}

.discounted-price {
  /* margin-left: 10px; */
  font-weight: bold;
  color: #ff5722;
  font-size: 1.5rem;
}

.vnđ {
  font-size: 0.8em; /* Kích thước nhỏ hơn cho chữ VNĐ */
  vertical-align: super; /* Hiển thị chữ VNĐ lên trên */
}

.payment-link {
  display: inline-block;
  padding: 5px 10px;
  background-color: #4caf50; /* Màu nền cho "Đến trang thanh toán" */
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.payment-link:hover {
  background-color: #45a049; /* Màu nền khi hover */
}

.expired-payment {
  display: inline-block;
  padding: 5px 10px;
  background-color: #ff5722; /* Màu nền cho "Đã hết hạn thanh toán" */
  color: white;
  border-radius: 4px;
}
.countdown-timer {
  display: inline-block;
  padding: 5px 10px;
  background-color: #ffeb3b;
  color: #000;
  border-radius: 4px;
  /* margin-left: 10px; */
  font-weight: bold;
}
</style>
