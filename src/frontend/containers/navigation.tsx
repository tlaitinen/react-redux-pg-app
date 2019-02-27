import * as React from 'react';
import {RootState} from '../reducers';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {
  typedConnect,
  createPropsMapper,
  PropsOf
} from 'react-redux-typed-connect';
import {
	Navbar,
	Nav,
	NavItem
} from 'react-bootstrap';
import {selectors as userGroupsSelectors} from '../actions/user-groups-crud';
import {userSelector} from '../actions/auth';
import {i18nSelector} from '../actions/locale';
import {actions as locationActions} from '../actions/location';
import FontAwesome from '../components/font-awesome';
import * as routes from '../actions/routes';

export type NavigationProps = PropsOf<typeof propsMapper> & RouteComponentProps<{}>;

const Navigation = (props:NavigationProps) => {
  const {
    i18n, location, user
  } = props;
  const url = location.pathname;
  let title;
  if (url === '/users') {
    title = i18n.gettext('Users');
  } else if (url === '/user-groups') {
    title = i18n.gettext('User Groups');
  } else if (url === '/account') {
    title = i18n.gettext('Account')
  }
  return (
    <div>
      <Navbar>  
        <Navbar.Header>
          <Navbar.Brand>
            {title}
          </Navbar.Brand>
          {user ? <Navbar.Toggle/> : null}
        </Navbar.Header>
        <Navbar.Collapse>
          {user 
            ? <Nav pullRight onSelect={(eventKey:any) => {
              if (eventKey !== url) {
                props.pushPathName(eventKey);
              }
            }}>
              <NavItem eventKey={routes.users}>
                <FontAwesome fa='users' nbsp={true}/>
                {i18n.gettext('Users')}
              </NavItem>
              <NavItem eventKey={routes.account}>
                <FontAwesome fa='user' nbsp={true}/>
                {i18n.gettext('Account')}
              </NavItem>
            </Nav> : null}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
const propsMapper = createPropsMapper({
  fromState: (state:RootState) => {
    const user = userSelector(state);
    return {
      i18n: i18nSelector(state),
      user,
      userGroup: user && user.userGroupId ? userGroupsSelectors.entity(state, user.userGroupId) : undefined
    };
  },
  actions: () => ({
    pushPathName: locationActions.pushPathName
  })
});
export default withRouter(typedConnect(propsMapper)(Navigation));
