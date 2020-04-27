import React, { Component } from 'react';
import './Home.scss'

class Home extends Component {
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

export default Home;
