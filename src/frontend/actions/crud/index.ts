import * as actions from './actions';
import * as reducer from './reducer';
import * as state from './state';
import * as saga from './saga';
import * as dbRoutes from '../../client/crud-routes';
import {CrudTypes} from '../../../types/crud';
export type Results = state.Results;
export type EntityStatus = state.EntityStatus;
export type PostStatus<O,I> = state.PostStatus<O,I>;
export type Actions<O,I,Q> = actions.Actions<O,I,Q>;

export type QueryResults<O,Q> = reducer.QueryResults<O,Q>;
export type Selectors<O,I,Q,RS> = reducer.Selectors<O,I,Q,RS>;
export type EntityWithStatus<O> = reducer.EntityWithStatus<O>;

export type SetEntitiesAction<CT> = CT extends CrudTypes<
  infer _I, infer _IO, infer O, infer _OO, infer _Q, infer _QO
  > ? actions.SetEntities<O> : never;

export type SetResultsAction = actions.SetResults;
export type SetEntityStatusAction = actions.SetEntityStatus;
export type SetPostStatusAction<CT> = CT extends CrudTypes<
  infer I, infer _IO, infer O, infer _OO, infer _Q, infer _QO
  > ? actions.SetPostStatus<O,I> : never;

export type Action<CT> = CT extends CrudTypes<
    infer I, infer _IO, infer O, infer _OO, infer Q, infer _QO
  > ? actions.Action<O,I,Q> : never;
export type State<CT> = CT extends CrudTypes< 
    infer I, infer _IO, infer O, infer _OO, infer Q, infer _QO 
  > ? state.State<O,I,Q> : never;   

export interface HydrateConfig<HA,RS> {
  isHydrateAction: (action:any) => action is HA;
  getStateFromAction:(ha:HA) => RS;
}
export function create<I,IO,O,OO,Q,QO,RS,HA>(
  types:CrudTypes<I,IO,O,OO,Q,QO>, 
  getState:(rs:RS) => state.State<O,I,Q>, 
  hc: HydrateConfig<HA,RS>) {
  const crudId = types.base;
  const selectors = reducer.createSelectors<O,I,Q,RS>(getState, types.getId);
  const actions_ = actions.create<O,I,Q>(crudId);
  const rootSaga = saga.create<O,I,Q,RS>({
    crudId, 
    getId: types.getId, 
    getState, 
    entitiesQuery: types.entitiesQuery,
    withoutOffsetLimit: types.withoutOffsetLimit,
    api: dbRoutes.create(types), 
    actions: actions_
  }).root;
  function match<A extends actions.Action<O,I,Q>>(type:A['type']) {
    return (action:any):action is A => {
      if (!action || !action.type) {
        return false;
      }
      if (action.type === type) {
        return action.payload.crudId === crudId;
      } else {
        return false;
      }
    };
  }
  return {
    selectors,
    actions: actions_,
    reducer: reducer.createReducer<O,I,Q,HA>(
      crudId, 
      hc.isHydrateAction,
      (ha:HA) => getState(hc.getStateFromAction(ha))
    ),
    rootSaga,
    match: {
      setResults: match<actions.SetResults>('CRUD_SET_RESULTS'),
      setEntities: match<actions.SetEntities<O>>('CRUD_SET_ENTITIES'),
      setEntityStatus: match<actions.SetEntityStatus>('CRUD_SET_ENTITY_STATUS'),
      setPostStatus: match<actions.SetPostStatus<O,I>>('CRUD_SET_POST_STATUS')
    }
  };
}
