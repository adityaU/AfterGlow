import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'questions/:id', component: () => import('pages/questionsPage.vue') }, 
      { path: 'questions/new', component: () => import('pages/questionsPage.vue') }, 
      { path: '/data_references/databases/:database_id/tables/:table_id/explore', component: () => import('pages/questionsPage.vue') }, 
      { path: '/data_references/databases/:database_id/tables', component: () => import('pages/questionsPage.vue') }, 
      { path: 'dashboards/:id', component: () => import('pages/dashboardPage.vue') }, 
      { path: 'dashboards/:id/html', component: () => import('pages/dashboardHTMLPage.vue') }, 

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

