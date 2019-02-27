import {put, call, all, takeEvery} from 'redux-saga/effects';
import {actions as locationActions} from './location';
import {Modal} from '../../types/modals';
import {getType, ActionType} from 'typesafe-actions';
import {parseRoute, HashInfo} from './location';
import base64url from 'base64url';
import {History} from 'history';
import * as qn from './crud-query-names';
import {actions as usersActions} from './users-crud';
import {actions as userGroupsActions} from './user-groups-crud';
import * as routes from './routes';
import * as defaults from './defaults';
export function* onPathNameChange(pathName:string) {
  const {limit} = defaults;
  const routeInfo = parseRoute(pathName);
  if (pathName === routes.users) {
    yield put(usersActions.fetchResults(qn.def, {active:true, limit}));
  } else if (pathName === routes.userGroups) {
    yield put(userGroupsActions.fetchResults(qn.def, {active:true, limit}));
  }
  if (routeInfo.userGroupId) {
    const {userGroupId} = routeInfo;
    yield put(usersActions.fetchResults(qn.userGroup(userGroupId), {
      userGroupId
    }));
  }

}
export function* onHashChange(hashInfo:HashInfo) {
  const m:Modal | undefined = hashInfo.modals[hashInfo.modals.length - 1];
  if (m) {
    yield call(() => {});
  }
}
export function mkRootSaga(history:History) {



  function pushPathName(pathName:string) {
    history.push(pathName + window.location.hash); 
  }

  function* onPushPathName(action:ActionType<typeof locationActions['pushPathName']>) {
    yield onPathNameChange(action.payload);
    yield call(pushPathName, action.payload);  
  }
  function pushHash(hashInfo:HashInfo) {
    const hash = base64url.encode(JSON.stringify(hashInfo));
    history.push(window.location.pathname + '#' + hash);
  }
  function* onPushHash(action:ActionType<typeof locationActions['pushHash']>) {
    yield onHashChange(action.payload);
    yield call(pushHash, action.payload);
  }
  function* rootSaga() {
    yield all([
      takeEvery(getType(locationActions.pushPathName), onPushPathName),
      takeEvery(getType(locationActions.pushHash), onPushHash)
    ]);

  }
  return rootSaga;
}
