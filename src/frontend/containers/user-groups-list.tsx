import React from 'react';
import {
  typedConnect, createPropsMapper, PropsOf
} from 'react-redux-typed-connect';
import {
  Table,
  Checkbox,
  Alert
} from 'react-bootstrap';
import LoadingMask from '../components/loading-mask';
import * as cc from './crud-components';
import * as routes from '../actions/routes';
import * as qn from '../actions/crud-query-names';
import {RootState} from '../reducers';
import {i18nSelector} from '../actions/locale';
import {
  selectors as userGroupsSelectors,
  actions as userGroupsActions,
  Query as UserGroupsQuery
} from '../actions/user-groups-crud';
import RouterLink from './router-link';
const UserGroupsList = (props:PropsOf<typeof propsMapper>) => {
  const {
    search, selectable, i18n, userGroups,
    queryName, selected, setSelected, archived, query, fetchUserGroups
  } = props;

  return (
    <React.Fragment>
      {search 
        ? <cc.UserGroups.SearchBar queryName={queryName} placeholder={i18n.gettext('Type to search user groups')}/>
        : null}
			{archived 
        ? <Checkbox checked={query ? !query.active : false} onChange={() => {
          if (query) {
            fetchUserGroups({...query, active: !query.active});
          }
        }}>
          {i18n.gettext('Show archived user groups')}
        </Checkbox> : null}
      <div style={{position:'relative'}}>
        <LoadingMask loading={userGroups ? userGroups.loading : false}/>
        <Table responsive striped hover>
          <thead>
            <tr>
              {selectable ? <th></th> : null}
              <th>{i18n.gettext('Name')}</th>
            </tr>
          </thead>
          <tbody>
            {userGroups ? userGroups.results.map(e => {
              const ug = e.entity;
              return (
                <tr key={ug.id}>
                  {selectable 
                    ? <td>
                      <Checkbox 
                        checked={selected && selected[ug.id] || false}
                        onClick={() => {
                          setSelected(ug.id, !(selected && selected[ug.id]));
                        }}
                        />
                    </td> : null}
                  <td>
                    <RouterLink url={routes.userGroup(ug.id)}>
                      {ug.name}
                    </RouterLink>
                  </td>
                </tr>
              );
            }) : null}
          </tbody>
        </Table>
        {userGroups && userGroups.error ? <Alert bsStyle='danger'>{userGroups.error}</Alert> : null}
      </div>
    </React.Fragment>
  );
};
const propsMapper = createPropsMapper({
  fromState:(state:RootState, ownProps:{
    queryName:string;
    selectable?: boolean;
    archived?: boolean;
    search?: boolean;
  }) => ({
    i18n: i18nSelector(state),
    userGroups: userGroupsSelectors.queryResults(state, ownProps.queryName),
    selected: userGroupsSelectors.selected(state, ownProps.queryName),
    query: userGroupsSelectors.query(state, ownProps.queryName || qn.def),
  }),
  actions: (ownProps) => ({
    setSelected: (entityId: string, selected:boolean) => userGroupsActions.setSelected(ownProps.queryName, entityId, selected),
    fetchUserGroups: (query:UserGroupsQuery) =>  userGroupsActions.fetchResults(ownProps.queryName || qn.def, query)
  })
});
export default typedConnect(propsMapper)(UserGroupsList);



