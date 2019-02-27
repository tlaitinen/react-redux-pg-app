import * as React from 'react';
import classNames from 'classnames';

import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
fontawesome.library.add(solid, regular);
export type FontAwesomeClasses = {[className:string]:boolean | undefined};
export interface Props {
  beforeNbsp?:boolean;
	nbsp?:boolean;
	regular?:boolean;
	faClasses?: FontAwesomeClasses;
  fa?: string;
};
interface State {
  renderFirst: boolean;
}
export class FontAwesome extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {
      renderFirst: true
    };
  }
  componentWillReceiveProps(np:Props) {
    if (this.props !== np) {
      this.setState({
        renderFirst: !this.state.renderFirst
      });
    }
  }
  renderIcon() {
    const {
      faClasses={}, fa, regular
    } = this.props;
    if (fa) {
      faClasses['fa-' + fa] = true;
    }
    return (
      <span>
        <i className={classNames({...faClasses, fas:!regular, far:regular})}/>
      </span>
    )
  }
  render() {
    const {nbsp} = this.props;
    const {renderFirst} = this.state;
    
    return (
      <span>
      {renderFirst ? this.renderIcon() : null}
      {!renderFirst ? this.renderIcon() : null}
      {nbsp ? <span>&nbsp;</span> : null}
      </span>
    );
  }
};

export default FontAwesome;
