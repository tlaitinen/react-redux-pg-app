import {createCrudSearchBar} from './crud-search-bar';
import {createCrudPagedList} from './crud-paged-list';
import {createCrudEditor} from './crud-editor';

import {Actions, Selectors} from '../actions/crud';
export interface CreateCrudComponents<E,Q,RS,EI> {
  selectors: Selectors<E,EI,Q,RS>;
  actions: Actions<E,EI,Q>;
  emptyQuery: Q;
  queryText: (query:Q) => string;
  setQueryText: (query:Q, text:string) => Q;
	offset: (query:Q) => number;
	setOffset: (query:Q, offset:number) => Q;
}

export function createCrudComponents<E,Q,RS,EI>(options:CreateCrudComponents<E,Q,RS,EI>) {
  return {
    SearchBar: createCrudSearchBar(options),
    PagedList: createCrudPagedList(options),
    Editor: createCrudEditor(options)
  };
}

