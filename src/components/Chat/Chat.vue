<template>
    <div class="chat-container">
        <!-- Danh sách người dùng (chỉ dành cho nhân viên và admin) -->
        <div v-if="isAdminOrStaff" class="users-list">
            <h3>Danh sách người dùng</h3>
            <div v-for="user in users" :key="user._id" class="user-item" :class="{ selected: user.isSelected }"
                @click="selectReceiver(user)">
                <span v-if="user.hasNewMessage" class="notification-dot"></span>
                {{ user.FULLNAME }}
            </div>
        </div>

        <!-- Tin nhắn -->
        <div class="chat-messages">
            <div v-for="(message, index) in messages" :key="index" class="message">
                <span class="sender">{{ message.sender }}:</span>
                <span class="content">{{ message.content }}</span>
                <span class="timestamp">{{ formatTime(message.createdAt) }}</span>
            </div>
            <div class="chat-input">
                <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..." />
                <button @click="sendMessage">Gửi</button>
            </div>
        </div>

        <!-- Input tin nhắn -->

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
            defaultAdminId: "", // ID admin mặc định cho người dùng thường
        };
    },
    computed: {
        ...mapState(["userInfo"]), // Lấy thông tin người dùng từ Vuex

        // Kiểm tra xem tài khoản là admin hoặc nhân viên
        isAdminOrStaff() {
            return this.userInfo?.ROLE?.ADMIN || this.userInfo?.ROLE?.STAFF;
        },
    },
    async mounted() {
        if (this.userInfo && this.userInfo._id) {
            this.userId = this.userInfo._id;
        } else {
            console.error("Không tìm thấy userId.");
            return;
        }

        // Đặt ID admin mặc định nếu người dùng là user thường
        if (!this.isAdminOrStaff) {
            await this.setDefaultAdminId();
            this.receiverId = this.defaultAdminId;
        }

        // Kết nối với Socket.IO
        this.socket = io("http://localhost:3001", {
            auth: {
                token: localStorage.getItem("accessToken"),
            },
        });

        // Tham gia phòng chat với userId
        this.socket.emit("join", this.userId);

        // Lắng nghe sự kiện nhận tin nhắn từ server
        this.socket.on("receiveMessage", (message) => {
            // Xử lý tin nhắn nhận được
            if (this.isAdminOrStaff) {
                // Nếu là admin, cập nhật thông báo chấm đỏ cho người dùng
                if (message.senderId !== this.receiverId) {
                    this.updateUserNotification(message.senderId);
                } else {
                    this.messages.push({
                        sender: message.senderName || "Unknown",
                        content: message.content,
                        createdAt: message.createdAt, // Thêm thời gian
                    });
                }
            } else {
                // Nếu là user thường, hiển thị tin nhắn từ admin
                this.messages.push({
                    sender: message.senderName || "TFOOD",
                    content: message.content,
                    createdAt: message.createdAt, // Thêm thời gian
                });
            }
        });

        // Tải tin nhắn cũ ngay khi trang được tải
        this.fetchMessages();

        // Nếu là admin hoặc staff, tải danh sách người dùng
        if (this.isAdminOrStaff) {
            this.fetchUsers();
        }
    },

    methods: {
        async fetchUsers() {
            try {
                const response = await axiosClient.get("/users/getAllUsers", {
                    params: { tabStatus: 2, page: 1, limit: 10 },
                });

                // Lọc bỏ người dùng hiện tại khỏi danh sách
                this.users = response.data.data
                    .filter(user => user._id !== this.userId && !user.ROLE.STAFF)
                    .map(user => ({ ...user, hasNewMessage: false, isSelected: false }));
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        },

        async setDefaultAdminId() {
            try {
                // Sử dụng API lấy danh sách người dùng và tìm admin
                const response = await axiosClient.get("/users/getAllUsers", {
                    params: { tabStatus: 2, page: 1, limit: 10 },
                });

                // Tìm admin trong danh sách người dùng
                const admins = response.data.data.filter(user => user.ROLE.ADMIN);

                if (admins.length > 0) {
                    this.defaultAdminId = admins[0]._id;
                } else {
                    console.error("Không tìm thấy admin nào.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy ID admin:", error);
            }
        },

        async fetchMessages() {
            if (!this.userId || !this.receiverId) {
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

                if (response.data && Array.isArray(response.data)) {
                    this.messages = response.data.map(message => ({
                        sender: message.senderName,
                        content: message.content,
                        createdAt: message.createdAt, // Thêm thời gian
                    }));
                } else {
                    console.error("Dữ liệu trả về không phải là mảng tin nhắn.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy tin nhắn:", error);
            }
        },

        selectReceiver(user) {
            if (!this.isAdminOrStaff) return;
            this.users.forEach(u => u.isSelected = false); // Đặt lại tất cả thành chưa chọn
            user.isSelected = true; // Đánh dấu người dùng được chọn

            // Xóa chấm đỏ khi chọn người nhận
            user.hasNewMessage = false;

            this.receiverId = user._id;
            this.fetchMessages();
        },

        sendMessage() {
            if (this.newMessage.trim() === "") return;

            // Nếu là người dùng thường, gửi tin nhắn tới admin
            if (!this.isAdminOrStaff) {
                this.receiverId = this.defaultAdminId;
            }

            if (!this.receiverId) {
                console.error("Không thể gửi tin nhắn vì thiếu receiverId.");
                return;
            }

            const message = {
                senderId: this.userId,
                receiverId: this.receiverId,
                content: this.newMessage,
                senderName: this.isAdminOrStaff ? "TFOOD" : this.userInfo.FULLNAME,
            };

            // Gửi tin nhắn lên server
            this.socket.emit("sendMessage", message);

            // Thêm tin nhắn vào giao diện người gửi
            // this.messages.push({
            //     sender: "Bạn",
            //     content: this.newMessage,
            //     createdAt: new Date().toISOString(), // Thêm thời gian hiện tại
            // });

            // Xóa nội dung tin nhắn sau khi gửi
            this.newMessage = "";
            this.fetchMessages();
        },

        formatTime(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Định dạng thời gian
        },

        updateUserNotification(senderId) {
            const user = this.users.find(user => user._id === senderId);
            if (user) {
                user.hasNewMessage = true; // Cập nhật chấm đỏ
            }
        },
    },
    beforeDestroy() {
        if (this.socket) this.socket.disconnect();
    },
};
</script>

<style scoped>
.notification-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
}

.chat-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    border: 1px solid #ccc;
    padding: 10px;
    overflow: hidden;
}

.users-list {
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    background-color: #f9f9f9;
    /* Màu nền cho danh sách người dùng */
}

.user-item {
    position: relative;
    cursor: pointer;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #7274FF;
    border-radius: 4px;
    background-color: #e3f2fd;
    /* Màu nền cho người dùng */
}

.user-item.selected {
    background-color: #d1c4e9;
    /* Màu nền khi chọn người dùng */
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    margin-left: 10px;
    position: relative;
}

.message {
    margin-bottom: 5px;
}

.sender {
    font-weight: bold;
    margin-right: 5px;
}

.timestamp {
    font-size: 0.8em;
    color: gray;
    /* Màu cho thời gian */
    margin-left: 10px;
    /* Khoảng cách giữa tin nhắn và thời gian */
}

.chat-input {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    position: absolute;
    bottom: 0;
    width: 100%;
}

.chat-input input {
    flex-grow: 1;
    padding: 5px;
    margin-right: 5px;
}

.chat-input button {
    padding: 5px 10px;
    background-color: #7274FF;
    /* Màu nền nút gửi */
    color: white;
    /* Màu chữ */
    border: none;
    border-radius: 4px;
    /* Bo tròn góc */
    cursor: pointer;
}

.chat-input button:hover {
    background-color: #5a5fc4;
    /* Màu nền khi hover */
}
</style>
