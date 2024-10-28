<template>
    <div class="chat-container">
        <!-- Danh sách người dùng -->
        <div class="users-list">
            <h3>Danh sách người dùng</h3>
            <div v-for="user in users" :key="user._id" class="user-item" @click="selectReceiver(user)">
                {{ user.FULLNAME }}
            </div>
        </div>

        <!-- Tin nhắn -->
        <div class="chat-messages">
            <div v-for="(message, index) in messages" :key="index" class="message">
                <span class="sender">{{ message.sender }}:</span>
                <span class="content">{{ message.content }}</span>
            </div>
        </div>

        <!-- Input tin nhắn -->
        <div class="chat-input">
            <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..." />
            <button @click="sendMessage">Gửi</button>
        </div>
    </div>
</template>

<script>
import { io } from "socket.io-client";
import { mapState } from "vuex";
import axiosClient from "../../api/axiosClient";

export default {
    data() {
        return {
            socket: null,
            messages: [],
            newMessage: "",
            userId: null,
            receiverId: "", // ID của người nhận
            users: [], // Danh sách người dùng
        };
    },
    computed: {
        ...mapState(["userInfo"]), // Lấy thông tin người dùng từ Vuex
    },
    mounted() {
        if (this.userInfo && this.userInfo._id) {
            this.userId = this.userInfo._id;
        } else {
            console.error("Không tìm thấy userId.");
            return;
        }

        // Kết nối với Socket.IO
        this.socket = io("http://localhost:3001", {
            auth: {
                token: localStorage.getItem("accessToken"), // Truyền token qua xác thực
            },
        });

        // Tham gia phòng chat với userId
        this.socket.emit("join", this.userId);

        // Lắng nghe sự kiện nhận tin nhắn từ server
        this.socket.on("receiveMessage", (message) => {
            const senderName = message.senderName || "Unknown"; // Lấy tên người gửi
            this.messages.push({
                sender: senderName,
                content: message.content,
            });
        });

        // Gọi API lấy danh sách người dùng
        this.fetchUsers();
    },

    methods: {
        async fetchUsers() {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("Token không tồn tại.");
                    return;
                }

                const response = await axiosClient.get("/users/getAllUsers", {
                    params: {
                        tabStatus: 2,
                        page: 1,
                        limit: 10, // Hoặc số giới hạn mà bạn muốn
                    },
                });

                // Kiểm tra xem response.data.data có phải là một mảng hay không
                if (Array.isArray(response.data.data)) {
                    this.users = response.data.data.filter(user => user._id !== this.userId);
                } else {
                    console.error("Dữ liệu từ API không phải là mảng:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        },

        async fetchMessages() {
            if (!this.userId || !this.receiverId) {
                console.error("Thiếu userId hoặc receiverId.");
                return;
            }

            try {
                const response = await axiosClient.get(
                    `/messages/${this.userId}/${this.receiverId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                // Sử dụng tên người gửi từ backend
                this.messages = response.data.map(message => ({
                    sender: message.senderName, // Tên người gửi
                    content: message.content,
                }));
            } catch (error) {
                console.error("Lỗi khi lấy tin nhắn:", error);
            }
        },

        selectReceiver(user) {
            this.receiverId = user._id;
            this.fetchMessages(); // Lấy tin nhắn khi chọn người nhận
        },

        sendMessage() {
            if (this.newMessage.trim() === "" || !this.receiverId) return;

            const message = {
                senderId: this.userId,
                receiverId: this.receiverId,
                content: this.newMessage,
                senderName: this.userInfo.ROLE.ADMIN || this.userInfo.ROLE.STAFF ? "TFOOD" : this.userInfo.FULLNAME,
            };

            // Gửi tin nhắn lên server
            this.socket.emit("sendMessage", message);

            // Thêm tin nhắn vào giao diện cho người gửi
            this.messages.push({
                sender: "Bạn",
                content: this.newMessage,
            });

            // Xóa nội dung tin nhắn sau khi gửi
            this.newMessage = "";
        },
    },
    beforeDestroy() {
        if (this.socket) this.socket.disconnect();
    },
};
</script>

<style scoped>
/* Kiểu dáng của giao diện chat */
.chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 1px solid #ccc;
    padding: 10px;
    overflow: hidden;
}

.users-list {
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}

.user-item {
    cursor: pointer;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #7274FF;
    border-radius: 4px;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
}

.message {
    margin-bottom: 5px;
}

.sender {
    font-weight: bold;
    margin-right: 5px;
}

.chat-input {
    display: flex;
    align-items: center;
}

.chat-input input {
    flex-grow: 1;
    padding: 5px;
    margin-right: 5px;
}

.chat-input button {
    padding: 5px 10px;
}
</style>
