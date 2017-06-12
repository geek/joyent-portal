import remcalc from 'remcalc';
import Baseline from '../baseline';
import View from './view';
import React from 'react';

const StyledView = View.extend`
  display: block;
  padding: ${remcalc(62, 23, 5, 23)};
  background-color: ${props => props.grey};
`;

const GroupView = ({ children, ...rest }) =>
  <StyledView {...rest}>
    {children}
  </StyledView>;

export default Baseline(GroupView);
