import React from 'react';
import {
  typedConnect,
  createPropsMapper,
  PropsOf
} from 'react-redux-typed-connect';
import SearchBar from '../components/search-bar';
import {Selectors, Actions} from '../actions/crud';
import * as qn from '../actions/crud-query-names';
export interface CreateCrudSearchBar<E,Q,RS,EI> {
  selectors: Selectors<E,EI,Q,RS>;
  actions: Actions<E,EI,Q>;
  emptyQuery: Q;
  queryText: (query:Q) => string;
  setQueryText: (query:Q, text:string) => Q;
}
export function createCrudSearchBar<E,Q,RS,EI>(options:CreateCrudSearchBar<E,Q,RS,EI>) {
  const CrudSearchBar = (props:PropsOf<typeof propsMapper>) => (
    <SearchBar 
      placeholder={props.placeholder} 
      value={options.queryText(props.query || options.emptyQuery)}
      onChange={text => {
        props.setQueryText(props.query || options.emptyQuery, text);
      }}/>
  );
  const propsMapper = createPropsMapper({
    fromState:(state:RS, ownProps:{
      queryName?:string;
      placeholder?:string;
    }) => ({
      query: options.selectors.query(state, ownProps.queryName || qn.def)
    }),
    actions: (ownProps) => ({
      setQueryText: (query:Q, text:string) => options.actions.fetchResultsLater(
        ownProps.queryName || qn.def,
        options.setQueryText(query, text),
        500
      )
    })
  })
  return typedConnect(propsMapper)(CrudSearchBar);
}

