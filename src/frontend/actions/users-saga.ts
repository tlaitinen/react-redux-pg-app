import {all, put, takeEvery} from 'redux-saga/effects';
import {SetPostStatusAction} from './crud';

import {
  Types,
  match
} from './users-crud';
import * as routes from './routes';
import {actions as locationActions} from './location';

function* onPostUser(action:SetPostStatusAction<Types>) {
  const entity = action.payload.postStatus.entity;
  if (entity) {
    yield put(locationActions.pushPathName(routes.user(entity.id)));
  }
}


export function* rootSaga() {
  yield all([
    takeEvery(match.setPostStatus, onPostUser)
  ]);
}


