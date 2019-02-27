import * as r from './request';
import {Request, Response} from '../../types/requests-api';
export type Request = Request;
export function request(request:Request):Promise<Response> {
  return r.post<Response>('/api/requests/' + request.type, request);
}
