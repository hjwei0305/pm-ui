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
        path: '/pm',
        name: '项目管理',
        routes: [
          {
            path: '/pm/PmBaseInfo',
            component: './PmBaseInfo',
            title: '项目基础信息',
          },
          {
            path: '/pm/PmBaseInfoEdit',
            component: './PmBaseInfoEdit',
            title: '项目基础信息编辑',
          },
          {
            path: '/pm/ProjectMembers',
            component: './ProjectMembers',
            title: '项目人员？',
          },
          {
            path: '/pm/ProjectPlan',
            component: './ProjectPlan',
            title: '项目计划表',
          },
          {
            path: '/pm/TodoList',
            component: './TodoList',
            title: 'TodoList',
          },
          {
            path: '/pm/WfConfig',
            component: './WfConfig',
            title: 'WfConfig',
          },
          {
            path: '/pm/Home',
            component: './Home',
            title: '首页',
          },
          {
            path: '/pm/Report',
            component: './Report',
            title: '数据报表',
          },
          {
            path: '/pm/TodolistApprove',
            component: './TodolistDetails/approve/ApproveDetail',
            title: '审批页面',
          },

          {
            path: '/pm/TodolistDetails',
            component: './TodolistDetails',
            title: '待办列表清单',
          },
          {
            path: '/pm/ApproveEdit',
            component: './TodolistDetails/approve/ApproveEdit',
            title: '待办查看页面',
          },
          {
            path: '/pm/eipTodo',
            component: './EipTodo',
            title: 'eip待办处理页面',
          },
          {
            path: '/pm/ProjectOption',
            component: './ProjectOption',
            title: '流程配置',
          },
          {
            path: '/pm/ProjectScheduleReport',
            component: './ProjectScheduleReport',
            title: '项目进度报表',
          },
          {
            path: '/pm/YearProjectReport',
            component: './YearProjectReport',
            title: '科室年度项目',
          },
          {
            path: '/pm/PersonalMonthReport',
            component: './PersonalMonthReport',
            title: '个人月度计划',
          },
          {
            path: '/pm/PmBaseInfoWeekReport',
            component: './PmBaseInfoWeekReport',
            title: '双周计划明细',
          },
          {
            path: '/pm/PmVisitStatistics',
            component: './PmVisitStatistics',
            title: '访问量统计',
          },
          {
            path: '/pm/PersonalBaseInfoReport',
            component: './PersonalBaseInfoReport',
            title: '无项目名单列表',
          }
        ],
      },
      {
        path: '/em',
        name: '人员管理',
        routes: [
          {
            path: '/em/Emp',
            component: './Emp',
            title: '人员管理',
          },
        ],
      },
    ],
  },
];
