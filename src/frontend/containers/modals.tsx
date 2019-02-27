import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {modalSelector} from '../actions/ui';
import {RootState} from '../reducers';
import SetPasswordModal from './set-password-modal';
const Modals = (props:PropsOf<typeof propsMapper>) => {
  const m = props.modal;
  if (!m) {
    return null;
  }
  switch(m.type) {
    case 'SetPassword':
      return <SetPasswordModal />;

    default:
      return null;
  }
};
const propsMapper = createPropsMapper({
  fromState: (_state:RootState, ownProps:RouteComponentProps<{}>) => ({
    modal: modalSelector(ownProps.location)
  }),
  actions: () => ({})
});
export default withRouter(typedConnect(propsMapper)(Modals));
