import * as t from 'io-ts';
import crudTypes from './crud';
export const LanguageT = t.union([
  t.literal('en'),
  t.literal('fi')
]);
export type Language = t.TypeOf<typeof LanguageT>;
export const UserInT = t.type({
  email: t.string,
  userGroupId: t.union([t.string, t.null]),
  admin: t.boolean,
  groupAdmin: t.boolean,
  firstName: t.union([t.string, t.null]),
  lastName: t.union([t.string, t.null]),
  language: LanguageT,
  active: t.boolean
});
export type UserIn = t.TypeOf<typeof UserInT>;
export const emptyUserIn:UserIn = {
  email: '',
  userGroupId: null,
  admin: false,
  groupAdmin: false,
  firstName: null,
  lastName: null,
  language: 'en',
  active: true
};

export const UserT = t.intersection([
  t.type({
    id:t.string
  }), 
  UserInT
]);
export type User = t.TypeOf<typeof UserT>;

export const QueryT = t.partial({
  authId: t.string,
  userGroupId: t.string,
  ids: t.array(t.string),
  offset: t.number,
  limit: t.number,
  email: t.string,
  query: t.string,
  active: t.boolean
});
export type Query = t.TypeOf<typeof QueryT>;

export const types = crudTypes({
  base: '/users',
  entityIn: UserInT,
  emptyEntityIn: emptyUserIn,
  query: QueryT,
  entity: UserT,
  emptyQuery: {
    authId: null,
    userGroupId: null,
    ids: null,
    offset: null,
    limit: null,
    email: null,
    query: null,
    active: null
  },
  entitiesQuery: (ids) => ({ids}),
  withoutOffsetLimit: q => ({...q, offset:undefined, limit:undefined}),
  getId: (u:User) => u.id
});
export type Types = typeof types;


