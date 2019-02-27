import * as React from 'react';
import {css} from 'emotion';

import {Grid} from 'react-bootstrap';

const containerCss = {
  'min-height': '100%'
};
export const AppContainer = (props:{children:React.ReactNode}) =>
  <Grid className={css(containerCss)}>{props.children}</Grid>;
export default AppContainer;
