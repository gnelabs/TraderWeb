import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Settings.scss'
import { Auth } from 'aws-amplify';

class Settings extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    this.state = {
      jwttoken: ""
    };
  }
  
  async componentWillMount() {
    this.setState({
      jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken()
    });
    console.log('state: ', this.state);
  }
  
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 epithy-maincontent">
            <h1 className="display-4 mt-6 text-white">Hey there! Welcome to Epithy Robo Trader.</h1>
            <h2 className="mb-6 pb-6 pt-1 text-light">Currently in development.</h2>
          </div>
          <div className="col-12 epithy-maincontent">
            <div className="animated fadeIn">
              <div className="card bg-light mb-3">
                <h4 className="card-header">What's New</h4>
                <div className="card-body">
                This website is under development. Stay tuned, new stuff will be coming online shortly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(Settings);
