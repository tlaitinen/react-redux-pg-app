import {Action, defaultEditorId} from './actions';
import {
  EntityStatus,
  PostStatus,
  State,
  Results,
  createDefState
} from './state';

export type EntityWithStatus<O> = {entity: O} & EntityStatus;

export interface QueryResults<O,Q> {
  query: Q;
  loading: boolean;
  error?: string;
  status?: number;
  results: EntityWithStatus<O>[];
  selected: {
    [entityId:string]: boolean | undefined;
  };
}

export interface Selectors<O,I,Q,RS> {
  query: (s:RS, queryName:string) => Q | undefined;
  allResults: (s:RS) => {[queryName:string]: Results | undefined};
  results: (s:RS, queryName:string) => Results | undefined;
  entities: (s:RS) => {[entityId:string]: O | undefined};
  entity: (s:RS, entityId:string) => O | undefined;
  entityStatus: (s:RS, entityId?:string) => EntityStatus;
  allEntityStatus: (s:RS) => {[entityId:string]: EntityStatus | undefined};
  selected: (s:RS, queryName:string) => {[entityId:string]:boolean | undefined} | undefined;
  allSelected: (s:RS, queryName:string) => boolean;
  selectedList: (s:RS, queryName:string) => string[];
  entityIn: (s:RS, editorId?:string) => I | undefined;
  postStatus: (s:RS, editorId?:string) => PostStatus<O,I> | undefined;
  allPostStatus: (s:RS) => {[editorId:string]:PostStatus<O,I> | undefined};
  queryResults: (s:RS, queryName:string) => QueryResults<O,Q> | undefined;
  entityId: (entity:O) => string;
};

export function createSelectors<O,I,Q,RS>(getState:(rs:RS) => State<O,I,Q>, getId:(entity:O) => string):Selectors<O,I,Q,RS> {
  return {
    query: (s:RS, queryName:string) => getState(s).queries[queryName],
    allResults: (s:RS) => getState(s).results,
    results: (s:RS, queryName:string) => getState(s).results[queryName],
    entities: (s:RS) => getState(s).entities,
    entity: (s:RS, entityId:string) => getState(s).entities[entityId],
    entityStatus: (s:RS, entityId?:string) => entityId ? getState(s).entityStatus[entityId] || {busy:false} : {busy:false},
    allEntityStatus: (s:RS) => getState(s).entityStatus,
    selected: (s:RS, queryName:string) => getState(s).selected[queryName],
    allSelected: (s:RS, queryName:string) => getState(s).allSelected[queryName] || false,
    selectedList: (s:RS, queryName:string) => {
      const sel = getState(s).selected[queryName];
      if (!sel) {
        return [];
      }
      return Object.keys(sel).filter(entityId => sel[entityId]);
    },
    entityIn: (s:RS, editorId?:string) => getState(s).entitiesIn[editorId || defaultEditorId],
    postStatus: (s:RS, editorId?:string) => getState(s).postStatus[editorId || defaultEditorId],
    allPostStatus: (s:RS) => getState(s).postStatus,
    queryResults: (s:RS, queryName:string) => {
      const st = getState(s);
      const query = st.queries[queryName];
      const r = st.results[queryName];
      if (!query || !r) {
        return;
      }
      const results:EntityWithStatus<O>[] = [];
      r.results.forEach((entityId:string) => {
        const entity:O | undefined = st.entities[entityId];
        const entityStatus = st.entityStatus[entityId] || {busy:false};
        if (entity) {
          results.push({
            ...entityStatus,
            entity
          });
        }
      });
      return {
        query,
        loading: r.loading,
        error: r.error,
        status: r.status,
        results,
        selected: st.selected[queryName] || {}
      };
    },
    entityId: getId
  };
}

export function createReducer<O,I,Q,HA>(
  crudId:string,
  isHydrateAction:(action:any) => action is HA,
  getStateFromHydrateAction:(ha:HA) => State<O,I,Q>
) {
  const defState = createDefState<O,I,Q>();
  return function(state:State<O,I,Q> = defState, action:Action<O,I,Q> | HA) {
    if (!isHydrateAction(action) && (
      !action.payload || action.payload.crudId !== crudId
    )) {
      return state;
    }
    if (isHydrateAction(action)) {
      return getStateFromHydrateAction(action);
    }
    switch(action.type) {
      case 'CRUD_SET_QUERY':
        return {
          ...state,
          queries: {
            ...state.queries,
            [action.payload.queryName]: action.payload.query
          }
        };
      case 'CRUD_SET_RESULTS':
        return {
          ...state,
          results: {
            ...state.results,
            [action.payload.queryName]: action.payload.results
          }
        };
      case 'CRUD_SET_ENTITIES':
        return {
          ...state,
          entities: {
            ...state.entities,
            ...action.payload.entities
          }
        };
      case 'CRUD_SET_ENTITY_STATUS':
        return {
          ...state,
          entityStatus: {
            ...state.entityStatus,
            [action.payload.entityId]: {
              ...state.entityStatus[action.payload.entityId],
              ...action.payload.entityStatus
            }
          }
        };
      case 'CRUD_CLEAR_SELECTED':
        return {
          ...state,
          selected: {
            ...state.selected,
            [action.payload.queryName]: {}
          },
          allSelected: {
            ...state.allSelected,
            [action.payload.queryName]: false
          }
        };
      case 'CRUD_SET_SELECTED':
        return {
          ...state,
          selected: {
            ...state.selected,
            [action.payload.queryName]: {
              ...state.selected[action.payload.queryName],
              [action.payload.entityId]: action.payload.selected
            }
          },
          allSelected: {
            ...state.allSelected,
            [action.payload.queryName]: action.payload.selected
              ? state.allSelected[action.payload.queryName]
              : false
          }
        };
      case 'CRUD_SET_SELECTED_MANY':
        return {
          ...state,
          selected: {
            ...state.selected,
            [action.payload.queryName]: {
              ...state.selected[action.payload.queryName],
              ...action.payload.selected
            }
          }
        };
     case 'CRUD_SELECT_ALL':
        return {
          ...state,
          allSelected: {
            ...state.allSelected,
            [action.payload.queryName]: true
          }
        };
      case 'CRUD_SET_POST_STATUS':
        return {
          ...state,
          postStatus: {
            ...state.postStatus,
            [action.payload.editorId]: action.payload.postStatus
          }
        };
      case 'CRUD_SET_ENTITY_IN':
        return {
          ...state,
          entitiesIn: {
            ...state.entitiesIn,
            [action.payload.editorId]: action.payload.entityIn
          }
        };
      default: 
        return state;
    }
  }
}


