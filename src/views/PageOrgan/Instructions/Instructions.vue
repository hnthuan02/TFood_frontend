<template>
  <div class="guide-container">
    <h4 class="guide-title">Hướng dẫn sử dụng hệ thống</h4>
    <hr />
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="API">
        <div class="url">
          <p>Url-base: http://localhost:3000</p>
        </div>
        <div class="guide-content">
          <a-collapse accordion>
            <a-collapse-panel
              v-for="api in apis"
              :key="api.id"
              class="api-panel"
              @click="selectApi(api.id)"
            >
              <template v-slot:header>
                <div class="api-header">
                  <span class="api-method" :class="api.method">{{
                    api.method
                  }}</span>
                  <span
                    ><b>{{ api.endpoint }}</b></span
                  >
                  <p class="description">{{ api.description }}</p>
                </div>
              </template>
              <div class="api-info">
                <p><b>Endpoint: </b>{{ api.endpoint }}</p>
                <p><b>Method: </b>{{ api.method }}</p>
                <p><b>Headers: </b> 
                  <ul>
                          <li v-for="(value, key) in api.headers" :key="key">
                            <strong>{{ key }}:</strong> {{ value }}
                          </li>
                        </ul>
                </p>

              </div>
              <div v-if="selectedApiId === api.id" class="table-container">
                <table class="custom-table" id="apiTable">
                  <thead class="api-info-table">
                    <tr>                     
                      <th>Body</th>
                      <th>Data Type</th>
                      <th>Mandatory</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(value, key, index) in api.body" :key="key">
                      <td><strong>{{ key }}:</strong> {{ value }}</td>
                      <td>{{ api.data_type[index] }}</td>
                      <td>{{ api.mandatory[index] }}</td>
                      <td>{{ api.detailed_description[index] }}</td>
                    </tr>
                  </tbody>
                </table>
                <b>cURL Example: </b> 
                <pre>
                  {{ api.cURL_Example }}
                </pre>
                <p>
                  <b>Lưu ý:</b>
                  <p>Các id sẽ thay đổi theo từng trường tương ứng.</p>
                  <p>Ví dụ: <b>{{ api.examId }}</b> là id của <b>{{ api.nameId }}</b> và nó là duy nhất.</p>
                </p>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Đăng ký user của tổ chức">
        <div class="guide-content">
          <div class="api-info">
            <p><b>Endpoint: </b>{{ singleApi.endpoint }}</p>
            <p><b>Method: </b>{{ singleApi.method }}</p>
            <p><b>Headers: </b> 
              <ul>
                <li v-for="(value, key) in singleApi.headers" :key="key">
                  <strong>{{ key }}:</strong> {{ value }}
                </li>
              </ul>
            </p>
          </div>
          <div class="table-container">
            <table class="custom-table" id="apiTable">
              <thead class="api-info-table">
                <tr>                     
                  <th>Body</th>
                  <th>Data Type</th>
                  <th>Mandatory</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key, index) in singleApi.body" :key="key">
                  <td><strong>{{ key }}:</strong> {{ value }}</td>
                  <td>{{ singleApi.data_type[index] }}</td>
                  <td>{{ singleApi.mandatory[index] }}</td>
                  <td>{{ singleApi.detailed_description[index] }}</td>
                </tr>
              </tbody>
            </table>
            <b>cURL Example: </b> 
            <pre>
              {{ singleApi.cURL_Example }}
            </pre>
            <p>
              <b>Lưu ý:</b>
              <p>Các id sẽ thay đổi theo từng trường tương ứng.</p>
              <p>Ví dụ: <b>{{ singleApi.examId }}</b> là id của <b>{{ singleApi.nameId }}</b> và nó là duy nhất.</p>
            </p>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apis: [
        {
          id: 1,
          method: "POST",
          endpoint: "/comment/create",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
            "Key ": " _ID",
            "Value": "6656d73b9b7a6f4ca740c48c",
          },
          body: {
            PRODUCT_ID: "60c3a4de7a393d0015d3bbf4",
            CONTENT: "new comments neee",
            ATTACHMENTS: [],
          },
          data_type: ["ObjectId", "String", "String"],
          mandatory: ["Yes", "Yes", "No"],
          description: "Thêm bình luận mới vào sản phẩm",
          detailed_description: ["Là id của product mà người dùng thêm comment vào với 60c3a4de7a393d0015d3bbf4 để xác định đó là product nào.",
                                  "Nội dung của comment.",
                                  "Là mảng chứa tệp đính kèm với kiểu dữ liệu là url."],
          cURL_Example: `
              curl -X POST http://localhost:3000/comment/create 
              -H "Content-Type: application/json" 
              -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
              -d '{ "PRODUCT_ID": "60c3a4de7a393d0015d3bbf4", "CONTENT": "new comments neee", "ATTACHMENTS": [] }'
            `,
          examId: "60c3a4de7a393d0015d3bbf4",
          nameId: "PRODUCT_ID"
        },
        {
          id: 2,
          method: "GET",
          endpoint: "/comment/user/:userId",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
          body: {nodata: "No data to send"},
          data_type: ["No data to send"],
          mandatory: ["No data to send"],
          description: "Lấy bình luận của người dùng với userId",
          detailed_description: ["Ở phương thức này cho phép bạn lấy ra tất cả comments của người dùng tương ứng với userId và các thông tin liên quan đến comment. userId là một tham số động."],
          cURL_Example: `
              curl -X POST http://localhost:3000/comment/user/6662d265c64d0d76f320aafa 
              -H "Content-Type: application/json" 
              -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
            `,
          examId: "6662d265c64d0d76f320aafa",
          nameId: "userId"
        },
        {
          id: 3,
          method: "PUT",
          endpoint: "/comment/update/:commentId",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
            "Key ": " _ID",
            "Value": "6656d73b9b7a6f4ca740c48c",
          },
          body: {
            CONTENT: "new comment",
          },
          data_type: ["String"],
          mandatory: ["Yes"],
          description: "Chỉnh sửa bình luận",
          detailed_description: ["Chỉnh sửa lại comment đã được thêm trước đó với commentId để xác định chính xác comment người dùng muốn chỉnh sửa."],
          cURL_Example: `
              curl -X POST http://localhost:3000/comment/update/664c5509a97756acb289efdb
              -H "Content-Type: application/json" 
              -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
              -d '{ "CONTENT": "new comment"}'
            `,
          examId: "664c5509a97756acb289efdb",
          nameId: "commentId"
        },
        {
          id: 4,
          method: "GET",
          endpoint: "/comment/product/:productId",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
          body: {nodata: "No data to send"},
          data_type: ["No data to send"],
          mandatory: ["No data to send"],
          description: "Lấy bình luận thuộc sản phẩm với productId",
          detailed_description: ["Ở phương thức này cho phép bạn lấy ra tất cả comments trong một product cụ thể."],
          cURL_Example: `
              curl -X POST http://localhost:3000/comment/product/6662d265c64d0d76f320aafa 
              -H "Content-Type: application/json" 
              -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
            `,
          examId: "6662d265c64d0d76f320aafa",
          nameId: "productId"
        },
        {
          id: 5,
          method: "POST",
          endpoint: "/comment/:commentId/reply",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
          body: {
            commentId: "666449c8c61be9b97c21a5aa",
            content: "new comments neee",
            productId:"60d5f484f1d5c43a784f1c59",
            attachments: [{"url": "http://example.com/image.png", "description": "Example Image"}],
          },
          data_type: ["ObjectId", "String", "ObjectId", "String"],
          mandatory: ["Yes", "Yes", "Yes", "No"],
          description: "Trả lời bình luận",
          detailed_description: ["Là id của comment mà người dùng muốn phản hồi.",
                                  "Nội dung của comment.",
                                  "Là id của product mà người dùng thêm comment vào với 60c3a4de7a393d0015d3bbf4 để xác định đó là product nào.",
                                  "Là mảng chứa tệp đính kèm là url và description cả 2 đều có kiểu dữ liệu là String."],
          cURL_Example: `
              curl -X POST http://localhost:3000/comment/666449c8c61be9b97c21a5aa/reply 
              -H "Content-Type: application/json" 
              -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
              -d '{ "commentId":"666449c8c61be9b97c21a5aa",
                    "content": "Đây là nội dung của bình luận.",
                    "productId": "60d5f484f1d5c43a784f1c59",
                    "attachments": [{"url": "http://example.com/image.png", "description": "Example Image"}] 
                  }'
            `,
          examId: "666449c8c61be9b97c21a5aa",
          nameId: "commentId"
        },
        {
          id: 6,
          method: "DELETE",
          endpoint: "/comment/delete/:commentId",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
          body: {nodata: "No data to send"},
          data_type: ["No data to send"],
          mandatory: ["No data to send"],
          description: "Xóa bình luận",
          detailed_description: ["Ở phương thức này cho phép người dùng xóa đi comment tương ứng với commentId.\nComment được xóa vẫn được lưu trong CSDL và chỉ ẩn đi với người dùng."],
          cURL_Example: `
              curl -X POST http://localhost:3000/comment/delete/6662d265c64d0d76f320aafa 
              -H "Content-Type: application/json" 
              -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
            `,
          examId: "6662d265c64d0d76f320aafa",
          nameId: "commentId"
        },
        // {
        //   id: 7,
        //   method: "GET",
        //   endpoint: "/comment/commentUserinfo",
        //   description:
        //     "Retrieve a list of comments along with related user information",
        // },
      ],
      selectedApiId: null,
      singleApi: {
        id: 1,
        endpoint: '/organization/registerAccountOfOrganization',
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_ACCESS_TOKEN",
          "Key ": " ORGANIZATION_ID",
          "Value": "6662b09893d5e1aa5d2d61e6",
        },
        body: {
          "USERNAME": "Nguyen2026",
          "PASSWORD": "Nguyen@2026",
          "FULLNAME": "Nguyen Mai",
          "EMAIL": "Nguyen2026@gmail.com",
          "ADDRESS": "Kanther",
          "GENDER": "Male"
        },
        data_type: ['String', 'String', 'String', 'String', 'String', 'String'],
        mandatory: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
        detailed_description: [ 'Tên đăng nhập của người dùng', 
                                'Mật khẩu của người dùng', 
                                'Họ và tên của người dùng',
                                'Email của người dùng (khi gửi yêu cầu đăng ký thành công mã otp xác thực sẽ được gửi đến Email này).',
                                'Địa chỉ của người dùng',
                                'Giới tính của người dùng' ],
        cURL_Example: `
            curl -X POST http://localhost:3000/comment/create 
            -H "Content-Type: application/json" 
            -H "Authorization: Bearer YOUR_ACCESS_TOKEN" 
            -d '{ "USERNAME": "Nguyen2026",
                  "PASSWORD": "Nguyen@2026",
                  "FULLNAME": "Nguyen Mai",
                  "EMAIL": "Nguyen2026@gmail.com",
                  "ADDRESS": "Kanther",
                  "GENDER": "Male" }'
          `,
        examId: '6662b09893d5e1aa5d2d61e6',
        nameId: 'Id tổ chức',
      }
    };
  },
  methods: {
    selectApi(apiId) {
      this.selectedApiId = apiId;
      console.log("apiId: ", this.selectedApiId);
    },
    scrollToApi(apiId) {
      // Tìm phần tử API có ID tương ứng
      const apiElement = document.getElementById(`api-${apiId}`);
      if (apiElement) {
        // Scroll đến phần tử API sử dụng smooth scrolling
        apiElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  },
  computed: {
    filteredApis() {
      return this.apis.filter((api) => {
        return (
          api.endpoint ||
          api.method ||
          (api.headers && Object.keys(api.headers).length > 0) ||
          (api.body && Object.keys(api.body).length > 0) ||
          api.description
        );
      });
    },
  },
};
</script>

<style scoped>
.guide-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.guide-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.guide-content {
  max-width: 1200px;
  overflow: auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.guide-content.POST {
  background-color: #7dbbb4;
  border: 1px solid #00796b;
}

.section-title {
  color: #1890ff;
  font-size: 20px;
  margin-bottom: 10px;
}

.section-description {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

hr {
  display: block;
  border: none;
  height: 3px;
  background-color: #198754;
  margin: 0px;
}

.api-steps {
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
}

.api-steps li {
  margin-bottom: 5px;
}

.api-steps strong {
  font-weight: bold;
}

.api-steps ul {
  list-style-type: none;
  padding-left: 20px;
  margin-top: 5px;
}

.api-panel {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 5px;
  padding: 0px;
}

.api-header {
  display: flex;
  align-items: center;
  justify-content: start;
}

.api-method {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
}

.api-method.POST {
  background-color: #52c41a;
  padding: 2px 15px;
}

.api-method.PUT {
  background-color: #faad14;
  padding: 1px 15px;
}

.api-method.GET {
  background-color: #1890ff;
  padding: 2px 15px;
}

.api-method.DELETE {
  background-color: #f5222d;
}

.api-method.PATCH {
  background-color: #722ed1;
}

.url {
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  padding: 5px;
}

.url p {
  color: #00796b; /* Màu chữ xanh đậm */
  font-weight: bold; /* Chữ đậm */
  font-size: 16px; /* Kích thước chữ */
  text-align: center; /* Canh giữa chữ */
}

.description {
  margin-left: 20px;
  color: #999; /* Màu xám nhạt */
  font-style: italic;
}

.table-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  /* overflow: auto; */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.custom-table th,
.custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  white-space: pre-wrap;
  border-bottom: 1px solid #dee2e6;
}

.custom-table td {
    border-bottom: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

.custom-table th {
  background-color: #f2f2f2;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.custom-table ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.custom-table li {
  margin-bottom: 5px;
}

.custom-table strong {
  font-weight: bold;
}

p {
  margin-top: 0;
  margin-bottom: 0rem;
}

pre {
  /* white-space: pre-wrap; */
  font-size: revert;
  margin: 0px 0px 0px;
}

.api-info-table {
  text-align: center;
}
</style>
