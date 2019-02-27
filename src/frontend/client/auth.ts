import {setJsonWebToken, get, post} from './request';
export interface SetPassword {
  userId: string;
  password: string;
}
export function setPassword(body:SetPassword):Promise<void> {
  return post('/api/set-password', body);
}
export async function tokenLogin(url:string):Promise<string | undefined> {
  const result:{jwt?:string} = await get(url + '?jwt=true');
  console.log('got result', result);
  if (result && result.jwt) {
    setJsonWebToken(result.jwt);
    return result.jwt;
  }
}

export async function login(email:string, password:string, jwt?:boolean) {
  const result:{jwt?:string} = await post('/api/auth/login', {email, password, jwt});
  if (result && result.jwt) {
    setJsonWebToken(result.jwt);
  }
}
export async function logout() {
  await post('/api/auth/logout');
  setJsonWebToken(null);
}
