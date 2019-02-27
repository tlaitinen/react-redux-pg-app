import {rootSaga as authSaga} from './auth-saga';
import {initialLoad} from './initial-load-saga';
import {all} from 'redux-saga/effects';
import {rootSaga as usersCrud} from './users-crud';
import {rootSaga as usersSaga} from './users-saga';
import {rootSaga as userGroupsCrud} from './user-groups-crud';
import {rootSaga as userGroupsSaga} from './user-groups-saga';
import {mkRootSaga as mkLocationSaga} from './location-saga';
import {rootSaga as uiSaga} from './ui-saga';
import {rootSaga as requestsSaga} from './requests-saga';
import {rootSaga as locale} from './locale-saga';
import {History} from 'history';
export function mkRoot(history:History) {
  function* root() {
    const locationSaga = mkLocationSaga(history);
    yield all([
      authSaga(),
      usersCrud(),
      usersSaga(),
      userGroupsCrud(),
      userGroupsSaga(),
      locationSaga(),
      uiSaga(),
      requestsSaga(),
      initialLoad(),
      locale()
    ]);
  }
  return root;
}
