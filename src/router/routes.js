const routes = [
  {
    path: "/",
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
    path: "/administracion/empresas",
    component: () => import("layouts/admin/AdmingLayout.vue"),
    children: [
      { path: "", component: () => import("pages/empresas/EmpresasPage.vue") },
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
