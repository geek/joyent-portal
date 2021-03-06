import styled from 'styled-components';
import Baseline from '../baseline';
import remcalc from 'remcalc';

const Label = styled.label`
  font-size: ${remcalc(15)};
  line-height: ${remcalc(18)};
  font-style: normal;
  font-stretch: normal;
  display: block;
  color: ${props => props.theme.secondary};
  text-align: left;
  margin-bottom: ${remcalc(3)};
`;

export default Baseline(Label);
