export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/moduleName',
        name: 'moduleName',
        routes: [{ path: '/moduleName/demo', component: './Demo' }],
      },
      {
        path: '/test',
        name: 'pmTest',
        routes: [{ path: '/test/pmTest', component: './Test/PmTest' }],
      },
    ],
  },
];
