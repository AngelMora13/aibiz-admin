const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("layouts/landing/LandingLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/landing/IndexPage.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/login/LoginLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("pages/login/LoginPage.vue"),
      },
      {
        path: "/logging",
        name: "do-login",
        component: () => import("pages/login/LoginLoader.vue"),
      },
    ],
  },
  {
    path: "/logout",
    component: () => import("layouts/login/LoginLayout.vue"),
    children: [
      { path: "", component: () => import("pages/login/LogoutPage.vue") },
    ],
  },
  {
    path: "/administracion",
    meta: {
      auth: true,
    },
    component: () => import("layouts/admin/AdmingLayout.vue"),
    children: [
      { path: "", component: () => import("pages/admin/AdminHome.vue") },
      {
        path: "empresas",
        component: () => import("pages/admin/EmpresasPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
