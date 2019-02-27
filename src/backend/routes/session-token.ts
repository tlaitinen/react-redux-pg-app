import * as t from 'io-ts';
import {Errors} from 'io-ts';
import {Either} from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import cfg from '../config';
export const SessionTokenT = t.type({
  userId: t.string,
  key: t.string
});
export type SessionToken = t.TypeOf<typeof SessionTokenT>;

export async function encode(sessionToken:SessionToken, expiresIn?:number):Promise<string> {
  return new Promise((resolve:(token:string) => void, reject:(e:Error) => void) => {
    jwt.sign(SessionTokenT.encode(sessionToken), cfg.sessionKey, {
      expiresIn: expiresIn || cfg.sessionExpires
    }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

export function decode(token:string):Promise<Either<Errors, SessionToken> > {
  return new Promise((resolve, reject) => {
    jwt.verify(token, cfg.sessionKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(SessionTokenT.decode(decoded));
      }
    });
  });
}

