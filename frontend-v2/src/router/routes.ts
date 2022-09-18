import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/frontend',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'questions/:id', component: () => import('pages/questionsPage.vue') }, 
      { path: 'questions/new', component: () => import('pages/questionsPage.vue') }, 
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
