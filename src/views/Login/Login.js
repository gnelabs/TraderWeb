import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, } from 'reactstrap';
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import Cookies from 'js-cookie';


class Login extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    // this.state = {
      // poolData: {
        // UserPoolId: this.props.epithypageinfo.cognitoUserPoolId,
        // ClientId: this.props.epithypageinfo.cognitoClientId
      // }
    // };
    this.state = {
      poolData: {
        UserPoolId: "us-east-1_K9GfQ6wIr",
        ClientId: "5cojum77pk261h362gcvqmom1o"
      },
      submitDisabled: true,
      userName: this.props.location.state !== undefined ? this.props.location.state.rhUser : '',
      rh_user_registered: false,
    };
    console.log('pooldata: ', this.state.poolData);
    this.userPool = new CognitoUserPool(this.state.poolData);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit() {
    console.log(this.state);
    var authenticationDetails = new AuthenticationDetails({
      Username: this.state.userName,
      Password: this.state.passWord
    });
    
    var cognitoUser = new CognitoUser({
      Username: this.state.userName,
      Pool: this.userPool
    });
    
    // Store JWT in a one-day cookie. Doing this myself to control the cookie name.
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        var accessToken = result.getAccessToken().getJwtToken();
        Cookies.set('epithycognitojwt', accessToken, {
          expires: 1,
          path: '/',
          domain: document.location.hostname,
          secure: false
        });
        this.props.history.push('/');
      },
      
      onFailure: err => {
        alert(err.message);
      }
    });
  }
  
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
    if (this.state.userName && this.state.passWord) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  
  // Display registration card if there are no registered users.
  componentDidMount() {
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
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
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
                        <Input type="password" placeholder="Password" id='passWord' onChange={this.handleChange} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Login</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                { this.state.rh_user_registered ? null :
                  this.state.userName ? null :
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
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
        </Container>
      </div>
    );
  }
}

export default Login;
