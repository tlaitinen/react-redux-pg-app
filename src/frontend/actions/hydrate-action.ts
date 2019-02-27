import {RootState} from '../reducers';
import {ActionType, getType, createStandardAction} from 'typesafe-actions';
import {HydrateConfig} from './crud';
export const hydrate = createStandardAction('HYDRATE')<RootState>();

export type HydrateAction = ActionType<typeof hydrate>;

export const hydrateConfig:HydrateConfig<HydrateAction, RootState> = {
  isHydrateAction: (action:any):action is HydrateAction => action.type === getType(hydrate),
  getStateFromAction: (action:HydrateAction) => action.payload
};

