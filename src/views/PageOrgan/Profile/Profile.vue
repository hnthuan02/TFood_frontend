<template>
  <div class="profile-container">
    <a-card class="profile-card">
      <template #title>
        <div class="profile-title">
          <label for="avatarInput">
            <a-avatar :src="avatarUrl" size="large" class="avatar" />
            <h4>{{ userInfo?.USERNAME }}</h4>
          </label>
          <input
            id="avatarInput"
            type="file"
            style="display: none"
            ref="fileInput"
            @change="handleFileUpload"
          />
        </div>
      </template>
      <a-row class="profile-info">
        <a-col :span="24">
          <div class="info-item">
            <p>
              <strong>Tên đăng nhập:</strong>
              <span class="content">{{ userInfo?.USERNAME }}</span>
            </p>
          </div>
          <div class="info-item">
            <p>
              <strong>Họ và tên:</strong>
              <template v-if="!editing"
                ><span class="content">{{ userInfo?.FULLNAME }}</span></template
              >
              <a-input
                v-else
                :value="editData.FULLNAME"
                @input="updateEditData('FULLNAME', $event.target.value)"
              />
            </p>
          </div>
          <div class="info-item">
            <p>
              <strong>Giới tính:</strong>
              <template v-if="!editing"
                ><span class="content">{{ userInfo?.GENDER }}</span></template
              >
              <a-select
                v-else
                :value="editData.GENDER"
                @change="updateEditData('GENDER', $event)"
              >
                <a-select-option value="Male">Male</a-select-option>
                <a-select-option value="Female">Female</a-select-option>
                <a-select-option value="Other">Other</a-select-option>
              </a-select>
            </p>
          </div>
          <div class="info-item">
            <p>
              <strong>Địa chỉ:</strong>
              <template v-if="!editing"
                ><span class="content">{{ userInfo?.ADDRESS }}</span></template
              >
              <a-input
                v-else
                :value="editData.ADDRESS"
                @input="updateEditData('ADDRESS', $event.target.value)"
              />
            </p>
          </div>
        </a-col>
      </a-row>
      <div class="action-buttons">
        <a-button
          v-if="!editing"
          type="primary"
          class="edit-button"
          @click="editProfile"
          >Chỉnh sửa</a-button
        >
        <a-button
          v-if="editing"
          type="primary"
          class="save-button"
          @click="saveProfile"
          >Lưu</a-button
        >
        <a-button v-if="editing" class="cancel-button" @click="cancelEdit"
          >Hủy</a-button
        >
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import axiosClient from "../../../api/axiosClient";

export default {
  data() {
    return {
      avatarUrl: null,
      editing: false,
      editData: {
        FULLNAME: "",
        // EMAIL: "",
        ADDRESS: "",
        GENDER: "",
      },
      originalData: {}, // Store original user data
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    editProfile() {
      // Copy userInfo to originalData when starting edit
      this.originalData = { ...this.userInfo };
      // Initialize editData with current user info
      this.editData = {
        FULLNAME: this.userInfo.FULLNAME,
        // EMAIL: this.userInfo.EMAIL,
        ADDRESS: this.userInfo.ADDRESS,
        GENDER: this.userInfo.GENDER,
      };
      this.editing = true;
    },
    async saveProfile() {
      try {
        const filteredEditData = this.filterEmptyFields(this.editData);
        console.log("Dữ liệu gửi đi:", filteredEditData);
        const updatedUser = await this.updateUserInfo(filteredEditData);
        console.log("Cập nhật thông tin thành công:", updatedUser);
        await this.getUserInfo();
        this.editing = false;
      } catch (error) {
        console.error(
          "Lỗi cập nhật thông tin:",
          error.response?.data?.message || error.message
        );
      }
    },
    filterEmptyFields(data) {
      return Object.keys(data)
        .filter((key) => data[key] !== null && data[key] !== "")
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
    },
    async updateUserInfo(updatedUser) {
      try {
        const response = await axiosClient.put("/user/updateUser", updatedUser);
        return response.data;
      } catch (error) {
        console.error(
          "Lỗi cập nhật thông tin:",
          error.response?.data?.message || error.message
        );
        throw error;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadAvatar(file);
    },
    async uploadAvatar(file) {
      const formData = new FormData();
      formData.append("AVATAR", file);

      try {
        const response = await axiosClient.post("/azure/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.avatarUrl = response.data.imageUrl;
        console.log("Upload thành công:", response.data);
      } catch (error) {
        console.error("Lỗi upload avatar:", error);
      }
    },
    updateEditData(field, value) {
      this.editData[field] = value;
    },
    cancelEdit() {
      // Restore original data
      this.editData = { ...this.originalData };
      this.editing = false;
    },
  },
  mounted() {
    if (!this.userInfo) {
      this.getUserInfo();
    }
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.profile-card {
  width: 80%;
  margin-top: 20px;
  background-color: #f0f2f5;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.profile-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  margin-bottom: 10px;
}

.profile-title h4 {
  margin-bottom: 0;
  font-size: 20px;
  color: #1890ff;
}

.profile-info {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 10px;
  font-size: 16px;
  text-align: left;
}

.info-item p {
  margin-bottom: 5px;
  color: #333;
}

.info-item strong {
  font-weight: bold;
}

.edit-button,
.save-button,
.cancel-button {
  margin-top: 20px;
  margin-right: 10px;
}

.action-buttons {
  text-align: right;
}

@media screen and (max-width: 768px) {
  .profile-card {
    width: 100%;
  }
}
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

select:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.content {
  margin-left: 8px;
}
</style>
