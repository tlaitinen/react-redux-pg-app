import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {Alert} from 'react-bootstrap';
import {css} from 'emotion';
import {CSSObject} from 'create-emotion';
import {RootState} from '../reducers';
import {messagesSelector} from '../actions/ui';

const messagesCss: CSSObject = {
  zIndex: 1,
  position: 'fixed',
  left: '30%',
  bottom: '5px',
  width: '40%',
  padding: '20px'
};

const UIMessages = (props:PropsOf<typeof propsMapper>) => (
  <div className={css(messagesCss)}>
    {props.messages.map(m => 
      <Alert key={m.time} bsStyle={m.bsStyle}>
        {m.text}
      </Alert>)}
  </div>
);

const propsMapper = createPropsMapper({
  fromState: (state:RootState) => ({
    messages: messagesSelector(state)
  }),
  actions: () => ({})
});
export default typedConnect(propsMapper)(UIMessages);
