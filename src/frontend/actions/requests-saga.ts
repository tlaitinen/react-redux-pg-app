import {all, select, put, call, takeEvery} from 'redux-saga/effects';
import * as types from '../../types/requests-api';
import {getType, ActionType} from 'typesafe-actions';
import {actions} from './requests';
import {actions as uiActions} from './ui';
import * as client from '../client/requests';
import {i18nSelector} from './locale';

function* onSuccess(request:types.Request, _response:types.Response) {
  const i18n = yield select(i18nSelector);
  let successText:string | undefined;
  switch(request.type) {
    case 'set-password':
      successText = i18n.gettext('Password set!');
      break;
  }
  if (successText) {
    yield put(uiActions.showMessage({
      bsStyle: 'success',
      text: successText
    }));
  }
}
export function* request(action:ActionType<typeof actions.request>) {

  const {request, loadingMask} = action.payload;
  try {
    if (loadingMask) {
      yield put(uiActions.setLoading(true));
    }
    const response = yield call(client.request, request);
    yield onSuccess(request, response);
    yield put(actions.result({
      request,
      response
    }));
    if (loadingMask) {
      yield put(uiActions.setLoading(false));
    }
  } catch (e) {
    if (loadingMask) {
      yield put(uiActions.setLoading(false));
    }
    yield put(uiActions.showMessage({
      bsStyle: 'danger',
      text: e.message
    }));
    yield put(actions.result({
      request,
      error: e.message
    }));
  }
}
export function* rootSaga() {
  yield all([
    takeEvery(getType(actions.request), request),
  ]);
}

