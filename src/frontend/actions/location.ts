import {createStandardAction} from 'typesafe-actions';
import {HashInfo} from '../../types/hash-info';
import base64url from 'base64url';
export type HashInfo = HashInfo;
export interface RouteInfo {
  userGroupId?: string;
  userId?: string;
}
export const actions = {
  pushPathName: createStandardAction('LOCATION_PUSH_PATHNAME')<string>(),
  pushHash: createStandardAction('LOCATION_PUSH_HASH')<HashInfo>()
};
export function parseHash(hash:string):HashInfo {
  try {
    return JSON.parse(base64url.decode(hash));
  } catch (_e) {
    return {
      modals: []
    };
  }
}

export function parseRoute(pathName:string) {
  let m = pathName.match(/\/user-groups\/(\d+)/);
  if (m) {
    return {
      userGroupId: m[1]
    };
  }

  m = pathName.match(/\/users\/(\d+)/);
  if (m) {
    return {
      userId: m[1]
    };
  }
   
  return {};
}


