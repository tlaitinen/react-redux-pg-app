import React from 'react';
import FontAwesome from './font-awesome';

const Spinner = (props:{
  x2?:boolean;
  x3?:boolean;
}) => <FontAwesome faClasses={{
  fa: true,
  'fa-spin': true,
  'fa-spinner': true,
  'fa-2x': props.x2 || false,
  'fa-3x': props.x3 || false
}}/>;

export default Spinner;
  
