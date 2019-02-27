import React from 'react';
import {FormControl} from 'react-bootstrap';
import HFormGroup from './h-form-group';
const HFormGroupControl = (props:FormControl.FormControlProps & {title:string}) => (
  <HFormGroup title={props.title}>
    <FormControl {...props}/>
  </HFormGroup>
);



export default HFormGroupControl;
