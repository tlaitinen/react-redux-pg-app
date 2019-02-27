import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {
  Panel,
  Form,
  FormControl
} from 'react-bootstrap';
import UserGroupSelect from './user-group-select';
import AppContainer from '../components/app-container';
import HFormGroup from '../components/h-form-group';
import UsersList from './users-list';
import ArchiveButton from '../components/archive-button';
import HFormGroupControl from '../components/h-form-group-control';
import * as qn from '../actions/crud-query-names';
import {RootState} from '../reducers';
import {i18nSelector} from '../actions/locale';
import {userSelector} from '../actions/auth';
import {
  UserGroup, UserGroupIn, emptyUserGroupIn
} from '../actions/user-groups-crud';
import {
  selectors as usersSelectors
} from '../actions/users-crud';
import * as cc from './crud-components';
import {EditorProps} from '../components/crud-editor';
type RouteProps = RouteComponentProps<{userGroupId?:string}>;
type Props = PropsOf<typeof propsMapper> & RouteProps;
function defaultEntityIn(props:Props):UserGroupIn | undefined {
  const {user} = props;
  if (!user || !user.userGroupId) {
    return;
  }
  return {
    ...emptyUserGroupIn,
    userGroupId: user.userGroupId
  };
}


const EditUserGroup = (props:Props) => {
  const {
    match, i18n, user
  } = props;
  function renderEditor(editorProps:EditorProps<UserGroup, UserGroupIn>) {
    const {
      entity, entityIn, update,
      renderEntityStatus, renderInsertButton
    } = editorProps;
    if (!user) {
      return null;
    }


    const userGroup = entity;
    const userGroupIn = entityIn;
    return (
      <AppContainer>
        <Panel>
          <Panel.Heading>
            {userGroup ? userGroup.name : userGroupIn ? userGroupIn.name : null}
          </Panel.Heading>
          <Panel.Body>
            <Form horizontal>
              <HFormGroupControl title={i18n.gettext('Name')}
                type='text' 
                value={userGroup ? userGroup.name : userGroupIn ? userGroupIn.name : ''} 
                placeholder={i18n.gettext('Enter name')} 
                onChange={(e:React.FormEvent<FormControl>) => {
                  update({
                    name: (e.target as any).value
                  });
                }}/>
              {user.admin 
                ? <HFormGroup title={i18n.gettext('User Group')}>
                  <UserGroupSelect 
                    userGroupId={(userGroup ? userGroup.userGroupId : userGroupIn ? userGroupIn.userGroupId : '') || ''} 
                    onChange={(userGroupId) => update({userGroupId})}/>
                </HFormGroup> : null}
              {userGroup
                ? <HFormGroup title={i18n.gettext('Users')}>
                    <UsersList queryName={qn.userGroup(userGroup.id)}/> 
                  </HFormGroup> : null}
            </Form>
            {userGroup && userGroup.id !== user.userGroupId
              ? <ArchiveButton 
              className='pull-right' active={userGroup.active} i18n={i18n}
                onClick={() => update({
                  active: !userGroup.active
                })}/> : null}

             
            {renderEntityStatus()}
            {renderInsertButton(i18n.gettext('Add New User Group'))}
          </Panel.Body>
        </Panel>
      </AppContainer>
    );
  }
  return (
    <cc.UserGroups.Editor
      entityId={match.params.userGroupId}
      defaultEntityIn={() => defaultEntityIn(props)}
      isValid={(p:UserGroup | UserGroupIn) => p.name !== ''}
      render={renderEditor}/>
  );
}

const propsMapper = createPropsMapper({
  fromState: (state:RootState, _ownProps:RouteProps) => {
    return {
      i18n: i18nSelector(state),
      user: userSelector(state),
      users: usersSelectors.entities(state)
    };
  },
  actions: () => ({
  })
});
export default withRouter(typedConnect(propsMapper)(EditUserGroup));


