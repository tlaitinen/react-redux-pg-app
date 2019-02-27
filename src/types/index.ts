import * as t from 'io-ts';
import {UserT} from './users';
export const IndexResultT = t.type({
  user: UserT
});
export type IndexResult = t.TypeOf<typeof IndexResultT>;
