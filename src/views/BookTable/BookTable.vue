<template>
    <div>
        <h1>Đặt Bàn</h1>
        <label for="date">Chọn ngày:</label>
        <input type="date" v-model="selectedDate" @change="fetchAvailableTables" />

        <table v-if="tables.length">
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="table in tables" :key="table._id">
                    <td><img :src="table.IMAGES[0]" alt="Table" width="100" /></td>
                    <td>{{ table.TYPE }}</td>
                    <td>{{ table.PRICE }}</td>
                    <td>{{ table.COUNT }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else>Không có bàn nào có sẵn trong ngày đã chọn.</p>
    </div>
</template>

<script>
import axiosClient from "../../api/axiosClient";

export default {
    data() {
        return {
            selectedDate: '',
            tables: []
        };
    },
    methods: {
        async fetchAvailableTables() {
            if (!this.selectedDate) return;
            try {
                const response = await axiosClient.get(`/tables/allTable?date=${this.selectedDate}`);
                this.tables = response.data.data;
            } catch (error) {
                console.error('Error fetching available tables:', error);
            }
        }
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>