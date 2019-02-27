import React from 'react';
import FontAwesome from './font-awesome';
import {
  Alert
} from 'react-bootstrap';

const ErrorMessage = (props:{children:React.ReactNode}) => (
  <Alert bsStyle='danger'>
    <FontAwesome fa='exclamation-triangle' nbsp={true}/>
    {props.children}
  </Alert>
);

export default ErrorMessage;

