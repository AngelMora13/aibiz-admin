const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("layouts/landing/LandingLayout.vue"),
    children: [
      { path: "", component: () => import("pages/landing/IndexPage.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/login/LoginLayout.vue"),
    children: [
      { path: "", component: () => import("pages/login/LoginPage.vue") },
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
