import {get} from './request';
import {APIValidationError} from './errors';
import {IndexResult, IndexResultT} from '../../types/index';
export async function loadUser():Promise<IndexResult> {
  const r = await get('/api/');
  return IndexResultT.decode(r).fold(errors => {
    throw new APIValidationError('GET /api/', errors);
  }, r => r);
}
