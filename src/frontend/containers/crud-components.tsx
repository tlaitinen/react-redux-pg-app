import {
  createCrudComponents
} from '../components/crud-components';

import * as users from '../actions/users-crud';
import * as userGroups from '../actions/user-groups-crud';

const stripWildcards = (q:string | undefined) => q ? q.slice(1, q.length - 1) : '';


export const Users = createCrudComponents({
  selectors: users.selectors,
  actions: users.actions,
  emptyQuery: {} as users.Query,
  queryText: (query) => stripWildcards(query.query),
  setQueryText: (query, text) => ({
    ...query,
    query: `%${text}%`
  }),
  offset: (query) => query.offset || 0,
  setOffset: (query, offset) => ({
    ...query,
    offset
  })
});


export const UserGroups = createCrudComponents({
  selectors: userGroups.selectors,
  actions: userGroups.actions,
  emptyQuery: {} as userGroups.Query,
  queryText: (query) => stripWildcards(query.query),
  setQueryText: (query, text) => ({
    ...query,
    query: `%${text}%`
  }),
  offset: (query) => query.offset || 0,
  setOffset: (query, offset) => ({
    ...query,
    offset
  })
});

