import {all, put, takeEvery} from 'redux-saga/effects';
import {SetPostStatusAction} from './crud';

import {
  Types,
  match
} from './user-groups-crud';
import * as routes from './routes';
import {actions as locationActions} from './location';

function* onPostUserGroup(action:SetPostStatusAction<Types>) {
  const entity = action.payload.postStatus.entity;
  if (entity) {
    yield put(locationActions.pushPathName(routes.userGroup(entity.id)));
  }
}


export function* rootSaga() {
  yield all([
    takeEvery(match.setPostStatus, onPostUserGroup)
  ]);
}


