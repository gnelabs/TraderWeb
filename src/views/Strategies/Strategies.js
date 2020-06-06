import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row, Table } from 'reactstrap';
import './Strategies.scss'
import { Auth } from 'aws-amplify';

const testResult = [{"enabled": false, "paperTrading": true, "requiresAlpaca": false, "meta": "", "description": "Grid trading strategy using SPY options. Constantly buys and sells, while trend-following in certain directions by buying into the grid and then selling once a trailing stop-loss is met. Works best during volatile markets. Requires free options trading and high-frequency API.\n\nGrid version 1.\nOption size: 1\nGrid size: 4", "strategyName": "Grid1", "requiresRealtime": true, "marketHours": "Normal", "requiresTDA": false, "requiresDayTrading": true, "requiresRobinhood": true}]

class Strategies extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    
    this.state = {
      jwttoken: "",
      submitDisabled: true,
      loadingSpinner: false,
      strategySettings: testResult,
      accordion: new Array(1).fill(false)
    };
    
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }
  
  async componentWillMount() {
    this.setState({
      jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken(),
      loadingSpinner: true
    });
    
    fetch('/api/strategy_settings', {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      this.setState({
        strategySettings: responseJSON,
        loadingSpinner: false,
        accordion: new Array(testResult.length).fill(false)
      });
    });
  }
  
  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }
  
  render() {
    return (
      <React.Fragment>
        <div>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Installed Trading Strategies
                </CardHeader>
                <CardBody>
                  <div id="accordion">
                  { this.state.strategySettings.map((value, index) => (
                    <Card className="mb-0">
                      <CardHeader id={value.strategyName}>
                        <Row>
                          <Col xs="6">
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls={value.strategyName}>
                              <h5 className="m-0 p-0">{value.strategyName}</h5>
                            </Button>
                          </Col>
                          <Col xs="6">
                            <div className="card-header-actions">
                            { value.paperTrading ?
                              <span class="float-right mr-1 badge badge-secondary">Paper</span>
                            :
                              <span class="float-right mr-1 badge badge-success">Live Money</span>
                            }
                            { value.enabled ?
                              <span class="float-right mr-1 badge badge-success">ON</span>
                            :
                              <span class="float-right mr-1 badge badge-danger">OFF</span>
                            }
                            </div>
                          </Col>
                        </Row>
                      </CardHeader>
                      <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id={value.strategyName} aria-labelledby={value.strategyName}>
                        <CardBody>
                          <Row>
                            <h5>Description</h5>
                            <div className="display-linebreak"> 
                              {value.description}
                            </div>
                          </Row>
                          <Row>
                            {JSON.stringify(value,null,'\t')}
                          </Row>
                        </CardBody>
                      </Collapse>
                    </Card>
                  ))}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Strategies);
