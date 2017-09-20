import typography from '../typography';
import styled from 'styled-components';
import remcalc from 'remcalc';

export default styled.p`
  ${typography.normal};
  ${typography.color};

  line-height: ${remcalc(24)};
  font-size: ${remcalc(15)};
  margin: 0;

  + p,
  + small,
  + h1,
  + h2,
  + label,
  + h3,
  + h4,
  + h5,
  + div,
  + span {
    padding-bottom: ${remcalc(36)};
  }
`;
