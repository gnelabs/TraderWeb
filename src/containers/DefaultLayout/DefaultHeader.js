import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

import logo_main from '../../assets/img/brand/epithy_main_small1.png'
import logo_small_tr from '../../assets/img/brand/epithy_min_small2.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
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
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <div className="mr-3 float-left">
                Register
              </div>
            </DropdownToggle>
            <DropdownMenu right style={{ height: '400px', right: 0 }}>
              <DropdownItem>
                AppHeaderDropdown
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
