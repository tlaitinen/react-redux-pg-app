import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {
	withRouter, 
	RouteComponentProps,
  Route,
  Redirect
} from 'react-router-dom';
import {css} from 'emotion';
import {CSSObject} from 'create-emotion';
import {Grid} from 'react-bootstrap';

import {RootState} from '../reducers';
import {i18nSelector} from '../actions/locale';
import {
  userSelector
} from '../actions/auth';
import Modals from './modals';
import UIMessages from './ui-messages';
import Login from './login';
import Navigation from './navigation';
import EditUserGroup from './edit-user-group';
import Users from './users';
import EditUser from './edit-user';
import LoadingMask from './loading-mask';
import * as routes from '../actions/routes';
const containerCss:CSSObject = {
  padding: '0px 0px 0px 0px',
  margin: 0,
  height: '100%'
};

const attributionCss:CSSObject = {
  position: 'fixed',
  bottom: '5px',
  right: '5px',
  fontSize: '10px'
};
const copyrightCss:CSSObject = {
  position: 'fixed',
  fontSize: '10px',
  left: '5px',
  bottom: '5px'

};


type Props = PropsOf<typeof propsMapper> & RouteComponentProps<{}>;

const AuthApp = (_props:Props) => (
  <div>
    <Modals/>
    <Route exact path={routes.root} render={() => <Redirect to={routes.users}/>}/>
    <Route exact path={routes.users} component={Users}/>
    <Route exact path={routes.newUser} component={EditUser}/>
    <Route exact path={routes.user(':userId')} component={EditUser}/>
    <Route exact path={routes.userGroups} component={Users}/>
    <Route exact path={routes.userGroup(':userGroupId')} component={EditUserGroup}/>
    <Route exact path={routes.newUserGroup} component={EditUserGroup}/>
    <Route exact path={routes.account} render={props => <EditUser {...props} authUser={true}/>}/>
  </div>
);

const App = (props:Props) => (  
  <div className={css(containerCss)}>
    <LoadingMask/>
    <Navigation/>
    <div className={css(attributionCss)}>
      <a href='https://www.freepik.com/free-vector/abstract-blue-background_859016.htm'>
        Background by Freepik
      </a>
    </div>

    <UIMessages/>
    {props.user ? AuthApp(props) : <Login/>}
    <footer>
      <Grid>
        <div className={css(copyrightCss)}>
          &copy; 2019 {props.i18n.gettext('(copyright attribution here)')}
        </div>
      </Grid>
    </footer>
  </div>
);

const propsMapper = createPropsMapper({
  fromState: (state:RootState) => ({
    i18n: i18nSelector(state),
    user: userSelector(state),
  }),
  actions: () => ({
  })
});
export default withRouter(typedConnect(propsMapper)(App));
