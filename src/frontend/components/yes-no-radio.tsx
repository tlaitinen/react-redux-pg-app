import React from 'react';
import {Radio} from 'react-bootstrap';
import {Jed} from 'jed';
const YesNoRadio = (props:{
  i18n:Jed;
  onChange: (value:boolean) => void;
  value: boolean;
  disabled?: boolean;
  
}) => (
  <React.Fragment>
    <Radio disabled={props.disabled} 
      inline onChange={() => props.onChange(true)} checked={props.value}>
      {props.i18n.gettext('Yes')}
    </Radio>
    <Radio disabled={props.disabled} 
      inline onChange={() => props.onChange(false)} checked={!props.value}>
      {props.i18n.gettext('No')}
    </Radio>
  </React.Fragment>
);

export default YesNoRadio;

