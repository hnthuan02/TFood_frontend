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
                <div class="chat-area">
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
                                    <span v-if="!message.isDateHeader" class="timestamp">{{
                                        formatTime(message.createdAt)
                                        }}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Input tin nhắn -->
                    <div class="chat-input" v-if="receiverId">
                        <input type="text" v-model="newMessage" @keyup.enter="sendMessage"
                            placeholder="Nhập tin nhắn..." />
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
    top: 8px;
    right: 8px;
    width: 10px;
    height: 10px;
    background-color: #ff5c5c;
    border-radius: 50%;
}

.chat-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    background-color: #1e3a5f;
    color: white;
    border-radius: 15px;
    overflow: hidden;
}

/* Danh sách người dùng bên trái */
.users-list {
    width: 30%;
    background-color: #233b6e;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
}

.users-list h3 {
    color: #ffffff;
    font-size: 1.2em;
    margin-bottom: 10px;
}

.user-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    background-color: #2d4a76;
    transition: background-color 0.3s;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2em;
    background-color: #5a82ba;
}

.user-item.selected {
    background-color: #496ba1;
}

.user-item:hover {
    background-color: #3b5a8c;
}

.chat-area {
    height: 545px;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #1f3558;
}

.chat-messages {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    background-color: #1e3a5f;
    height: 545px;
}

.message {
    display: flex;
    margin-bottom: 10px;
    align-items: flex-end;
}

.message.sent {
    justify-content: flex-end;
}

.message.received {
    justify-content: flex-start;
}

.message .content {
    max-width: 60%;
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 0.9em;
}

.message.sent .content {
    background-color: #5a82ba;
    color: white;
    border-top-right-radius: 0;
}

.message.sent .timestamp {
    color: rgb(206, 206, 206);
}

.message.received .content {
    background-color: #f1f1f1;
    color: #161637;
    border-top-left-radius: 0;
}

.sender {
    font-weight: bold;
    margin-right: 5px;
}

.timestamp {
    font-size: 0.8em;
    color: #4f617a;
    margin-top: 5px;
    margin-left: 3px;
}

.chat-input {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #233b6e;
    border-top: 1px solid #2d4a76;
}

.chat-input input {
    flex-grow: 1;
    padding: 10px;
    font-size: 1em;
    border: none;
    border-radius: 20px;
    margin-right: 10px;
    background-color: #2d4a76;
    color: white;
}

.chat-input input::placeholder {
    color: #8fa6c6;
}

.chat-input button {
    padding: 10px 20px;
    background-color: #5a82ba;
    color: white;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.chat-input button:hover {
    background-color: #496ba1;
}

.date-header {
    text-align: center;
    font-weight: bold;
    color: #8fa6c6;
    margin: 10px 0;
}

.chat-area {
    width: 100%;
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
    height: 80%;
}

.select-user-message .timestamp {
    color: #f9f9f9;
}

.chat-header {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #2d4a76;
    color: white;
    font-size: 1.2em;
    border-bottom: 1px solid #233b6e;
}

.chat-header-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
    font-size: 1.5em;
    background-color: #5a82ba;
}

.chat-header-name {
    font-size: 1.2em;
    font-weight: bold;
}
</style>
