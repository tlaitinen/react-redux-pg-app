import * as crud from './crud';
import {RootState} from '../reducers';
import * as t from '../../types/users';
import {hydrateConfig} from './hydrate-action';
export const types = t.types;
export type Types = t.Types;
export type Action = crud.Action<Types>;
export type State = crud.State<Types>;
export type Query = t.Query;
export type User = t.User;
export type UserIn = t.UserIn;
export const emptyUserIn = t.emptyUserIn;

export const {selectors, actions, reducer, rootSaga, match} = crud.create(
  types, 
  (state:RootState) => state.users,
  hydrateConfig
);

