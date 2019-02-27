import * as React from 'react';

import {
  FormGroup,
  Col,
  ControlLabel
} from 'react-bootstrap';

export const HFormGroup = (props:{title:React.ReactNode, children:React.ReactNode}) => 
  <FormGroup>
    <Col componentClass={ControlLabel} sm={2}>
      {props.title}
    </Col>
    <Col sm={10}>
      {props.children}
    </Col>
  </FormGroup>;

export default HFormGroup;
