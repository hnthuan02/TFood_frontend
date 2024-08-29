<template>
  <div class="payment-page">
    <h2>Xác nhận thanh toán</h2>
    
    <div class="qr-code">
      <img :src="qrCodeUrl" alt="QR Code">
    </div>

    <p>Vui lòng quét mã QR bằng ứng dụng MoMo để hoàn thành thanh toán.</p>
    
    <p>Hoặc bạn có thể nhấn vào liên kết dưới đây để thanh toán:</p>
    <a :href="paymentLink" target="_blank">{{ paymentLink }}</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrCodeUrl: '',
      paymentLink: '',
    };
  },
  mounted() {
    this.qrCodeUrl = this.$route.query.qrCodeUrl || '';
    this.paymentLink = this.$route.query.paymentLink || '';
  },
};
</script>

<style scoped>
.payment-page {
  /* max-width: 600px; */
  margin: 0 auto;
  padding: 20px;
  /* background-color: #f9f9f9; */
  /* border: 1px solid #ddd; */
  /* border-radius: 8px; */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
  text-align: center; /* Canh giữa nội dung trong khung */
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.qr-code {
  margin: 0 auto; /* Canh giữa hình ảnh mã QR */
  margin-bottom: 20px;
}

.qr-code img {
  max-width: 100%; /* Đảm bảo hình ảnh mã QR không vượt quá kích thước của khung chứa */
  height: auto;
}

.instructions {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
