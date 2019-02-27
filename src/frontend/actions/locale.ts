import {getType, ActionType, createStandardAction} from 'typesafe-actions';
import {hydrate, HydrateAction} from './hydrate-action';
import Jed from 'jed';
import {RootState} from '../reducers';
import {languages, Language} from './languages';
import {createSelector} from 'reselect';

export type State = Language;

const defState:State = 'en';
export const actions = {
  setLanguage: createStandardAction('LOCALE_SET_LANGUAGE')<Language>(),
};

export type Action = ActionType<typeof actions>;

export const languageSelector = (state:RootState) => state.locale;

export const i18nSelector = createSelector(
  languageSelector,
  (language:Language) => {
    return new Jed(languages[language]);
  }
);

export function reducer(state:State = defState, action:Action | HydrateAction) {
  switch (action.type) {
    case getType(actions.setLanguage): 
      return action.payload;
    case getType(hydrate):
      return action.payload.locale;
    default:
      return state;
  }
}
