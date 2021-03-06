import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { Row, Col } from 'joyent-react-styled-flexboxgrid';
import { Margin } from 'styled-components-spacing';
import pascalCase from 'pascal-case';
import titleCase from 'title-case';
import remcalc from 'remcalc';

import * as Assets from 'joyent-logo-assets';

import {
  H3,
  P,
  FormGroup,
  SectionList,
  SectionListItem,
  SectionListAnchor,
  H4,
  Select,
  Card
} from 'joyent-ui-toolkit';

const Version = styled(Select)`
  min-width: 100%;
  width: ${remcalc(144)};

  select {
    margin: 0;
    border-bottom-width: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

export const Preview = ({ name, version, isVm }) => (
  <Fragment>
    <Margin bottom={2} top={3}>
      <H3>{name}</H3>
      <P>{isVm ? 'Hardware Virtual Machine' : 'Infrastructure Container'} </P>
    </Margin>
  </Fragment>
);

const Image = ({ onClick, active, ...image }) => {
  const { imageName = '', versions = [] } = image;

  const id = `image-card-${imageName}`;

  const handleCardClick = ev => {
    return ev.target.id === id ? onClick(image) : null;
  };

  const handleLogoClick = ev => {
    return onClick(image);
  };

  const Logo = Assets[pascalCase(imageName)] || Assets.Placeholder;

  return (
    <Col md={2} sm={3}>
      <Margin bottom={3}>
        <Card id={id} onClick={handleCardClick} active={active} preview>
          <Logo onClick={handleLogoClick} width="42" height="42" />
          <H4 onClick={handleLogoClick}>
            {titleCase(imageName) || 'Custom Images'}
          </H4>
          <FormGroup name="image" field={Field}>
            <Version onBlur={null}>
              <option selected>Version</option>
              {versions.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Version>
          </FormGroup>
        </Card>
      </Margin>
    </Col>
  );
};

export const ImageType = ({ setImageType, vms }) => (
  <Margin bottom={4}>
    <SectionList>
      <SectionListItem>
        <SectionListAnchor active={vms} onClick={() => setImageType(true)}>
          Hardware virtual machine
        </SectionListAnchor>
      </SectionListItem>
      <SectionListItem>
        <SectionListAnchor active={!vms} onClick={() => setImageType(false)}>
          Infrastructure container
        </SectionListAnchor>
      </SectionListItem>
    </SectionList>
  </Margin>
);

export default ({ images = [], onSelectLatest }) => (
  <form>
    <Row>
      {images.map(({ imageName, ...image }) => (
        <Image
          {...image}
          key={imageName}
          imageName={imageName}
          onClick={onSelectLatest}
        />
      ))}
    </Row>
  </form>
);
