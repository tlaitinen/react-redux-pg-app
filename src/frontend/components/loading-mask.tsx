import React from 'react';
import {FontAwesome} from '../components/font-awesome';
import {css} from 'emotion';
import {CSSObject} from 'create-emotion';
const maskCss:CSSObject = {
  position: 'absolute',
  width:'100%',
  height: '100%',
  zIndex: 100,
  backgroundColor: 'rgba(0, 0, 0, 0.2)'
};
const loaderCss:CSSObject = {
  backgroundColor: 'rgba(128,128,128, 0.2)',
  width: '10%',
  maxWidth: '100px',
  height: '50px',
  margin:  '10% auto',
  paddingTop: '12px',
  textAlign: 'center',
  borderRadius: '1em',
  color: '#333333'
};


const LoadingMask = (props:{loading:boolean}) => {
	if (!props.loading)
		return null;
	return (
		<div className={css(maskCss)}>
      <div className={css(loaderCss)}>
        <FontAwesome faClasses={{
          fa: true,
          'fa-spin': true,
          'fa-spinner': true,
          'fa-2x': true
        }}/>
      </div>
		</div>
	);
};

export default LoadingMask;
