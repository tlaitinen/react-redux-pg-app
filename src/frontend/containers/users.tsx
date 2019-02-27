import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
	Panel,
  Tabs,
  Tab
} from 'react-bootstrap';
import {FontAwesome} from '../components/font-awesome';
import AppContainer from '../components/app-container';
import {RootState} from '../reducers';
import {i18nSelector} from '../actions/locale';
import {userSelector} from '../actions/auth';
import UsersList from './users-list';
import UserGroupsList from './user-groups-list';
import * as qn from '../actions/crud-query-names';
import {actions as locationActions} from '../actions/location';
type Props = PropsOf<typeof propsMapper> & RouteComponentProps<{}>;
function usersTab(props:Props) {
  const {i18n, user, pushPathName} = props;
  if (!user) {
    return null;
  }
  return (
    <React.Fragment>
      <UsersList archived={true} header={true} groups={user.admin} search={true} queryName={qn.def}/>
      <ButtonToolbar>
        <Button bsStyle='primary' 
          onClick={() => {
            pushPathName('/new-user');
          }}>
         <FontAwesome nbsp={true} fa='plus'/>{i18n.gettext('New User')}
        </Button>
      </ButtonToolbar>
    </React.Fragment>
  );
}
const Users = (props:Props) => {
  const {i18n, user, pushPathName, location} = props;
  if (!user) {
    return null;
  }
  return (
    <AppContainer>
			<Panel>
				<Panel.Body>
          {user.admin 
            ? <Tabs id='users-user-groups-tab' activeKey={location.pathname} onSelect={(key:any) => {
            if (key !== location.pathname) {
              pushPathName(key);
            }
          }}>
            <Tab eventKey='/users' title={i18n.gettext('Users')}>
              {usersTab(props)}
            </Tab>
            <Tab eventKey='/user-groups' title={i18n.gettext('User Groups')}>
              <UserGroupsList archived={true} search={true} queryName={qn.def}/>
              <ButtonToolbar>
                <Button bsStyle='primary' 
                  onClick={() => {
                    pushPathName('/new-user-group');
                  }}>
                  <FontAwesome nbsp={true} fa='plus'/>{i18n.gettext('New User Group')}
                </Button>
              </ButtonToolbar>
            </Tab> 
          </Tabs> : usersTab(props)}
				</Panel.Body>
			</Panel>
		</AppContainer>
  );

}
const propsMapper = createPropsMapper({
  fromState: (state:RootState) => ({
    i18n: i18nSelector(state),
    user: userSelector(state)
  }),
  actions: () => ({
    pushPathName: locationActions.pushPathName
  })
});

export default withRouter(typedConnect(propsMapper)(Users));
