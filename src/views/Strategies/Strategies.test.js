import React from 'react';
import ReactDOM from 'react-dom';
import Strategies from './Strategies';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Strategies />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<Strategies />);
});
