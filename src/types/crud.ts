import * as t from 'io-ts';

type RequireKeys<T> =
  T extends object
    ? { [P in keyof T]-?: T[P] | null }
    : T;

export interface CrudTypes<I,IO,O,OO,Q,QO> {
  base: string;
  entityIn: t.Type<I,IO>;
  emptyEntityIn: I;
  entity: t.Type<O,OO>;
  emptyQuery: RequireKeys<Q>;
  query: t.Type<Q,QO>;
  getId: (entity:O) => string;
  entitiesQuery: (ids:string[]) => Q;
  withoutOffsetLimit: (query:Q) => Q;
}

export function crudTypes<I,IO,O,OO,Q,QO>(types:CrudTypes<I,IO,O,OO,Q,QO>):CrudTypes<I,IO,O,OO,Q,QO> {
  return types;
}
export default crudTypes;
