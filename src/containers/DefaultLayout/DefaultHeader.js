import React, { Component } from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { Auth } from 'aws-amplify';

import logo_main from '../../assets/img/brand/epithy_main_small1.png'
import logo_small_tr from '../../assets/img/brand/epithy_min_small2.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};



class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      hoursUntilExpiry: 0,
      badgeColor: 'light'
    };
  }
  
  // Grab the remaining hours for the robinhood API token.
  async componentWillMount() {
    this.setState({
      jwttoken: (await Auth.currentSession()).getIdToken().getJwtToken()
    });
    
    fetch('/api/get_remaining_rh_token_hours', {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.remaining_hours < 9) {
        this.setState({
          badgeColor: 'warning',
          hoursUntilExpiry: responseJSON.remaining_hours
        });
      } else {
        this.setState({
          hoursUntilExpiry: responseJSON.remaining_hours
        });
      }
    });
  }
  
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo_main, width: 165, height: 110, alt: 'Epithy Logo' }}
          minimized={{ src: logo_small_tr, width: 81, height: 54, alt: 'Epithy Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg">
            &nbsp; <span className="navbar-toggler-icon" /> Menu
        </AppSidebarToggler>
        <Nav className="ml-auto" navbar>
          <Badge className="mr-1 float-left" color={this.state.badgeColor}>Robinhood Token<br />expires in {this.state.hoursUntilExpiry} hours</Badge>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
