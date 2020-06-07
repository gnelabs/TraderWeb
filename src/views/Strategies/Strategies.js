import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row, Table, Spinner } from 'reactstrap';
import './Strategies.scss'
import { Auth } from 'aws-amplify';

class Strategies extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    
    this.state = {
      jwttoken: "",
      submitDisabled: true,
      loadingSpinner: true,
      strategySettings: [],
      accordion: new Array(1).fill(false)
    };
    
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }
  
  async componentWillMount() {
    this.setState({
      jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken(),
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
        accordion: new Array(responseJSON.length).fill(false)
      });
    }).catch(err => alert("Something went wrong contacting the server."));
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
                { this.state.loadingSpinner ?
                  <Spinner animation="border" role="status" variant="secondary" />
                :
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
                            <Table responsive striped size="sm">
                              <thead>
                              <tr>
                                <th>Setting</th>
                                <th>Value</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr>
                                <td>Strategy Enabled</td>
                                <td>{value.enabled.toString()}</td>
                              </tr>
                              <tr>
                                <td>Paper Trading</td>
                                <td>{value.paperTrading.toString()}</td>
                              </tr>
                              <tr>
                                <td>Requires Alpaca API</td>
                                <td>{value.requiresAlpaca.toString()}</td>
                              </tr>
                              <tr>
                                <td>Requires TD Ameritrade API</td>
                                <td>{value.requiresTDA.toString()}</td>
                              </tr>
                              <tr>
                                <td>Requires Robinhood API</td>
                                <td>{value.requiresRobinhood.toString()}</td>
                              </tr>
                              <tr>
                                <td>Market Hours</td>
                                <td>{value.marketHours}</td>
                              </tr>
                              <tr>
                                <td>Day Trading Required</td>
                                <td>{value.requiresDayTrading.toString()}</td>
                              </tr>
                              <tr>
                                <td>Requires Realtime Data</td>
                                <td>{value.requiresRealtime.toString()}</td>
                              </tr>
                              <tr>
                                <td>Metadata</td>
                                <td>{value.meta.toString()}</td>
                              </tr>
                              </tbody>
                            </Table>
                          </Row>
                        </CardBody>
                      </Collapse>
                    </Card>
                  ))}
                  </div>
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

export default withRouter(Strategies);
