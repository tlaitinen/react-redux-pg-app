import React from 'react';
import {typedConnect, createPropsMapper, PropsOf} from 'react-redux-typed-connect';
import {loadingSelector} from '../actions/ui';
import {RootState} from '../reducers';
import Spinner from '../components/spinner';
import {css} from 'emotion';
import {CSSObject} from 'create-emotion';
const maskCss:CSSObject = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 10000,
  backgroundColor: 'rgba(0, 0, 0, 0.4)'
};

const loaderCss:CSSObject = {
  backgroundColor: 'rgba(128,128,128, 0.5)',
  width: '50%',  
  maxWidth: '100px',
  height: '100px',
  margin:  '10% auto',
  paddingTop: '25px',
  textAlign: 'center',
  borderRadius: '1em',
  color: '#333333'
};
const LoadingMask = (props:PropsOf<typeof propsMapper>) => {
	const {loading} = props;
	if (!loading)
		return null;
	return (
		<div className={css(maskCss)}>
			<div className={css(loaderCss)}>
        <Spinner x3={true}/>
			</div>
		</div>
	);
};
const propsMapper = createPropsMapper({
  fromState: (state:RootState) => ({
    loading: loadingSelector(state)
  }),
  actions: () => ({})
});

export default typedConnect(propsMapper)(LoadingMask);


