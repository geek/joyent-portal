import React from 'react';
import styled from 'styled-components';
import remcalc from 'remcalc';
import is from 'styled-is';

const Header = styled.div`
  ${is('fluid')`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
  `};

  background-color: ${props => props.theme.brandBackground};
  max-height: ${remcalc(53)};
  min-height: ${remcalc(53)};
  padding: 0 ${remcalc(18)};
  line-height: ${remcalc(25)};
`;

/**
 * @example ./usage.md
 */
export default ({ children, ...rest }) => <Header {...rest}>{children}</Header>;

export { default as Brand } from './brand';
export { default as Item } from './item';
