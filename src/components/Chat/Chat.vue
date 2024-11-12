<template>
    <div class="chat-container">
        <!-- Danh sách người dùng (chỉ dành cho nhân viên và admin) -->
        <div v-if="isAdminOrStaff" class="users-list">
            <h3>Danh sách người dùng</h3>
            <div v-for="user in users" :key="user._id" class="user-item" :class="{ selected: user.isSelected }"
                @click="selectReceiver(user)">
                <div class="avatar" :style="{ backgroundColor: getRandomColor(user._id) }">
                    {{ getInitial(user.FULLNAME) }}
                </div>
                <span v-if="user.hasNewMessage" class="notification-dot"></span>
                {{ user.FULLNAME }}
            </div>
        </div>

        <!-- Tin nhắn hoặc thông báo chọn người dùng -->
        <div class="chat-area">
            <!-- Nếu chưa chọn người dùng và là admin hoặc staff thì hiển thị thông báo -->
            <div v-if="!receiverId && isAdminOrStaff" class="select-user-message">
                Chọn người dùng để chat
            </div>

            <!-- Khi đã chọn người dùng, hiển thị tên và avatar ở góc trên cùng -->
            <div v-else-if="receiverId && selectedUser" class="chat-header">
                <div class="chat-header-avatar" :style="{ backgroundColor: getRandomColor(selectedUser._id) }">
                    {{ getInitial(selectedUser.FULLNAME) }}
                </div>
                <div class="chat-header-name">{{ selectedUser.FULLNAME }}</div>
            </div>

            <!-- Tin nhắn -->
            <div class="chat-messages" v-if="receiverId">
                <div v-for="(message, index) in groupedMessages" :key="index">
                    <!-- Hiển thị ngày tháng năm nếu là đầu ngày mới -->
                    <div v-if="message.isDateHeader" class="date-header">
                        {{ message.date }}
                    </div>

                    <!-- Hiển thị tin nhắn -->
                    <div v-else :class="['message', message.senderId === userId ? 'sent' : 'received']">
                        <span class="content">
                            <span class="sender">{{ message.sender }}:</span>
                            <span class="text">{{ message.content }}</span>
                            <span v-if="!message.isDateHeader" class="timestamp">{{ formatTime(message.createdAt)
                                }}</span>
                        </span>
                    </div>
                </div>

                <!-- Input tin nhắn -->
                <div class="chat-input">
                    <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..." />
                    <button @click="sendMessage">Gửi</button>
                </div>
            </div>
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
            defaultAdminId: "", // ID admin mặc định cho người dùng thường
            colorCache: {},
            selectedUser: null
        };
    },
    computed: {
        ...mapState(["userInfo"]), // Lấy thông tin người dùng từ Vuex

        isAdminOrStaff() {
            return this.userInfo?.ROLE?.ADMIN || this.userInfo?.ROLE?.STAFF;
        },
        groupedMessages() {
            const grouped = [];
            let lastDate = null;

            this.messages.forEach((message) => {
                const messageDate = new Date(message.createdAt);
                const formattedDate = this.formatDateToVietnamese(messageDate);

                if (formattedDate !== lastDate) {
                    grouped.push({ isDateHeader: true, date: formattedDate });
                    lastDate = formattedDate;
                }

                grouped.push({ ...message, isDateHeader: false, senderId: message.senderId });
            });

            return grouped;
        },
    },
    async mounted() {
        if (this.userInfo && this.userInfo._id) {
            this.userId = this.userInfo._id;
        } else {
            console.error("Không tìm thấy userId.");
            return;
        }

        if (!this.isAdminOrStaff) {
            await this.setDefaultAdminId();
            this.receiverId = this.defaultAdminId;
        }

        this.socket = io("http://localhost:3001", {
            auth: {
                token: localStorage.getItem("accessToken"),
            },
        });

        this.socket.emit("join", this.userId);

        this.socket.on("receiveMessage", (message) => {
            if (this.isAdminOrStaff) {
                if (message.senderId !== this.receiverId) {
                    this.updateUserNotification(message.senderId);
                } else {
                    this.messages.push({
                        sender: message.senderName || "Unknown",
                        content: message.content,
                        createdAt: message.createdAt,
                        senderId: message.senderId,
                    });
                }
            } else {
                this.messages.push({
                    sender: message.senderName || "TFOOD",
                    content: message.content,
                    createdAt: message.createdAt,
                    senderId: message.senderId,
                });
            }
        });

        this.fetchMessages();

        if (this.isAdminOrStaff) {
            this.fetchUsers();
        }
    },

    methods: {

        getInitial(fullname) {
            const words = fullname.split(" ");
            return words[words.length - 1]?.charAt(0).toUpperCase() || "";
        },

        // Hàm tạo màu ngẫu nhiên cho avatar, lưu trong cache
        getRandomColor(userId) {
            if (!this.colorCache[userId]) {
                const colors = ["#FFB6C1", "#87CEFA", "#FF6347", "#FFD700", "#40E0D0"];
                this.colorCache[userId] = colors[Math.floor(Math.random() * colors.length)];
            }
            return this.colorCache[userId];
        },
        formatDateToVietnamese(date) {
            if (isNaN(date.getTime())) return "Ngày không hợp lệ";
            return new Intl.DateTimeFormat('vi-VN', {
                weekday: 'long',
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            }).format(date);
        },
        async fetchUsers() {
            try {
                const response = await axiosClient.get("/users/getAllUsers", {
                    params: { tabStatus: 2, page: 1, limit: 10 },
                });

                this.users = response.data.data
                    .filter(user => user._id !== this.userId && !user.ROLE.STAFF && !user.ROLE.ADMIN)
                    .map(user => ({ ...user, hasNewMessage: false, isSelected: false }));
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        },

        async setDefaultAdminId() {
            try {
                const response = await axiosClient.get("/users/getAllUsers", {
                    params: { tabStatus: 2, page: 1, limit: 10 },
                });

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
                        createdAt: message.createdAt,
                        senderId: message.senderId,
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
            this.users.forEach(u => u.isSelected = false);
            user.isSelected = true;
            user.hasNewMessage = false;

            this.receiverId = user._id;
            this.selectedUser = user;
            this.fetchMessages();
        },

        sendMessage() {
            if (this.newMessage.trim() === "") return;

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

            this.socket.emit("sendMessage", message);

            this.newMessage = "";
            this.fetchMessages();
        },

        formatTime(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },

        updateUserNotification(senderId) {
            const user = this.users.find(user => user._id === senderId);
            if (user) {
                user.hasNewMessage = true;
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
}

.users-list h3 {
    border-bottom: 1px solid #000000;
    ;
}

.user-item {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #062970;
    border-radius: 4px;
    background-color: #e3f2fd;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 8px;
    font-size: 16px;
}

.user-item.selected {
    background-color: #d1c4e9;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    margin-left: 10px;
    position: relative;
}

.message {
    display: flex;
    margin-bottom: 5px;
}

.message.sent {
    justify-content: flex-end;
}

.message.received {
    justify-content: flex-start;
}

.message .content {
    max-width: 70%;
    padding: 8px;
    border-radius: 8px;
}

.message.sent .content {
    background-color: #7274FF;
    color: white;
}

.message.received .content {
    background-color: #f1f1f1;
    color: #161637;
}

.sender {
    font-weight: bold;
    margin-right: 5px;
}

.timestamp {
    font-size: 0.8em;
    margin-left: 10px;
}

.chat-input {
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    margin-bottom: 10px;
}

.chat-input input {
    flex-grow: 1;
    padding: 5px;
    margin-right: 5px;
}

.chat-input button {
    padding: 5px 10px;
    background-color: #7274FF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.chat-input button:hover {
    background-color: #5a5fc4;
}

.date-header {
    text-align: center;
    font-weight: bold;
    color: #161637;
    margin: 10px 0;
}

.chat-area {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
}

.select-user-message {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    color: #7274FF;
    height: 100%;
}

.select-user-message .timestamp {
    color: #f9f9f9;
}

.chat-header {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f1f1f1;
    border-bottom: 1px solid #ccc;
}

.chat-header-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
}

.chat-header-name {
    font-size: 1em;
    font-weight: bold;
    color: #161637;
}
</style>
