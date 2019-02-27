import {
  ActionType, getType, createAction, createStandardAction
} from 'typesafe-actions';
import {Modal} from '../../types/modals';
import {RootState} from '../reducers';
import {Location} from 'history';
import {parseHash} from './location';
export interface Message {
  time?: number;
  bsStyle: 'success' | 'warning' | 'danger' | 'info';
  text: string;
}
export interface State {
  loading: number;
  messages: Message[];
}

export const defState:State = {
  loading: 0,
  messages: []
};
export const loadingSelector = (state:RootState) => state.ui.loading > 0;
export const messagesSelector = (state:RootState) => state.ui.messages;
export const modalSelector = (location:Location) => {
  const hashInfo = parseHash(location.hash);
  const m = hashInfo.modals;
  if (m.length > 0) {
    return m[m.length - 1];
  }
}

export const actions = {
  setLoading: createStandardAction('UI_SET_LOADING')<boolean>(),
  showModal: createStandardAction('UI_SHOW_MODAL')<Modal>(),
  hideModal: createAction('UI_HIDE_MODAL', resolve => () => resolve()),
  showMessage: createStandardAction('UI_SHOW_MESSAGE')<Message>(),
  pushMessage: createStandardAction('UI_PUSH_MESSAGE')<Message>(),
  popMessage: createStandardAction('UI_POP_MESSAGE')<undefined>()
};

export type Action = ActionType<typeof actions>;
export function reducer(state:State = defState, action:Action) {
  switch(action.type) {
    case getType(actions.setLoading):
      return {
        ...state, 
        loading: Math.max(state.loading + (action.payload ? 1 : -1), 0)
      };
    case getType(actions.pushMessage):
      return {
        ...state,
        messages: state.messages.concat(action.payload)
      };
    case getType(actions.popMessage):
      return {
        ...state,
        messages: state.messages.slice(1, state.messages.length)
      };
    default:
      return state;
  }
}
