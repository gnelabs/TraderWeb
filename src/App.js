import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

const loading = () => {
  return (
    <div className="sk-circle">
        <div className="sk-circle1 sk-child"></div>
        <div className="sk-circle2 sk-child"></div>
        <div className="sk-circle3 sk-child"></div>
        <div className="sk-circle4 sk-child"></div>
        <div className="sk-circle5 sk-child"></div>
        <div className="sk-circle6 sk-child"></div>
        <div className="sk-circle7 sk-child"></div>
        <div className="sk-circle8 sk-child"></div>
        <div className="sk-circle9 sk-child"></div>
        <div className="sk-circle10 sk-child"></div>
        <div className="sk-circle11 sk-child"></div>
        <div className="sk-circle12 sk-child"></div>
    </div>
  );
}

// Parse the html provided by lambda for RoboTraderEnvInfo server side info.
const ServerSideDetails = JSON.parse(document.getElementById('RoboTraderEnvInfo').dataset.envinfo);

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/" name="Home" render={props => <DefaultLayout {...props} epithypageinfo={ServerSideDetails}/>} />
            <Route path="/login" name="Login Page" render={(props) => <Login {...props} epithypageinfo={ServerSideDetails}/>} />
            <Route path="/register" name="Register" render={props => <Register {...props} epithypageinfo={ServerSideDetails}/>} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
