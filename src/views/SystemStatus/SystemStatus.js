import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import './SystemStatus.scss'
import { Auth } from 'aws-amplify';
import Papa from 'papaparse';


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
  
  // Metrics def tells how many metrics there are to chart.
  collectMetrics() {
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
        
        // First chart, recent historical.
        Papa.parse('/api/metrics?name='.concat(arrayItem.metricName), {
          header: true,
          download: true,
          downloadRequestHeaders: {
            'Authorization': that.state.jwttoken
          },
          complete: function(responseCSV) {
            var csvdata = [];
            for (var i = 1; i < responseCSV.data.length; i++) {
              csvdata.push({"x": parseInt(responseCSV.data[i]["timeStamp"]) * 1000, "y": parseInt(responseCSV.data[i]["value"])});
            }
            
            thus.setState(prevState => ({
              chartData: [
                ...prevState.chartData,
                {
                  metricName: arrayItem.metricName.concat("-RecentHistorical"),
                  metricResolution: arrayItem.resolution,
                  metricData: csvdata,
                }
              ]
            }));
          }
        });
        
        // Second chart, realtime.
        Papa.parse('/api/metrics?limit=576&name='.concat(arrayItem.metricName), {
          header: true,
          download: true,
          downloadRequestHeaders: {
            'Authorization': that.state.jwttoken
          },
          complete: function(responseCSV) {
            var csvdata = [];
            for (var i = 1; i < responseCSV.data.length; i++) {
              csvdata.push({"x": parseInt(responseCSV.data[i]["timeStamp"]) * 1000, "y": parseInt(responseCSV.data[i]["value"])});
            }
            
            thus.setState(prevState => ({
              chartData: [
                ...prevState.chartData,
                {
                  metricName: arrayItem.metricName.concat("-Realtime"),
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
          clearInterval(interval);
        }
      }, 400);
    }).catch(err => {
      alert("Something went wrong contacting the server.");
      console.log('/api/metrics_def error: ', err);
    });
  }
  
  render() {
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
