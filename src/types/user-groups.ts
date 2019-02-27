import * as t from 'io-ts';
import crudTypes from './crud';

export const UserGroupInT = t.type({
  name: t.string,
  userGroupId: t.union([t.string, t.null]),
  active: t.boolean
});
export type UserGroupIn = t.TypeOf<typeof UserGroupInT>;
export const emptyUserGroupIn:UserGroupIn = {
  name: '',
  userGroupId: null,
  active: true
};

export const UserGroupT = t.intersection([
  t.type({
    id:t.string
  }),
  UserGroupInT
]);
export type UserGroup = t.TypeOf<typeof UserGroupT>;

export const QueryT = t.partial({
  authId: t.string,
  userGroupId: t.string,
  ids: t.array(t.string),
  query: t.string,
  offset: t.number,
  limit: t.number,
  active: t.boolean
});
export type Query = t.TypeOf<typeof QueryT>;

export const types = crudTypes({
  base: '/user-groups',
  entityIn: UserGroupInT,
  emptyEntityIn: emptyUserGroupIn,
  query: QueryT,
  entity: UserGroupT,
  emptyQuery: {
    authId: null,
    userGroupId: null,
    ids: null,
    query: null,
    offset: null,
    limit: null,
    active: null
  },
  entitiesQuery: (ids) => ({ids}),
  withoutOffsetLimit: q => ({...q, offset: undefined, limit: undefined}),
  getId: (ug:UserGroup) => ug.id
});
export type Types = typeof types;
