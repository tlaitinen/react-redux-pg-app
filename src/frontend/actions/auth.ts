import {ActionType, getType, createStandardAction} from 'typesafe-actions';
import {hydrate, HydrateAction} from './hydrate-action';
import {RootState} from '../reducers';
import {User} from '../../types/users';
export interface State {
  user: User | null;
  loginResult: string | null;
  loginTime: string | null;
}

const defState:State = {
  user: null,
  loginResult: null,
  loginTime: null,
};

export interface LoginActionPayload {
  email: string;
  password: string;
  jwt?: boolean;
}

export const actions = {
  login: createStandardAction('AUTH_LOGIN')<LoginActionPayload>(),
  logout: createStandardAction('AUTH_LOGOUT')<void>(),
  setUser: createStandardAction('AUTH_SET_USER')<User | null>(),
  loginFailed: createStandardAction('AUTH_LOGIN_FAILED')<string>(),
};
export type Action = ActionType<typeof actions>;

export const userSelector = (state:RootState) => state.auth.user;
export const loginResultSelector = (state:RootState) => state.auth.loginResult;

export function reducer(state:State = defState, action:Action | HydrateAction) {
  switch(action.type) {
    case getType(actions.setUser):
      return {
        ...state, 
        user: action.payload,
        loginTime: new Date().toISOString()
      };
    case getType(actions.loginFailed):
      return {
        ...state,
        loginResult: action.payload
      };
    case getType(hydrate):
      return action.payload.auth;
    default:
      return state;
  }
}
