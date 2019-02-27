import {loadUser} from './auth-saga';
import {userSelector} from './auth';
import {actions as usersActions} from './users-crud';
import {actions as userGroupsActions} from './user-groups-crud';
import * as qn from './crud-query-names';
import {put, select} from 'redux-saga/effects';
import {onPathNameChange, onHashChange} from './location-saga';
import {parseHash} from './location';
export function* loadInitialData() {

  const user = yield select(userSelector);
  if (user) {
    yield put(usersActions.loadMissing([user.id]));
    if (user.userGroupId) {
      yield put(userGroupsActions.fetchResults(qn.activeUserGroups, {
        active: true,
        userGroupId: user.userGroupId
      }));
    }
  }
  yield onPathNameChange(window.location.pathname);
  yield onHashChange(parseHash(window.location.hash));
}
export function* initialLoad() {
  yield loadUser();
  yield loadInitialData();
}
