import React from 'react';

import {Button} from 'react-bootstrap';
import FontAwesome from './font-awesome';
import {Jed} from 'jed';
export interface Props {
  i18n: Jed;
  active: boolean;
  className?:string;
  disabled?:boolean;
  onClick: (e:React.MouseEvent<Button>) => void;
}
const ArchiveButton = (props:Props) => (
  <Button disabled={props.disabled}
    className={props.className} bsStyle='warning' onClick={props.onClick}>
    <FontAwesome nbsp={true} faClasses={{
      'fa-archive': props.active,
      'fa-box-open': !props.active
    }}/>
    {props.active ? props.i18n.gettext('Archive') : props.i18n.gettext('Unarchive')}
  </Button>
);
export default ArchiveButton;
