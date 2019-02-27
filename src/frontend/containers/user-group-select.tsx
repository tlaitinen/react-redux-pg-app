import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {RootState} from '../reducers';
import {FormControl} from 'react-bootstrap';
import {selectors as userGroupsSelectors} from '../actions/user-groups-crud';
import * as qn from '../actions/crud-query-names';
const UserGroupSelect = (props:PropsOf<typeof propsMapper>) => {
  const {onChange, disabled, userGroups, userGroupId, className} = props;
  return (
    <FormControl className={className} componentClass='select' 
      value={userGroupId}
      disabled={disabled}
      onChange={(e:React.FormEvent<FormControl>) => {
        onChange((e.target as any).value);
      }}>
      {userGroups && userGroups.results.map(ug => 
        <option key={ug.entity.id} value={ug.entity.id}>
          {ug.entity.name}
        </option>)}
    </FormControl>
  );
};

const propsMapper = createPropsMapper({
  fromState: (state:RootState, ownProps:{
    className?:string;
    queryName?:string;
    userGroupId:string;
    onChange:(userGroupId:string) => void;
    disabled?:boolean;
  }) => ({
    userGroups: userGroupsSelectors.queryResults(state, ownProps.queryName || qn.activeUserGroups)
  }),
  actions: () => ({})
});

export default typedConnect(propsMapper)(UserGroupSelect)
