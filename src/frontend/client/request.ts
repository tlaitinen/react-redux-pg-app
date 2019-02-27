import 'whatwg-fetch';
import * as qs from 'qs';
import {RequestError} from './errors';
let jwt:string | null = null;
export function setJsonWebToken(t:string | null) {
  jwt = t;
}
export function hasJsonWebToken():boolean {
  return jwt !== null;
}
export function getJsonWebToken():string | null {
  return jwt;
}
export function request<T>(method:string, route:string, headersObj:{[header:string]:string}, body?:string | Blob | FormData):Promise<T> {
  const headers = new Headers();
  if (typeof headersObj === 'object') {
    Object.keys(headersObj).forEach(function (key:string) {
      const value:string = headersObj[key];
      headers.append(key, value);
    });
  }
  headers.append('Accept', 'application/json');
  if (jwt) {
    headers.append('Authorization', 'Bearer ' + jwt);
  }
  return fetch(route, {
    method,
    body,
    headers,
    credentials: 'same-origin'
  }).then(resp => {
    if (!resp.ok) {
      if (resp.status >= 500 || resp.status < 400) {
        throw new RequestError(resp.status, 'Internal error: ' + resp.status);
      }
      return resp.text().then(err => {
        console.error(err);
        throw new RequestError(resp.status, err);
      });
    }
    return resp.json();
  });
}
export function formPost<T>(
  route:string, 
  data:{[param:string] : string | Blob}
) {
  const fd = new FormData();
  Object.keys(data).forEach(k => fd.append(k, data[k]));
  return request<T>('POST', route, {}, fd);
}
export function post<T>(route:string, data?:Object) {
  return request<T>('POST', route, {'Content-Type': 'application/json'}, data ? JSON.stringify(data) : undefined);
}
export function put<T>(route:string, data:Object) {
  return request<T>('PUT', route, {'Content-Type': 'application/json'}, JSON.stringify(data));
}
export function get<T>(route:string, data?:Object) {
  let query = (typeof data === 'object') ? ('?' + qs.stringify(data)) : '';

  return request<T>('GET', route + query, {});
}
export function delete_<T>(route:string) {
  return request<T>('DELETE', route, {});
}
