import React from 'react';

const Home = React.lazy(() => import('./views/Home'));
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));
const Settings = React.lazy(() => import('./views/Settings'));
const Strategies = React.lazy(() => import('./views/Strategies'));
const SystemStatus = React.lazy(() => import('./views/SystemStatus'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Home},
  { path: '/login', exact: true, name: 'Login', component: Login},
  { path: '/register', exact: true, name: 'Register', component: Register},
  { path: '/settings', exact: true, name: 'Settings', component: Settings},
  { path: '/strategies', exact: true, name: 'Strategies', component: Strategies},
  { path: '/systemstatus', exact: true, name: 'SystemStatus', component: SystemStatus}
];

export default routes;
