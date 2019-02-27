import React from 'react';
import {
  typedConnect,
  createPropsMapper,
  PropsOf
} from 'react-redux-typed-connect';
import {ButtonToolbar, Button} from 'react-bootstrap';
import PagedList from './paged-list';
import * as qn from '../actions/crud-query-names';
import {Actions, Selectors, EntityWithStatus} from '../actions/crud';
import FontAwesome from './font-awesome';
import * as defaults from '../actions/defaults';
export interface CreateCrudPagedList<E,Q,RS,EI> {
  selectors: Selectors<E,EI,Q,RS>;
  actions: Actions<E,EI,Q>
  emptyQuery: Q;
  offset: (query:Q) => number;
  setOffset: (query:Q, offset:number) => Q;
  searchBar?: React.Component; 
}

export function createCrudPagedList<E,Q,RS,EI>(options:CreateCrudPagedList<E,Q,RS,EI>) {
   
  const CrudPagedList = (props:PropsOf<typeof propsMapper>) => {
    const {
      query, queryResults, 
      fetchResults, renderRow,
      selectable, selected, setSelected
    } = props;
    const limit = props.limit - 1;
    const offset = options.offset(query || options.emptyQuery);
    const pages = (
      1 + Math.ceil(offset / limit) 
      + (queryResults && queryResults.results.length > limit ? 1 : 0) 
    );
    const indexToEntity = (i:number) => {
      if (!queryResults || i >= queryResults.results.length) {
        return undefined;
      }
      return queryResults.results[i];
    };
    const isSelected = (i:number) => {
      if (!selected) {
        return false;
      }
      const e = indexToEntity(i);
      return e && selected[options.selectors.entityId(e.entity)] || false;
    }
    return (
      <PagedList 
        loading={queryResults ? queryResults.loading : false}
        page={Math.floor(offset / limit)}
        pages={pages}
        rowsPerPage={limit}
        selectable={selectable}
        isSelected={isSelected}
        error={queryResults && queryResults.error 
          ? <React.Fragment>
            {queryResults.error}
            <ButtonToolbar>
              <Button
                onClick={() => fetchResults(query || options.emptyQuery)}>
                <FontAwesome fa='sync' nbsp={true}/>
              </Button>
            </ButtonToolbar>
          </React.Fragment> : undefined}
        onSelect={(i:number) => {
          const e = indexToEntity(i);
          if (e) {
            setSelected(options.selectors.entityId(e.entity), !isSelected(i));
          }
        }}
        selectPage={(p:number) => fetchResults(query || options.emptyQuery, p * limit)}
        renderRow={(i:number) => {
          const entity = indexToEntity(i);
          return entity ? renderRow(entity.entity, entity, i) : null;
        }}>
        {props.children}
      </PagedList>
    );
  };
  const propsMapper = createPropsMapper({
    fromState: (state:RS, ownProps:{
      queryName?:string;
      limit?:number;
      children: React.ReactNode;
      selectable?:boolean;
      renderRow: (entity:E, es:EntityWithStatus<E>, index?:number) => React.ReactNode;
    }) => {
      const queryName = ownProps.queryName || qn.def;
      return {
        query: options.selectors.query(state, queryName),
        queryResults: options.selectors.queryResults(state, queryName),
        selected: options.selectors.selected(state, queryName),
        limit: ownProps.limit || defaults.limit
      };
    },
    actions: (ownProps) => ({
      fetchResults: (query:Q, offset?:number) => options.actions.fetchResults(
        ownProps.queryName || qn.def,
        offset !== undefined ? options.setOffset(query, offset) : query
      ),
      setSelected: (entityId: string, selected:boolean) => options.actions.setSelected(ownProps.queryName || qn.def, entityId, selected)
    })
  });
  return typedConnect(propsMapper)(CrudPagedList);
}
