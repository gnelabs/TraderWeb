import React from 'react';

const Home = React.lazy(() => import('./views/Home'));
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Home},
  { path: '/login', exact: true, name: 'Login', component: Login},
  { path: '/register', exact: true, name: 'Register', component: Register}
];

export default routes;
