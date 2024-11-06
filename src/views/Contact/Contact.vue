<template>
    <div class="contact-container">
        <!-- Thông tin liên hệ -->
        <div class="contact-info">
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <h4>Địa chỉ:</h4>
                    <p>123/ab, Phường An Khánh, Quận Ninh Kiều, TP Cần Thơ</p>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-phone"></i>
                <div>
                    <h4>Số hotline:</h4>
                    <p>+8423 4567 89</p>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-paper-plane"></i>
                <div>
                    <h4>Email:</h4>
                    <p>thuanhuynhthuan2002@gmail.com</p>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-globe"></i>
                <div>
                    <h4>Website:</h4>
                    <a class="website" href="http://localhost:8080/TFood">TFood.com</a>
                </div>
            </div>
        </div>

        <!-- Phần Chat -->
        <div class="contact-chat">
            <Chat />
        </div>

        <!-- Hình ảnh bên phải -->
        <div class="contact-image">
            <img src="@/assets/contact.webp" alt="Background Image" />
        </div>
    </div>
</template>

<script>
import Chat from "../../components/Chat/Chat.vue"; // Đảm bảo đường dẫn đúng đến file Chat.vue

export default {
    components: {
        Chat,
    },
};
</script>

<style scoped>
.contact-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
    max-width: 1000px;
    margin: auto;
}

.contact-info {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
}

.info-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 25%;
}

.info-item i {
    font-size: 24px;
    color: #00aaff;
}

.contact-chat {
    flex: 1;
    max-width: 500px;
}

.contact-image {
    flex: 1;
    max-width: 500px;
    display: flex;
    justify-content: center;
    margin-left: 10px;
}

.contact-image img {
    max-width: 100%;
    border-radius: 10px;
}

.website {
    text-decoration: none;
    color: black;
}
</style>