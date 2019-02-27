import {createAction} from 'typesafe-actions';
import {
  PostStatus,
  EntityStatus,
  Results
} from './state';
export const defaultEditorId = '';
export interface FetchResultsPartialQuery<Q> {
  type: 'CRUD_FETCH_RESULTS_PARTIAL_QUERY';
  payload: {
    crudId: string;
    queryName: string;
    query: Partial<Q>;
    delay?: number;
  };
}
export interface FetchResults<Q> {
  type: 'CRUD_FETCH_RESULTS';
  payload: {
    crudId: string;
    queryName: string;
    query: Q;
  };
}

export interface FetchResultsLater<Q> {
  type: 'CRUD_FETCH_RESULTS_LATER';
  payload: {
    crudId: string;
    delay: number;
    queryName: string;
    query: Q;
  };
}
export interface Put<O> {
  type: 'CRUD_PUT';
  payload: {
    crudId: string;
    entityId: string;
    entity: O;
    localUpdate: boolean;
  };
}
export interface Post<I> {
  type: 'CRUD_POST';
  payload: {
    crudId: string;
    editorId: string;
    entity: I;
    retry?: boolean;
  };
}

export interface SetQuery< Q> {
  type: 'CRUD_SET_QUERY';
  payload: {
    crudId: string;
    queryName: string;
    query: Q;
  };
}
export interface SetResults {
  type: 'CRUD_SET_RESULTS';
  payload: {
    crudId: string;
    queryName: string;
    results: Results
    synthetic?: boolean;
  };
}

export interface SetEntities<O> {
  type: 'CRUD_SET_ENTITIES';
  payload: {
    crudId: string;
    entities: {[entityId:string]:O}
  };
}

export interface SetEntityStatus {
  type: 'CRUD_SET_ENTITY_STATUS';
  payload: {
    crudId: string;
    entityId: string;
    entityStatus: Partial<EntityStatus>;

  };
}
export interface SetSelected {
  type: 'CRUD_SET_SELECTED';
  payload: {
    crudId: string;
    queryName: string;
    entityId: string;
    selected: boolean;
  };
}

export interface SetSelectedMany {
  type: 'CRUD_SET_SELECTED_MANY';
  payload: {
    crudId: string;
    queryName: string;
    selected: {[entityId:string]: boolean | undefined};
  };
}
export interface ClearSelected {
  type: 'CRUD_CLEAR_SELECTED';
  payload: {
    crudId: string;
    queryName: string;
  };
}

export interface SetPostStatus<O,I> {
  type: 'CRUD_SET_POST_STATUS';
  payload: {
    crudId: string;
    editorId: string;
    postStatus: PostStatus<O,I>;
  };
}

export interface SetEntityIn<I> {
  type: 'CRUD_SET_ENTITY_IN';
  payload: {
    crudId: string;
    editorId: string;
    entityIn: I;
  };
}
export interface PutEntityLater<O> {
  type: 'CRUD_PUT_ENTITY_LATER';
  payload: {
    crudId: string;
    entityId: string;
    entity: O;
  };
}
export interface PutEntityPartial<O> {
  type: 'CRUD_PUT_ENTITY_PARTIAL';
  payload: {
    crudId: string;
    entityId: string;
    entity: Partial<O>;
  };
}
export interface StartSyncTimer {
  type: 'CRUD_START_SYNC_TIMER';
  payload: {
    crudId: string;
  };
}
export interface SelectAll {
  type: 'CRUD_SELECT_ALL';
  payload: {
    crudId: string;
    queryName: string;
  };
}
export interface LoadMissing {
  type: 'CRUD_LOAD_MISSING';
  payload: {
    crudId: string;
    ids: string[];
  };
}

export type Action<O,I,Q> = 
  FetchResults<Q>
  | FetchResultsPartialQuery<Q>
  | FetchResultsLater<Q>
  | Put<O>
  | Post<I>
  | SetQuery<Q> 
  | SetResults 
  | SetEntities<O>
  | SetEntityStatus
  | ClearSelected
  | SetSelected
  | SetSelectedMany
  | SetPostStatus<O,I>
  | SetEntityIn<I>
  | PutEntityLater<O>
  | PutEntityPartial<O>
  | StartSyncTimer
  | SelectAll
  | LoadMissing;

export interface Actions<O,I,Q> {
  fetchResultsPartialQuery: (queryName:string, query:Partial<Q>, delay?: number) => FetchResultsPartialQuery<Q>;
  fetchResults: (queryName:string, query:Q) => FetchResults<Q>;
  fetchResultsLater: (queryName:string, query:Q, delay:number) => FetchResultsLater<Q>;
  putEntity: (entityId:string, entity:O, localUpdate?:boolean) => Put<O>;
  postEntity: (entity:I, editorId?:string, retry?:boolean) => Post<I>;
  setQuery: (queryName:string, query:Q) => SetQuery<Q>;
  setResults: (queryName:string, results:Results, synthetic?:boolean) => SetResults;
  setEntities: (entities:{[entityId:string]:O}) => SetEntities<O>;
  setStatus: (entityId:string, entityStatus:Partial<EntityStatus>) => SetEntityStatus;
  setSelected: (queryName: string, entityId: string, selected:boolean) => SetSelected;
  setSelectedMany: (queryName: string, selected:{[entityId:string]: boolean | undefined}) => SetSelectedMany;
  selectAll: (queryName:string) => SelectAll;
  clearSelected: (queryName: string) => ClearSelected;
  setPostStatus: (postStatus:PostStatus<O,I>, editorId?:string) => SetPostStatus<O,I>;
  setEntityIn: (entityIn:I, editorId?: string) => SetEntityIn<I>;
  putEntityLater: (entityId:string, entity:O) => PutEntityLater<O>;
  putEntityPartial: (entityId:string, entity:Partial<O>) => PutEntityPartial<O>;
  startSyncTimer: () => StartSyncTimer;
  loadMissing: (ids:(string | null)[]) => LoadMissing;
}
export function create<O,I,Q>(crudId:string):Actions<O,I,Q> {
	return {
		fetchResultsPartialQuery: createAction('CRUD_FETCH_RESULTS_PARTIAL_QUERY', resolve => (queryName:string, query:Partial<Q>) => resolve({
			crudId,
			queryName,
			query
		})),
		fetchResults: createAction('CRUD_FETCH_RESULTS', resolve => (queryName: string, query:Q) => resolve({
			crudId,
			queryName,
			query
		})),
		fetchResultsLater: createAction('CRUD_FETCH_RESULTS_LATER', resolve => (queryName: string, query:Q, delay:number) => resolve({
			crudId, 
			queryName,
			query,
			delay
		})),
		putEntity: createAction('CRUD_PUT', resolve => (entityId:string, entity:O, localUpdate?:boolean) =>resolve({
			crudId,
			entityId,
			entity,
			localUpdate: localUpdate !== undefined ? localUpdate : true
		})),
		postEntity: createAction('CRUD_POST', resolve => (entity:I, editorId?:string, retry?:boolean) => resolve({
			crudId,
			entity,
			editorId: editorId || defaultEditorId,
			retry
		})),
		setQuery: createAction('CRUD_SET_QUERY', resolve => (queryName: string, query:Q) => resolve({
			crudId,
			queryName,
			query
		})),
		setResults: createAction('CRUD_SET_RESULTS', resolve => (queryName: string, results:Results, synthetic?: boolean) => resolve({
			crudId,
			queryName,
			results,
			synthetic
		})),
		setEntities: createAction('CRUD_SET_ENTITIES', resolve => (entities: {[entityId:string]:O}) => resolve({
			crudId,
			entities
		})),
		setStatus: createAction('CRUD_SET_ENTITY_STATUS', resolve => (entityId: string, entityStatus:Partial<EntityStatus>) => resolve({
			crudId,
			entityId,
			entityStatus
		})),
		setSelected: createAction('CRUD_SET_SELECTED', resolve => (queryName:string, entityId:string, selected:boolean) => resolve({
			crudId,
			queryName,
			entityId,
			selected
		})),
		setSelectedMany: createAction('CRUD_SET_SELECTED_MANY', resolve => (queryName:string, selected:{[entityId:string]: boolean | undefined}) => resolve({
			crudId,
			queryName,
			selected
		})),
		selectAll: createAction('CRUD_SELECT_ALL', resolve => (queryName:string) => resolve({crudId, queryName})),
		clearSelected: createAction('CRUD_CLEAR_SELECTED', resolve => (queryName:string) => resolve({
			crudId,
			queryName
		})),
		setPostStatus: createAction('CRUD_SET_POST_STATUS', resolve => (postStatus:PostStatus<O,I>, editorId?:string) => resolve({
			crudId,
			editorId: editorId || defaultEditorId,
			postStatus
		})),
		setEntityIn: createAction('CRUD_SET_ENTITY_IN', resolve => (entityIn:I, editorId?: string) => resolve({
			crudId,
			editorId: editorId || defaultEditorId,
			entityIn
		})),
		putEntityLater: createAction('CRUD_PUT_ENTITY_LATER', resolve => (entityId:string, entity:O) => resolve({
			crudId,
			entityId,
			entity
    })),
    putEntityPartial: createAction('CRUD_PUT_ENTITY_PARTIAL', resolve => (entityId:string, entity:Partial<O>) => resolve({
      crudId,
      entityId,
      entity
    })),
		startSyncTimer: createAction('CRUD_START_SYNC_TIMER', resolve => () => resolve({crudId})),
		loadMissing: createAction('CRUD_LOAD_MISSING', resolve => (ids:(string | null)[]) => {
			const r:string[] = [];
			const rm:{[id:string]: boolean|undefined} = {};
			ids.forEach(id => {
				if (id !== null && !rm[id]) {
					r.push(id);
					rm[id] = true;
				}
			});
			return resolve({
				crudId,
				ids: r
			});
		})
	};
}

