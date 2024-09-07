import { createRouter, createWebHistory } from "vue-router";

import store from "@/store";
import LoginLayout from "../layouts/Login/LoginLayout.vue";
import HomePageUser from "../views/HomePage/HomeUser/HomePageUser.vue";
import Menu from "../views/Menu/Menu.vue";
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
      layout: LoginLayout,
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
  if (userInfo?.ROLE?.IS_ADMIN) {
    userRole = "admin";
  } else if (userInfo?.ROLE?.IS_ORGANIZATION) {
    userRole = "organization";
  } else {
    userRole = "guest";
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (
      isLoggedIn &&
      to.matched.some(
        (record) => record.meta.roles && record.meta.roles.includes(userRole)
      )
    ) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
