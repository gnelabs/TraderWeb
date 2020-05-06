import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, } from 'reactstrap';
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import Cookies from 'js-cookie';

// Parse the html provided by lambda for RoboTraderEnvInfo server side info.
const ServerSideDetails = JSON.parse(document.getElementById('RoboTraderEnvInfo').dataset.envinfo);


class Login extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    this.state = {
      poolData: {
        UserPoolId: ServerSideDetails.cognitoUserPoolId,
        ClientId: ServerSideDetails.cognitoClientId
      },
      submitDisabled: true,
      verifyDisabled: true,
      userName: this.props.location.state !== undefined ? this.props.location.state.rhUser : '',
      rh_user_registered: true,
      bySMS: true
    };
    this.userPool = new CognitoUserPool(this.state.poolData);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyPressVerify = this.handleKeyPressVerify.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
  }
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    } 
  }
  
  handleKeyPressVerify(target) {
    if(target.key === 'Enter'){
      this.handleVerify();  
    } 
  }
  
  handleSubmit() {
    var authenticationDetails = new AuthenticationDetails({
      Username: this.state.userName,
      Password: this.state.passWord
    });
    
    var cognitoUser = new CognitoUser({
      Username: this.state.userName,
      Pool: this.userPool
    });
    
    // Store JWT in a one-day cookie. Doing this myself to control the cookie name
    // rather than using amazon-cognito-identity-js CookieStorage which gives arbitary names.
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        var accessToken = result.getAccessToken().getJwtToken();
        Cookies.set('epithycognitojwt', accessToken, {
          expires: 1,
          path: '/',
          domain: document.location.hostname,
          secure: false
        });
        this.setState({
          verifyDisabled: false
        });
      },
      
      onFailure: err => {
        alert(err.message);
      }
    });
  }
  
  // Once Cognito is logged in, send login to RH to get 2FA code to generate token.
  handleVerify() {
    try {
      fetch('/api/login', {
        method: 'POST',
        ContentType: 'application/json',
        headers: {
          'Authorization': Cookies.get('epithycognitojwt', { domain: document.location.hostname })
        },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.passWord,
          code: this.state.rhCode,
          sms: this.state.bySMS
        })
      }).then((response) => response.json()).then(responseJSON => {
        if (responseJSON.rh_login_success === true) {
          this.props.history.push('/');
        } else {
          alert(responseJSON.message);
        }
      });
    }
    catch(error) {
      alert("Something went wrong contacting the server.");
    }
  }
  
  handleChange(event) {
    if (event.target.id !== "bySMS") {
      this.setState({
        [event.target.id]: event.target.value
      });
    } else {
      this.setState({
        [event.target.id]: event.target.checked
      });
    }
    if (this.state.userName && this.state.passWord) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  
  // Display registration card if there are no registered users.
  // Calls a backend unauthenticated route to check to see if there is an
  // existing user in Cognito.
  componentWillMount() {
    fetch('/api/checkusercreated', {
      method: 'GET',
      ContentType: 'application/json'
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.rh_user_registered === true) {
        this.setState({
          rh_user_registered: true,
        });
      }
    });
  }
  
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Form>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <h1>Login</h1>
                      <p className="text-muted">This is your Robinhood username and password.</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" placeholder="Username" id='userName' value={this.state.userName} onChange={this.handleChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" id='passWord' onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Get Code</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  { this.state.rh_user_registered ?
                  <Card className="text-white bg-primary p-4">
                    <CardBody>
                      <h1>Code</h1>
                      <p className="text-muted">Enter your temporary login code from Robinhood to generate a 24 hour token.</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" pattern="[0-9]*" placeholder="Robinhood code" id='rhCode' onChange={this.handleChange} onKeyPress={this.handleKeyPressVerify} disabled={this.state.verifyDisabled} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        Verify by SMS.
                        <Input type="checkbox" id="bySMS" onChange={this.handleChange} checked={this.state.bySMS} disabled={this.state.verifyDisabled}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="secondary" className="mt-3" onClick={this.handleVerify} disabled={this.state.verifyDisabled}>Login</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  :
                  <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '50%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>You need to register your Robinhood account first before logging in.</p>
                        <Link to="/register">
                          <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                  }
                </CardGroup>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
