import * as React from 'react';
import FontAwesome from './font-awesome';
import {FormGroup, InputGroup, FormControl} from 'react-bootstrap';
export const SearchBar = (props:{
  placeholder?:string;
  onChange?:(text:string) => void;
  value?:string;
}) => {
  return (
    <FormGroup>
      <InputGroup>
        <InputGroup.Addon>
          <FontAwesome fa='search'/>
        </InputGroup.Addon>
        <FormControl type='text' placeholder={props.placeholder} 
          value={props.value}
          onChange={(e:any) => {
            if (props.onChange) {
              props.onChange(e.target.value);
            }
          }}/>
      </InputGroup>
    </FormGroup>
  );
};
export default SearchBar;
