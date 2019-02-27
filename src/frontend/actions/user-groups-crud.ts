import * as crud from './crud';
import {RootState} from '../reducers';
import * as t from '../../types/user-groups';
import {hydrateConfig} from './hydrate-action';
export const types = t.types;
export type Types = t.Types;
export type Action = crud.Action<Types>;
export type State = crud.State<Types>;
export type UserGroup = t.UserGroup;
export type UserGroupIn = t.UserGroupIn;
export type Query = t.Query;
export const emptyUserGroupIn = t.emptyUserGroupIn;

export const {selectors, actions, reducer, rootSaga, match} = crud.create(
  types, 
  (state:RootState) => state.userGroups,
  hydrateConfig
);
