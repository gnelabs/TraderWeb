import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row, Table, Spinner, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import './Strategies.scss'
import { Auth } from 'aws-amplify';

// Warnings for the user before they confirm change.
const modalHeaderTradingDisable = "Confirm disable trading"
const modalHeaderTradingEnable = "Confirm enable trading"
const modalHeaderPaperDisable = "Confirm live money"
const modalHeaderPaperEnable = "Confirm paper trading"
const modalBodyTradingDisable = `By disabling trading, any further trades in the strategy
will be cancelled. Any open trades will be closed through reconcilliation.`;
const modalBodyTradingEnable = `By enabling trading, if the trading window is open, then
trading will begin immediately. New orders will be opened up.`;
const modalBodyPaperDisable = `By disabling paper trading, you are going to start trading
with real money immediately. Profits and losses will be reflected in your account. You 
must have the proper account configuration and capital.`;
const modalBodyPaperEnable = `By enabling paper trading, you will be trading with simulated
money. Profits and losses will not be reflected in your account, only here on EpithyRoboTrader. 
Account configuration and capital limitations will be ignored.`;

class Strategies extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    
    this.state = {
      jwttoken: "",
      submitDisabled: true,
      loadingSpinner: true,
      strategySettings: [],
      accordion: new Array(1).fill(false),
      smallModal: false,
      settingName: "",
      settingChange: false
    };
    
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleSmallModal = this.toggleSmallModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        submitDisabled: false,
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
  
  toggleSmallModal() {
    this.setState({
      smallModal: !this.state.smallModal,
    });
  }
  
  handleSubmit() {
    this.setState({
      submitDisabled: true,
      loadingSpinner: true
    });
    fetch('/api/strategy_settings', {
      method: 'POST',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      },
      body: JSON.stringify({
        [this.state.settingName]: this.state.settingChange
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
    if (event.target.id.includes("_enable")) {
      if (event.target.checked) {
        this.setState({
          modalHeaderType: modalHeaderTradingEnable,
          modalBodyType: modalBodyTradingEnable,
        });
      } else {
        this.setState({
          modalHeaderType: modalHeaderTradingDisable,
          modalBodyType: modalBodyTradingDisable,
        });
      }
    } else if (event.target.id.includes("_paper")) {
      if (event.target.checked) {
        this.setState({
          modalHeaderType: modalHeaderPaperEnable,
          modalBodyType: modalBodyPaperEnable,
        });
      } else {
        this.setState({
          modalHeaderType: modalHeaderPaperDisable,
          modalBodyType: modalBodyPaperDisable,
        });
      }
    }
    this.setState({
      settingChange: event.target.checked,
      settingName: event.target.id,
      smallModal: !this.state.smallModal,
    });
  }
  
  closeModal() {
    this.setState({
      smallModal: !this.state.smallModal,
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
                              </tbody>
                            </Table>
                          </Row>
                          { value.meta ?
                          <Row>
                            <h6>Metadata</h6>
                            <div> 
                              {value.meta}
                            </div>
                          </Row>
                          : null
                          }
                          <Row>
                            <Col md="6">
                              <h5>Enable this strategy?</h5>
                              <AppSwitch className={'mx-1'} variant={'pill'} color={'success'} label id={value.strategyName.concat('_', 'enable')} onChange={this.handleChange} checked={value.enabled} />
                            </Col>
                            <Col md="6">
                              <h5>Simulated (paper) trading?</h5>
                              <AppSwitch className={'mx-1'} variant={'pill'} color={'success'} label id={value.strategyName.concat('_', 'paper')} onChange={this.handleChange} checked={value.paperTrading} />
                            </Col>
                          </Row>
                        </CardBody>
                      </Collapse>
                    </Card>
                  ))}
                  </div>
                }
                </CardBody>
              </Card>
              <Modal isOpen={this.state.smallModal} className={'modal-sm ' + this.props.className}>
                <ModalHeader >{this.state.modalHeaderType}</ModalHeader>
                <ModalBody>
                  {this.state.modalBodyType}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Confirm</Button>{' '}
                  <Button color="secondary" onClick={this.closeModal} disabled={this.state.submitDisabled}>Cancel</Button>
                  { this.state.loadingSpinner ?
                  <Spinner animation="border" role="status" variant="secondary" />
                  : null
                  }
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Strategies);
