import { Subscriber } from 'joy-react-broadcast';
import is from 'styled-is';
import PropTypes from 'prop-types';
import React from 'react';
import remcalc from 'remcalc';

import Baseline from '../baseline';
import Label from '../label';

const StyledLabel = Label.extend`
  ${is('right')`
    float: right;
  `};

  ${is('error')`
    color: ${props => props.theme.red};
    -webkit-text-fill-color: currentcolor;
  `};

  ${is('warning')`
    color: ${props => props.theme.orange};
    -webkit-text-fill-color: currentcolor;
  `};

  ${is('success')`
    color: ${props => props.theme.green};
    -webkit-text-fill-color: currentcolor;
  `};

  ${is('top')`
    margin-top: ${remcalc(0)};
    margin-bottom: ${remcalc(6)};
  `};

  font-size: ${remcalc(13)};
  margin-top: ${remcalc(6)};
  float: none;
  width: ${remcalc(300)};

  ${is('small')`
    width: ${remcalc(120)};
  `};
`;

const Meta = props => {
  const render = (value = {}) => {
    const { meta = {} } = value;

    const msg =
      props.children ||
      props.error ||
      props.warning ||
      props.success ||
      meta.error ||
      meta.warning ||
      meta.success ||
      value.error ||
      value.warning ||
      value.success;

    const hasError = Boolean(props.error || meta.error || value.error);
    const hasWarning = Boolean(props.warning || meta.warning || value.warning);
    const hasSuccess = Boolean(props.success || meta.success || value.success);
    const isRight = !props.left;

    return msg ? (
      <StyledLabel
        {...meta}
        {...props}
        error={hasError}
        warning={hasWarning}
        success={hasSuccess}
        right={isRight}
      >
        {msg}
      </StyledLabel>
    ) : null;
  };

  return <Subscriber channel="input-group">{render}</Subscriber>;
};

Meta.propTypes = {
  children: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  left: PropTypes.bool,
  success: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  warning: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default Baseline(Meta);
