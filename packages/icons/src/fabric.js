import React from 'react';

import Colors from './colors';
import Rotate from './rotate';
import calcFill from './fill';

export default ({
  fill = null,
  light = false,
  disabled = false,
  direction = 'down',
  style = {},
  ...rest
}) => (
  <Colors white text grey>
    {colors => (
      <Rotate direction={direction}>
        {({ style: rotateStyle }) => (
          <svg
            viewBox="0 0 16.2 16.2"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="17"
            height="17"
            style={{ ...style, ...rotateStyle }}
            {...rest}
          >
            <path
              d="M16.2,6.61a17.42,17.42,0,0,0-3.37-.26,11.67,11.67,0,0,1-.47-4A15.72,15.72,0,0,1,16,2.59l.2-1a16,16,0,0,0-3.77-.24A11,11,0,0,1,12.59.2l-1-.2a14.09,14.09,0,0,0-.2,1.46A8.44,8.44,0,0,0,7.82,2.68c-.15.1-.31.19-.47.28A15.07,15.07,0,0,1,7.59.2l-1-.2a16.37,16.37,0,0,0-.26,3.37,11.66,11.66,0,0,1-4,.46A15.6,15.6,0,0,1,2.59.2l-1-.2a16.29,16.29,0,0,0-.25,3.77C.67,3.7.21,3.61.2,3.61l-.2,1c.07,0,.63.12,1.46.19a8.48,8.48,0,0,0,1.22,3.6A5.3,5.3,0,0,1,3,8.85,17.52,17.52,0,0,1,.2,8.61l-.2,1a16.66,16.66,0,0,0,3,.26h.4a11.71,11.71,0,0,1,.46,4A17,17,0,0,1,.2,13.61l-.2,1a16.66,16.66,0,0,0,3,.26l.8,0c-.07.7-.16,1.16-.16,1.17l1,.2c0-.07.12-.63.19-1.46a8.49,8.49,0,0,0,3.6-1.23c.15-.1.3-.18.46-.27A16.88,16.88,0,0,1,8.61,16l1,.2a17,17,0,0,0,.25-3.37,11.73,11.73,0,0,1,4-.47A17.13,17.13,0,0,1,13.61,16l1,.2a17.28,17.28,0,0,0,.24-3.77,11,11,0,0,1,1.17.16l.2-1a14.09,14.09,0,0,0-1.46-.2,8.45,8.45,0,0,0-1.23-3.59c-.1-.15-.18-.31-.27-.47A15.07,15.07,0,0,1,16,7.59ZM8.38,3.51a7.26,7.26,0,0,1,3-1,13.17,13.17,0,0,0,.44,3.93,9.35,9.35,0,0,0-3.51,1A8.4,8.4,0,0,1,7.39,4,6.75,6.75,0,0,0,8.38,3.51ZM2.48,4.84H3a12.4,12.4,0,0,0,3.44-.44,9.35,9.35,0,0,0,1,3.51A8.38,8.38,0,0,1,4,8.8a6.18,6.18,0,0,0-.53-1A7.36,7.36,0,0,1,2.48,4.84Zm5.34,7.84a7.22,7.22,0,0,1-3,1A12.61,12.61,0,0,0,4.4,9.78a9,9,0,0,0,3.52-1,8.43,8.43,0,0,1,.88,3.37A7.11,7.11,0,0,0,7.82,12.68Zm5.9-1.33a13.23,13.23,0,0,0-3.94.44,9,9,0,0,0-1-3.51,8.44,8.44,0,0,1,3.38-.89,6.69,6.69,0,0,0,.52,1A7.13,7.13,0,0,1,13.72,11.35Z"
              fill={calcFill({ fill, disabled, light, colors })}
            />
          </svg>
        )}
      </Rotate>
    )}
  </Colors>
);