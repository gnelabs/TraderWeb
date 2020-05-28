import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import './Settings.scss'
import { Auth } from 'aws-amplify';

class Settings extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    
    this.state = {
      jwttoken: "",
      submitDisabled: true,
      loadingSpinner: false,
      liquidateDisabled: true,
      globalSettings: {}
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  async componentWillMount() {
    this.setState({
      jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken(),
      loadingSpinner: true
    });
    
    fetch('/api/global_settings', {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      this.setState({
        globalSettings: responseJSON
      });
      this.setState({
        GlobalTradingEnabled: this.state.globalSettings.GlobalTradingEnabled,
        ShareResults: this.state.globalSettings.ShareResults,
        loadingSpinner: false
      });
    });
    
    if (this.state.globalSettings.GlobalTradingEnabled === false) {
      this.setState({
        liquidateDisabled: false
      });
    }
  }
  
  handleSubmit() {
    this.setState({
      submitDisabled: true,
      loadingSpinner: true
    });
    fetch('/api/global_settings', {
      method: 'POST',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      },
      body: JSON.stringify({
        GlobalTradingEnabled: this.state.GlobalTradingEnabled,
        ShareResults: this.state.ShareResults,
        ResultsUsername: this.state.ResultsUsername,
        MobileNumber: this.state.MobileNumber
      })
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.update_successful === true) {
        window.location.reload();
      } else {
        alert(responseJSON.message);
      }
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  handleChange(event) {
    this.setState({
      submitDisabled: false
    });
    if (event.target.id === "GlobalTradingEnabled" || event.target.id === "ShareResults") {
      this.setState({
        [event.target.id]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
    console.log('state: ', this.state);
  }
  
  render() {
    return (
      <React.Fragment>
        <div>
          <Row>
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Global Settings</strong>
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <FormGroup row>
                      <Col md="6">
                        <Label>Trading Status</Label>
                      </Col>
                      <Col xs="12" md="6">
                      { this.state.globalSettings.GlobalTradingEnabled ?
                        <Badge className="mr-1" color="success">ENABLED</Badge>
                      :
                        <Badge className="mr-1" color="danger">DISABLED</Badge>
                      }
                        
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6"><Label>Enable Trading</Label></Col>
                      <Col md="6">
                        <FormGroup check className="checkbox">
                          <Input className="form-check-input" type="checkbox" id="GlobalTradingEnabled" name="GlobalTradingEnabled" onChange={this.handleChange} checked={this.state.GlobalTradingEnabled} />
                        </FormGroup>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6"><Label>Share Results Publically</Label></Col>
                      <Col md="6">
                        <FormGroup check className="checkbox">
                          <Input className="form-check-input" type="checkbox" id="ShareResults" name="ShareResults" onChange={this.handleChange} checked={this.state.ShareResults} />
                          <FormText color="muted">
                            on epithy.com
                          </FormText>
                        </FormGroup>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6">
                        <Label htmlFor="text-input">Shared Results Username</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="ResultsUsername" name="ResultsUsername" onChange={this.handleChange} placeholder={this.state.globalSettings.ResultsUsername} />
                        <FormText color="muted">Your Reddit username? Must be unique.</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6">
                        <Label htmlFor="text-input">Mobile Number</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="MobileNumber" name="MobileNumber" onChange={this.handleChange} placeholder={this.state.globalSettings.MobileNumber} />
                        <FormText color="muted">For optional alerting. Ex. 1 555 555 5555</FormText>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary" disabled={this.state.submitDisabled} onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                  { this.state.loadingSpinner ?
                  <Spinner animation="border" role="status" variant="secondary" />
                  : null
                  }
                </CardFooter>
              </Card>
            </Col>
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Emergency Control</strong>
                </CardHeader>
                <CardBody>
                  <Col md="12"><Label>Sell all Epithy Robo Trader securities immediately via market order.</Label></Col>
                  <Col md="12"><Label>Trading must be disabled first.</Label></Col>
                  <FormGroup row>
                  </FormGroup>
                  <Col xs="12" md="9">
                    <Button type="submit" color="danger" className="mr-1" disabled={this.state.liquidateDisabled}> Liquidate </Button>
                  </Col>
                  { this.state.loadingSpinner ?
                  <Spinner animation="border" role="status" variant="secondary" />
                  : null
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(Settings);
