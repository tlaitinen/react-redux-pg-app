import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {
  Table,
  Checkbox
} from 'react-bootstrap';
import LoadingMask from '../components/loading-mask';
import ListRowSelector from '../components/list-row-selector';
import * as cc from './crud-components';
import * as routes from '../actions/routes';
import {RootState} from '../reducers';
import {i18nSelector} from '../actions/locale';
import {
  selectors as usersSelectors,
  actions as usersActions,
  Query as UsersQuery
} from '../actions/users-crud';
import * as qn from '../actions/crud-query-names';
import {selectors as userGroupsSelectors} from '../actions/user-groups-crud';
import RouterLink from './router-link';
const UsersList = (props:PropsOf<typeof propsMapper>) => {
  const {
    search, header, selectable, groups, i18n, users, userGroups,
    queryName, selected, setSelected, archived, query, fetchUsers,
    clearSelected
  } = props;
  const userGroupName = (userGroupId:string) => {
    const ug = userGroups[userGroupId];
    return ug ? ug.name : null;
  };
  return (
    <React.Fragment>
      {search 
        ? <cc.Users.SearchBar queryName={queryName} placeholder={i18n.gettext('Type to search users')}/>
        : null}
      {archived 
        ? <Checkbox checked={query ? !query.active : false} onChange={() => {
          if (query) {
            fetchUsers({...query, active: !query.active});
          }
        }}>
          {i18n.gettext('Show archived users')}
        </Checkbox> : null}


      <div style={{position:'relative'}}>
        <LoadingMask loading={users ? users.loading : false}/>
        <Table responsive striped hover>
          {header 
            ? <thead>
              <tr>
                {selectable ? <th></th> : null}
                <th>{i18n.gettext('First Name')}</th>
                <th>{i18n.gettext('Last Name')}</th>
                <th>{i18n.gettext('Email')}</th>
                {groups ? <th>{i18n.gettext('Group')}</th> : null}
              </tr>
            </thead> : null}
          <tbody>
            {users ? users.results.map(e => {
              const u = e.entity;
              return (
                <tr key={u.id}>
                  {selectable 
                    ? <td>
                      <ListRowSelector multiple={selectable === 'many'}
                        queryName={queryName}
                        entityId={u.id}
                        selected={selected}
                        setSelected={setSelected}
                        clearSelected={clearSelected}
                        />
                    </td> : null}
                  <td><RouterLink url={routes.user(u.id)}>{u.firstName}</RouterLink></td>
                  <td><RouterLink url={routes.user(u.id)}>{u.lastName}</RouterLink></td>
                  <td><RouterLink url={routes.user(u.id)}>{u.email}</RouterLink></td>
                  {groups 
                    ? <td>
                      {u.userGroupId 
                        ? <RouterLink url={routes.userGroup(u.userGroupId)}>
                          {userGroupName(u.userGroupId)}
                        </RouterLink> : null}
                    </td> : null}
                </tr>
              );
            }) : null}
          </tbody>
        </Table>
      </div>
    </React.Fragment>
  );
};
const propsMapper = createPropsMapper({
  fromState:(state:RootState, ownProps:{
    queryName:string;
    groups?: boolean;
    selectable?: 'many' | 'one';
    search?: boolean;
    archived?: boolean;
    header?: boolean;
  }) => ({
    i18n: i18nSelector(state),
    users: usersSelectors.queryResults(state, ownProps.queryName),
    userGroups: userGroupsSelectors.entities(state),
    selected: usersSelectors.selected(state, ownProps.queryName),
    query: usersSelectors.query(state, ownProps.queryName || qn.def),
  }),
  actions: (ownProps) => ({
    setSelected: usersActions.setSelected,
    clearSelected: usersActions.clearSelected,
    fetchUsers: (query:UsersQuery) =>  usersActions.fetchResults(ownProps.queryName || qn.def, query)
  })
});
export default typedConnect(propsMapper)(UsersList);



