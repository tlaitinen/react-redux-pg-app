import {ActionType, getType} from 'typesafe-actions';
import {actions} from './auth';

import {actions as uiActions} from './ui';
import * as authClient from '../client/auth';
import * as indexClient from '../client/index';
import {actions as localeActions} from './locale';
import {call, put, takeEvery, takeLatest, all} from 'redux-saga/effects';
import {initialLoad} from './initial-load-saga';


export function* loadUser() {
  try {
    yield put(uiActions.setLoading(true));
    const r = yield call(indexClient.loadUser);
    yield put(actions.setUser(r.user));
    yield put(localeActions.setLanguage(r.user.language));
  } catch (e) {
    if (e.status === 403 && e.message.startsWith('Session expired')) {
      yield put(actions.logout());
    } else if (!e.message.startsWith('Cookie')) {
      yield put(uiActions.showMessage({
        bsStyle: 'danger',
        text: e.message
      }));
    }
    console.error(e);
  } finally {
    yield put(uiActions.setLoading(false));
  }
}

export function* login(action:ActionType<typeof actions['login']>) {
  try {
    const {email, password, jwt} = action.payload;
    yield put(uiActions.setLoading(true));
    yield call(authClient.login, email, password, jwt);
    yield loadUser();
    yield initialLoad();
  } catch (e) {
    yield put(actions.loginFailed(e.message));
  } finally {
    yield put(uiActions.setLoading(false));
  }
}
function reloadLocation() {
  window.location.reload();
}
export function* logout() {
  try {
    yield call(authClient.logout);
    yield call(reloadLocation);
  } catch (e) {
    yield put(uiActions.showMessage({
      bsStyle: 'danger',
      text: e.message
    }));
  }
}
export function* rootSaga() {
  yield all([
    takeLatest(getType(actions.login), login),
    takeEvery(getType(actions.logout), logout),
  ]);
}
