import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import emailValidator from 'email-validator';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import UserGroupSelect from './user-group-select';
import ArchiveButton from '../components/archive-button';
import {
  Panel,
  Form,
  FormControl,
  Button,
  ButtonToolbar
} from 'react-bootstrap';
import AppContainer from '../components/app-container';
import HFormGroup from '../components/h-form-group';
import FontAwesome from '../components/font-awesome';
import HFormGroupControl from '../components/h-form-group-control';
import {RootState} from '../reducers';
import YesNoRadio from '../components/yes-no-radio';
import {i18nSelector, actions as localeActions} from '../actions/locale';
import {userSelector} from '../actions/auth';
import {
  User, UserIn, emptyUserIn
} from '../actions/users-crud';
import {actions as uiActions} from '../actions/ui';
import {actions as authActions} from '../actions/auth';
import * as cc from './crud-components';
import {EditorProps} from '../components/crud-editor';
type OwnProps = {authUser?:boolean} & RouteComponentProps<{userId?:string}>;
type Props = PropsOf<typeof propsMapper> & OwnProps;
function defaultEntityIn(props:Props):UserIn | undefined {
  const {user} = props;
  if (!user || !user.userGroupId) {
    return;
  }
  return {
    ...emptyUserIn,
    userGroupId: user.userGroupId
  };
}


const EditUser = (props:Props) => {
  const {
    match, i18n, authUser,  showModal, logout,
    setLanguage
  } = props;

  function renderEditor(editorProps:EditorProps<User, UserIn>) {
    const {
      entity, entityIn, update, 
      renderEntityStatus, renderInsertButton
    } = editorProps;

    const user = entity;
    const userIn = entityIn;
    const isAuthUser = user && props.user && user.id == props.user.id || false;
    const readOnly = user && props.user ? (
      user.userGroupId !== props.user.userGroupId
      && !props.user.admin
    ) : false;
    return (
      <AppContainer>
        <Panel>
          <Panel.Heading>
            {user ? user.email : userIn ? userIn.email : null}
          </Panel.Heading>
          <Panel.Body>
            <Form horizontal>
              <HFormGroupControl title={i18n.gettext('Email')}
                type='text' 
                disabled={readOnly}
                value={user ? user.email : userIn ? userIn.email : ''} 
                placeholder={i18n.gettext('Enter email')} 
                onChange={(e:React.FormEvent<FormControl>) => {
                  update({
                    email: (e.target as any).value
                  });
                }}/>
              {!isAuthUser && props.user && props.user.admin ? <HFormGroup title={i18n.gettext('User Group')}>
                  <UserGroupSelect 
                    disabled={isAuthUser || readOnly}
                    userGroupId={(user ? user.userGroupId : userIn ? userIn.userGroupId : '') || ''} 
                    onChange={(userGroupId) => update({userGroupId})}/>
                </HFormGroup> : null}
              <HFormGroupControl title={i18n.gettext('First Name')}
                type='text' 
                value={(user ? user.firstName : userIn ? userIn.firstName : '') || ''} 
                disabled={readOnly}
                placeholder={i18n.gettext('Enter first name')} 
                onChange={(e:React.FormEvent<FormControl>) => {
                  update({
                    firstName: (e.target as any).value
                  });
                }}/>
              <HFormGroupControl title={i18n.gettext('Last Name')}
                type='text' 
                disabled={readOnly}
                value={(user ? user.lastName : userIn ? userIn.lastName : '') || ''} 
                placeholder={i18n.gettext('Enter last name')} 
                onChange={(e:React.FormEvent<FormControl>) => {
                  update({
                    lastName: (e.target as any).value
                  });
                }}/>
              <HFormGroupControl title={i18n.gettext('Language')}
                componentClass='select' 
                value={user ? user.language : userIn ? userIn.language : 'en'}
                disabled={readOnly}
                onChange={(e:React.FormEvent<FormControl>) => {
                  const language = (e.target as any).value;
                  update({language});
                  if (authUser) {
                    setLanguage(language);
                  }
                }}>
                <option value='en'>{i18n.gettext('English')}</option>
                <option value='fi'>{i18n.gettext('Finnish')}</option>
              </HFormGroupControl>

              {!isAuthUser
                ? <HFormGroup title={i18n.gettext('Group Admin')}>
                    <YesNoRadio 
                      i18n={i18n}
                      value={user ? user.groupAdmin : userIn ? userIn.groupAdmin : false} 
                      onChange={(value) => update({groupAdmin: value})}/>
                  </HFormGroup> : null}
          </Form>
            {user && !readOnly
              ? <ButtonToolbar>
                {isAuthUser
                  ? <React.Fragment>
                    <Button onClick={() => showModal({
                        type: 'SetPassword'
                      })}>
                      <FontAwesome fa='key' nbsp={true}/>
                    {i18n.gettext('Set Password')}
                    </Button> 
                    <Button bsStyle='warning' onClick={logout} className='pull-right'>
                      <FontAwesome fa='sign-out-alt' nbsp={true}/>
                      {i18n.gettext('Sign Out')}
                    </Button>
                  </React.Fragment> : null}
                {!isAuthUser 
                  ? <ArchiveButton 
                    className='pull-right' active={user.active} i18n={i18n}
                      onClick={() => update({
                        active: !user.active
                      })}/> : null}

              </ButtonToolbar> : null}
            {renderEntityStatus()}
            {renderInsertButton(i18n.gettext('Add New User'))}
          </Panel.Body>
        </Panel>
      </AppContainer>
    );
  }
  return (
    <cc.Users.Editor
      entityId={authUser && props.user ? props.user.id : match.params.userId}
      defaultEntityIn={() => defaultEntityIn(props)}
      isValid={(p:User | UserIn) => emailValidator.validate(p.email)}
      render={renderEditor}/>
  );
}

const propsMapper = createPropsMapper({
  fromState: (state:RootState, _ownProps:OwnProps) => {
    return {
      i18n: i18nSelector(state),
      user: userSelector(state),
    };
  },
  actions: () => ({
    showModal: uiActions.showModal,
    logout: authActions.logout,
    setLanguage: localeActions.setLanguage
  })
});
export default withRouter(typedConnect(propsMapper)(EditUser));


