import {reducer as auth, Action as AuthAction, State as AuthState} from './actions/auth';
import {reducer as ui, Action as UIAction, State as UIState} from './actions/ui';
import {reducer as users, Action as UsersAction, State as UsersState} from './actions/users-crud';
import {reducer as userGroups, Action as UserGroupsAction, State as UserGroupsState} from './actions/user-groups-crud';
import {reducer as locale, Action as LocaleAction, State as LocaleState} from './actions/locale';
import {RouterAction} from 'react-router-redux';


import {
  Dispatch as ReduxDispatch,
  Reducer as ReduxReducer,
  combineReducers
} from 'redux';

export type RootAction = 
  AuthAction
  | UIAction
  | UsersAction
  | UserGroupsAction
  | LocaleAction
  | RouterAction;

export interface RootState {
  auth: AuthState;
  ui: UIState;
  users: UsersState;
  userGroups: UserGroupsState;
  locale: LocaleState;
}

export type Dispatch = ReduxDispatch<RootAction>;

export type Reducer = ReduxReducer<RootState>;
export const rootReducer = combineReducers<RootState>({
  auth,
  ui,
  users,
  userGroups,
  locale
} as any);
