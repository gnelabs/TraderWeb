import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Amplify, { Auth } from 'aws-amplify';

// Parse the html provided by lambda for RoboTraderEnvInfo server side info.
const ServerSideDetails = JSON.parse(document.getElementById('RoboTraderEnvInfo').dataset.envinfo);

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

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Setup auth
Amplify.configure({
  Auth: {
    identityPoolId: ServerSideDetails.cognitoIdentityPoolId,
    region: ServerSideDetails.awsRegion,
    userPoolId: ServerSideDetails.cognitoUserPoolId,
    userPoolWebClientId: ServerSideDetails.cognitoUserPoolWebClientId
  }
});

// Routes that require a JWT to work. Server side there is no auth, so client side will redirect.
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem("authenticated") ? <Component {...props} /> : <Redirect to='/login' />
  )} />
)

// Pages
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));

class App extends Component {
  state = {
    isAuthenticated: false,
    user: null
  };
  
  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
    localStorage.setItem("authenticated", true);
  };
  
  setUser = user => {
    this.setState({ user: user });
  };
  
  async componentDidMount() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.setAuthStatus(true);
      this.setUser(user);
    } catch (error) {
      if (error !== "No current user") {
        console.log(error);
      }
    }
  }
  
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <PrivateRoute exact path="/" name="Home" component={DefaultLayout} />
            <Route path="/login" name="Login Page" render={props => <Login {...props} />} />
            <Route path="/register" name="Register" render={props => <Register {...props} />} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
