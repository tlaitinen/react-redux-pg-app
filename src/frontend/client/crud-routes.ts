import * as request from './request';
import * as t from 'io-ts';
import {CrudTypes} from '../../types/crud';
import {NotImplementedError, APIValidationError} from './errors';

const apiBase = '/api';

export interface DatabaseRoutes<I,O,Q> {
  insert: (entityIn:I) => Promise<O>;
  update: (id:string, entity:O) => Promise<O>;
  select: (query:Q) => Promise<O[]>;
}

export function create<I,IO,O,OO extends {},Q,QO>(types:CrudTypes<I,IO,O,OO,Q,QO>):DatabaseRoutes<I,O,Q> {
  const {base} = types;
  return {
    insert: async (input:I) => {
      if (types.entityIn) {
        const oo = await request.post<OO>(apiBase + base, types.entityIn.encode(input));
        return types.entity.decode(oo).fold((errors:t.Errors) => {
          throw new APIValidationError('POST ' + apiBase + base, errors);
        }, (o:O) => o);
      } else {
        throw new NotImplementedError();
      }
    },
    update: async (id:string, input:O) => {
      if (types.entityIn) {
        const url = apiBase + base + '/' + id;
        const oo = await request.put<OO>(url, types.entity.encode(input));
        return types.entity.decode(oo).fold((errors:t.Errors) => {
          throw new APIValidationError('PUT ' + url, errors);
        }, (o:O) => o);
      } else {
        throw new NotImplementedError();
      }
    },
    select: async (query:Q) => {
      const mos = await request.get<OO[]>(apiBase + base, {query:JSON.stringify(types.query.encode(query))});
      const os:O[] = [];
      mos.forEach((mo:OO) => {
        types.entity.decode(mo).fold((errors:t.Errors) => {
          throw new APIValidationError('GET ' + apiBase + base, errors);
        }, (o:O) => os.push(o));
      });
      return os;
    }
  };
}
