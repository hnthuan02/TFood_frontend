import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

// Import các component
import Cart from "../components/Cart/Cart.vue";
import Chat from "../components/Chat/Chat.vue";
import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue";
import LoginLayout from "../layouts/Login/LoginLayout.vue";
import MenuLayout from "../layouts/Menu/MenuLayout.vue";
import TableLayout from "../layouts/Table/TableLayout.vue";
import BillAdmin from "../views/Admin/BillAdmin/BillAdmin.vue";
import HomeAdmin from "../views/Admin/HomeAdmin/HomeAdmin.vue";
import MenuAdmin from "../views/Admin/MenuAdmin/MenuAdmin.vue";
import Rating from "../views/Admin/Rating/Rating.vue";
import ServiceAdmin from "../views/Admin/ServiceAdmin/ServiceAdmin.vue";
import TableAdmin from "../views/Admin/TableAdmin/TableAdmin.vue";
import UserAdmin from "../views/Admin/UserAdmin/UserAdmin.vue";
import VoucherAdmin from "../views/Admin/Voucher/VoucherAdmin.vue";
import ApprovedReviews from "../views/ApprovedReviews/ApprovedReviews.vue";
import BookTable from "../views/BookTable/BookTable.vue";
import Contact from "../views/Contact/Contact.vue";
import HomePageUser from "../views/HomePage/HomeUser/HomePageUser.vue";
import Menu from "../views/Menu/Menu.vue";
import Payment from "../views/Payment/Payment.vue";
import Booked from "../views/User/InfoUser/Booked.vue";
import InforUser from "../views/User/InfoUser/InforUser.vue";
import Login from "../views/User/LoginUser/Login.vue";
import RegisterUser from "../views/User/RegisterUser/Register.vue";
import Voucher from "../views/Voucher/Voucher.vue";

const routes = [
  {
    path: "/",
    redirect: "/TFood",
  },
  {
    path: "/user/signup",
    component: RegisterUser,
    meta: { layout: LoginLayout },
  },
  {
    path: "/user/login",
    component: Login,
    meta: { layout: LoginLayout },
  },
  {
    path: "/TFood",
    component: HomePageUser,
    meta: { layout: LoginLayout },
  },
  {
    path: "/menu/best-seller",
    component: Menu,
    meta: { layout: MenuLayout },
  },
  {
    path: "/menu/steak",
    name: "Steak",
    component: Menu,
    props: { type: "Steak" },
    meta: { layout: MenuLayout },
  },
  {
    path: "/menu/pasta",
    name: "Pasta",
    component: Menu,
    props: { type: "Pasta" },
    meta: { layout: MenuLayout },
  },
  {
    path: "/menu/dessert",
    name: "Dessert",
    component: Menu,
    props: { type: "Dessert" },
    meta: { layout: MenuLayout },
  },
  {
    path: "/menu/drink",
    name: "Drink",
    component: Menu,
    props: { type: "Drink" },
    meta: { layout: MenuLayout },
  },
  {
    path: "/table",
    component: BookTable,
    meta: { layout: TableLayout },
  },
  { path: "/cart", component: Cart },
  {
    path: "/payment",
    component: Payment,
    meta: { layout: TableLayout },
  },
  {
    path: "/user/info",
    component: InforUser,
    meta: { layout: LoginLayout },
  },
  {
    path: "/user/booked",
    component: Booked,
    meta: { layout: LoginLayout },
  },
  {
    path: "/dashboard",
    component: HomeAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true, // Yêu cầu ít nhất một role là true
    },
  },
  {
    path: "/dashboard/menu",
    component: MenuAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/bill",
    component: BillAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/booking",
    component: TableAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/users",
    component: UserAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/rating",
    component: Rating,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/chat",
    component: Chat,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/promotions",
    component: VoucherAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/dashboard/services",
    component: ServiceAdmin,
    meta: {
      layout: AdminLayout,
      requiresAuth: true,
      requiresRole: true,
    },
  },
  {
    path: "/contact",
    component: Contact,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/review",
    component: ApprovedReviews,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/voucher",
    component: Voucher,
    meta: {
      layout: LoginLayout,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware kiểm tra quyền truy cập
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  let userInfo = store.getters.userInfo;

  // Kiểm tra nếu userInfo là null, gọi checkToken để lấy thông tin người dùng
  if (!userInfo) {
    userInfo = await store.dispatch("checkToken");
  }

  const roles = userInfo?.ROLE || {};
  const hasRole = Object.values(roles).some((role) => role === true);
  // Kiểm tra đường dẫn đến "/user/info" để thay đổi layout dựa trên role
  if (to.path === "/user/info") {
    if (hasRole) {
      to.meta.layout = AdminLayout; // Có role, sử dụng AdminLayout
    } else {
      to.meta.layout = LoginLayout; // Không có role, sử dụng LoginLayout
    }
  }

  if (to.path === "/user/booked") {
    if (hasRole) {
      to.meta.layout = AdminLayout; // Có role, sử dụng AdminLayout
    } else {
      to.meta.layout = LoginLayout; // Không có role, sử dụng LoginLayout
    }
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      return next("/user/login");
    }

    if (to.matched.some((record) => record.meta.requiresRole)) {
      if (hasRole) {
        return next(); // Có quyền, cho phép truy cập
      } else {
        return next("/TFood"); // Không có quyền, chuyển hướng đến trang người dùng
      }
    } else {
      return next(); // Các đường dẫn khác không yêu cầu quyền, cho phép truy cập
    }
  }

  next(); // Không yêu cầu xác thực, cho phép truy cập
});

export default router;
