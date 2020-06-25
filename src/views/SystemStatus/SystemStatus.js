import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import './SystemStatus.scss'
import { Auth } from 'aws-amplify';
import Papa from 'papaparse';

// const values = ["0", "0", "0"]
// const timestamp = ["1592829635.5", "1592829935.5", "1592830235.5",]
// const mydata = [{x: 1592842854500, y: "0"}, {x: 1592843154500, y: "0"}, {x: 1592843454500, y: "0"}, {x: 1592843754500, y: "0"}, {x: 1592844054500, y: "0"}, {x: 1592844354500, y: "0"}, {x: 1592844654500, y: "0"}, {x: 1592844954500, y: "0"}, {x: 1592845254500, y: "0"}, {x: 1592845554500, y: "0"}, {x: 1592845854500, y: "0"}, {x: 1592846154500, y: "0"}, {x: 1592846454500, y: "0"}, {x: 1592846754500, y: "0"}, {x: 1592847054500, y: "0"}, {x: 1592847354500, y: "0"}, {x: 1592847654500, y: "0"}, {x: 1592847954500, y: "0"}, {x: 1592848254500, y: "0"}, {x: 1592848554500, y: "0"}, {x: 1592848854500, y: "0"}, {x: 1592849154500, y: "0"}, {x: 1592849454500, y: "0"}, {x: 1592849754500, y: "0"}, {x: 1592850054500, y: "0"}, {x: 1592850354500, y: "0"}, {x: 1592850654500, y: "0"}, {x: 1592850954500, y: "0"}, {x: 1592851254500, y: "0"}, {x: 1592851554500, y: "0"}, {x: 1592851854500, y: "0"}, {x: 1592852154500, y: "0"}, {x: 1592852454500, y: "0"}, {x: 1592852754500, y: "0"}, {x: 1592853054500, y: "0"}, {x: 1592853354500, y: "0"}, {x: 1592853654500, y: "0"}, {x: 1592853954500, y: "0"}, {x: 1592854254500, y: "0"}, {x: 1592854554500, y: "0"}, {x: 1592854854500, y: "0"}, {x: 1592855154500, y: "0"}, {x: 1592855454500, y: "0"}, {x: 1592855754500, y: "0"}, {x: 1592856054500, y: "0"}, {x: 1592856354500, y: "0"}, {x: 1592856654500, y: "0"}, {x: 1592856954500, y: "0"}, {x: 1592857254500, y: "0"}, {x: 1592857554500, y: "0"}, {x: 1592857854500, y: "0"}, {x: 1592858154500, y: "0"}, {x: 1592858454500, y: "0"}, {x: 1592858754500, y: "0"}, {x: 1592859054500, y: "0"}, {x: 1592859354500, y: "0"}, {x: 1592859654500, y: "0"}, {x: 1592859954500, y: "0"}, {x: 1592860254500, y: "0"}, {x: 1592860554500, y: "0"}, {x: 1592860854500, y: "0"}, {x: 1592861154500, y: "0"}, {x: 1592861454500, y: "0"}, {x: 1592861754500, y: "0"}, {x: 1592862054500, y: "0"}, {x: 1592862354500, y: "0"}, {x: 1592862654500, y: "0"}, {x: 1592862954500, y: "0"}, {x: 1592863254500, y: "0"}, {x: 1592863554500, y: "0"}, {x: 1592863854500, y: "0"}, {x: 1592864154500, y: "0"}, {x: 1592864454500, y: "0"}, {x: 1592864754500, y: "0"}, {x: 1592865054500, y: "0"}, {x: 1592865354500, y: "0"}, {x: 1592865654500, y: "0"}, {x: 1592865954500, y: "0"}, {x: 1592866254500, y: "0"}, {x: 1592866554500, y: "0"}, {x: 1592866854500, y: "0"}, {x: 1592867154500, y: "0"}, {x: 1592867454500, y: "0"}, {x: 1592867754500, y: "0"}, {x: 1592868054500, y: "0"}, {x: 1592868354500, y: "0"}, {x: 1592868654500, y: "0"}, {x: 1592868954500, y: "0"}, {x: 1592869254500, y: "0"}, {x: 1592869554500, y: "0"}, {x: 1592869854500, y: "0"}, {x: 1592870154500, y: "0"}, {x: 1592870454500, y: "0"}, {x: 1592870754500, y: "0"}, {x: 1592871054500, y: "0"}, {x: 1592871354500, y: "0"}, {x: 1592871654500, y: "0"}, {x: 1592871954500, y: "0"}, {x: 1592872254500, y: "0"}, {x: 1592872554500, y: "0"}]

class SystemStatus extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    
    this.state = {
      jwttoken: "",
      loadingSpinner: true,
      chartData: []
    };
  }
  
  async componentWillMount() {
    this.setState({
      jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken(),
    });
    this.collectMetrics();
  }
  
  collectMetrics() {
    var completedRequests = 0;
    
    fetch('/api/metrics_def', {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      const that = this;
      const numberOfMetrics = responseJSON.length;
      
      responseJSON.forEach(function (arrayItem) {
        const thus = that;
        
        Papa.parse('/api/metrics?name='.concat(arrayItem.metricName), {
          header: true,
          download: true,
          downloadRequestHeaders: {
            'Authorization': that.state.jwttoken
          },
          complete: function(responseCSV) {
            console.log('papa parsed data: ', responseCSV.data);
            var csvdata = [];
            for (var i = 1; i < responseCSV.data.length; i++) {
              csvdata.push({"x": parseInt(responseCSV.data[i]["timeStamp"]) * 1000, "y": parseInt(responseCSV.data[i]["value"])});
            }
            
            thus.setState(prevState => ({
              chartData: [
                ...prevState.chartData,
                {
                  metricName: arrayItem.metricName,
                  metricResolution: arrayItem.resolution,
                  metricData: csvdata,
                }
              ]
            }));
          }
        });
      });
      
      var interval = setInterval(function() {
        if ( that.state.chartData.length === numberOfMetrics) {
          that.setState({
            loadingSpinner: false
          });
          console.log('chart state: ', that.state.chartData);
          clearInterval(interval);
        }
      }, 400);
    }).catch(err => {
      alert("Something went wrong contacting the server.");
      console.log('/api/metrics_def error: ', err);
    });
  }
  
  render() {
    console.log('chart data before render: ', this.state.chartData);
    return (
      <React.Fragment>
        { this.state.loadingSpinner ?
          <Spinner animation="border" role="status" variant="secondary" />
        :
        <div>
          { this.state.chartData.map((value, index) => (
          <Row>
            <Col>
              <Card>
                <CardHeader>
                { value.metricName }
                </CardHeader>
                <CardBody>
                  <div className="chart-wrapper">
                    <Line
                      data={{
                        datasets: [
                          {
                            data: value.metricData
                          }
                        ]
                      }}
                      options={{
                        legend: {
                          display: false
                        },
                        scales: {
                          xAxes: [{
                            type: 'time',
                            display: true,
                            distribution: 'series',
                            time: {
                              unit: value.metricResolution,
                            },
                            ticks: {
                              autoSkip: true,
                              maxTicksLimit: 10
                            }
                          }]
                        }
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          ))}
        </div>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(SystemStatus);
