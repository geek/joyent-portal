import React from 'react';
import styled from 'styled-components';
import { Card, H2, P } from '../';
import remcalc from 'remcalc';

const CardStyled = styled(Card)`
  margin-bottom: ${remcalc(36)};
`;

const Header = styled.header`
  background: ${props => props.theme.primary};
  padding: ${remcalc(50)} ${remcalc(120)};
  position: relative;
`;

const Main = styled.div`
  padding: ${remcalc(50)} ${remcalc(120)};

  h4[class*='rsg--heading'] {
    margin: 0;
    line-height: ${remcalc(26)};
    font-size: ${remcalc(21)};

    & + p {
      margin-top: ${remcalc(24)};
    }
  }
`;

export default allProps => {
  const { name, content, components, sections, depth, description } = allProps;

  const Tag = depth === 2 ? CardStyled : 'div';
  const TagMain = depth === 2 ? Main : 'div';
  return (
    <Tag id={name.replace(/\s+/g, '-').toLowerCase()}>
      {name &&
        depth !== 1 && (
          <Header>
            <H2 white>{name}</H2>
            {description && <P white>{description}</P>}
          </Header>
        )}
      <TagMain>
        {content}
        {components}
        {sections}
      </TagMain>
    </Tag>
  );
};
