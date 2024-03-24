import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'snippets/', component: () => import('pages/snippetsPage.vue') },
      {
        path: 'snippets/:id',
        component: () => import('pages/snippetPage.vue'),
      },
      {
        path: 'questions/',
        component: () => import('pages/questionsPage.vue'),
      },
      {
        path: 'questions/:id',
        component: () => import('pages/questionPage.vue'),
      },
      {
        path: 'questions/new',
        component: () => import('pages/questionPage.vue'),
      },
      {
        path: 'dashboards',
        component: () => import('pages/dashboardsPage.vue'),
      },
      {
        path: 'dashboards/:id',
        component: () => import('pages/dashboardPage.vue'),
      },
      {
        path: '/dashboards/:id/html',
        component: () => import('pages/dashboardHTMLPage.vue'),
      },
      { path: '/settings', component: () => import('pages/settingsPage.vue') },
      { path: '/login', component: () => import('pages/loginPage.vue') },
      {
        path: '/api/google/callback',
        component: () => import('pages/loginPage.vue'),
      },
      {
        path: '/api/saml/acs',
        component: () => import('pages/loginPage.vue'),
      },
      {
        path: '/data_references/databases',
        component: () => import('pages/databasesPage.vue'),
      },
      {
        path: '/data_references/databases/:database_id/tables',
        component: () => import('pages/databaseTablesPage.vue'),
      },
      {
        path: '/data_references/databases/:database_id/tables/:table_id',
        component: () => import('pages/databaseTableColumnsPage.vue'),
      },
      {
        path: '/data_references/databases/:database_id/tables/:table_id/explore',
        component: () => import('pages/questionPage.vue'),
      },
      {
        path: '/user/configuration',
        component: () => import('pages/userConfiguration.vue'),
      },
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
