export interface Results {
  results: string[];
  loading: boolean;
  error?: string;
  status?: number;
}

export interface EntityStatus {
  busy: boolean;
  modified?: boolean;
  error?: string;
  status?: number;
}

export interface PostStatus<O,I> {
  busy: boolean;
  entity?: O;
  error?: string;
  status?: number;
  retryTime?: number;
  entityIn?: I;
}
export interface State<O,I,Q> {
  queries: {[queryName:string]: Q | undefined};
  results: {[queryName:string]: Results | undefined};
  entities: {[entityId:string]: O | undefined};
  entityStatus: {[entityId:string]: EntityStatus | undefined};
  selected: {
    [queryName:string]: {
      [entityId:string]: boolean | undefined
    } | undefined
  };
  allSelected: {
    [queryName:string]: boolean | undefined;
  };
  entitiesIn: {[editorId:string] : I | undefined};
  postStatus: {[editorId:string]: PostStatus<O,I> | undefined};
}

export function createDefState<O,I,Q>():State<O,I,Q> {
  return {
    queries: {},
    results: {},
    entities: {},
    entityStatus: {},
    selected: {},
    allSelected: {},
    entitiesIn: {},
    postStatus: {}
  };
}


