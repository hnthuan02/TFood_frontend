import { createRouter, createWebHistory } from "vue-router";

import Cart from "../components/Cart/Cart.vue";
import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue";
import LoginLayout from "../layouts/Login/LoginLayout.vue";
import MenuLayout from "../layouts/Menu/MenuLayout.vue";
import TableLayout from "../layouts/Table/TableLayout.vue";
import store from "../store";
import BillAdmin from "../views/Admin/BillAdmin/BillAdmin.vue";
import HomeAdmin from "../views/Admin/HomeAdmin/HomeAdmin.vue";
import MenuAdmin from "../views/Admin/MenuAdmin/MenuAdmin.vue";
import TableAdmin from "../views/Admin/TableAdmin/TableAdmin.vue";
import BookTable from "../views/BookTable/BookTable.vue";
import HomePageUser from "../views/HomePage/HomeUser/HomePageUser.vue";
import Menu from "../views/Menu/Menu.vue";
import Payment from "../views/Payment/Payment.vue";
import Booked from "../views/User/InfoUser/Booked.vue";
import InforUser from "../views/User/InfoUser/InforUser.vue";
import Login from "../views/User/LoginUser/Login.vue";
import RegisterUser from "../views/User/RegisterUser/Register.vue";

const routes = [
  {
    path: "/",
    redirect: "/TFood", // Thêm route mặc định này
  },
  {
    path: "/user/signup",
    component: RegisterUser,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/user/login",
    component: Login,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/TFood",
    component: HomePageUser,
    meta: {
      layout: LoginLayout,
    },
  },

  {
    path: "/menu/best-seller",
    component: Menu,
    meta: {
      layout: MenuLayout,
    },
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
    meta: {
      layout: TableLayout,
    },
  },
  { path: "/cart", component: Cart },
  {
    path: "/payment",
    component: Payment,
    meta: {
      layout: TableLayout,
    },
  },
  {
    path: "/user/info",
    component: InforUser,
    meta: {
      layout: LoginLayout,
    },
  },
  {
    path: "/user/booked",
    component: Booked,
    meta: {
      layout: LoginLayout,
    },
  },

  {
    path: "/dashboard",
    component: HomeAdmin,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/dashboard/menu",
    component: MenuAdmin,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/dashboard/bill",
    component: BillAdmin,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/dashboard/booking",
    component: TableAdmin,
    meta: {
      layout: AdminLayout,
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;
  const userInfo = store.getters.userInfo;

  let userRole = "";
  if (userInfo?.ROLE?.ADMIN) {
    userRole = "admin";
  } else if (userInfo?.ROLE?.BRANCH_MANAGER) {
    userRole = "branch_manager";
  } else if (userInfo?.ROLE?.STAFF) {
    userRole = "staff";
  } else {
    userRole = "guest";
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLoggedIn) {
      if (userRole === "guest") {
        next("/TFood");
      } else if (
        to.matched.some(
          (record) => record.meta.roles && record.meta.roles.includes(userRole)
        )
      ) {
        next();
      } else {
        next("/TFood");
      }
    } else {
      next("/user/login");
    }
  } else {
    next();
  }
});

export default router;
