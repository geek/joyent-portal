import React from 'react';
import { Margin } from 'styled-components-spacing';

import { ViewContainer, H2 } from 'joyent-ui-toolkit';

import Name from '@containers/create-instance/name';
import Image from '@containers/create-instance/image';

export default ({ step }) => (
  <ViewContainer>
    <Margin top={4} bottom={4}>
      <H2>Create Instances</H2>
    </Margin>
    <Margin bottom={4}>
      <Name expanded={step === 'name'} />
    </Margin>
    <Margin bottom={4}>
      <Image expanded={step === 'image'} />
    </Margin>
  </ViewContainer>
);
