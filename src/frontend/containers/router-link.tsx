import React from 'react';
import {
  typedConnect,
  createPropsMapper,
  PropsOf
} from 'react-redux-typed-connect';
import {RootState} from '../reducers';
import {actions as locationActions} from '../actions/location';
const RouterLink = (props:PropsOf<typeof propsMapper>) => (
  <a href={props.url} className={props.className} onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    props.pushPathName(props.url);
  }}>
    {props.children}
  </a>
);
const propsMapper = createPropsMapper({
  fromState: (_state:RootState, _ownProps:{
    url:string;
    children: React.ReactNode;
    className?: string;
  }) => ({}),
  actions: () => ({
    pushPathName: locationActions.pushPathName
  })
});
export default typedConnect(propsMapper)(RouterLink);
