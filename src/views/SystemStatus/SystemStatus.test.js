import React from 'react';
import ReactDOM from 'react-dom';
import SystemStatus from './SystemStatus';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SystemStatus />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<SystemStatus />);
});
