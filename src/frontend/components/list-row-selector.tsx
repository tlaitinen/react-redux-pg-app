import React from 'react';
import {
  Checkbox,
  Radio
} from 'react-bootstrap';
const ListRowSelector = (props:{
  multiple?:boolean;
  queryName: string;
  entityId: string;
  selected: {
    [entityId:string]: boolean | undefined
  } | undefined;
  clearSelected: (queryName:string) => void;
  setSelected: (queryName:string, entityId: string, value:boolean) => void;
}) => {
  const {
    multiple, queryName, entityId, selected, clearSelected, setSelected
  } = props;
  const checked = selected && selected[entityId] || false;
  if (multiple) {
    return (
      <Checkbox checked={checked}
        onChange={() => setSelected(queryName, entityId, !checked)}/>
    );
  } else {
    return (
      <Radio checked={checked}
        onChange={() => {
          clearSelected(queryName);
          setSelected(queryName, entityId, true);
        }}/>
    );
  }
}

export default ListRowSelector;

