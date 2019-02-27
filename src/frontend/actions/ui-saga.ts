import {all, put, takeEvery} from 'redux-saga/effects';
import {getType, ActionType} from 'typesafe-actions';
import {actions as uiActions} from './ui';
import {parseHash, actions as locationActions} from './location';
import {delay} from 'redux-saga';


function* onShowModal(action:ActionType<typeof uiActions['showModal']>) {
  const hashInfo = parseHash(window.location.hash);
  yield put(locationActions.pushHash({
    ...hashInfo,
    modals: hashInfo.modals.concat(action.payload)
  }));
}

function* onHideModal(_action:ActionType<typeof uiActions['hideModal']>) {
  const hashInfo = parseHash(window.location.hash);
  yield put(locationActions.pushHash({
    ...hashInfo,
    modals: hashInfo.modals.slice(0, -1)
  }));
}

function* onShowMessage(action:ActionType<typeof uiActions['showMessage']>) {
  yield put(uiActions.pushMessage({
    ...action.payload,
    time: new Date().getTime()
  }));
  yield delay(2500);
  yield put(uiActions.popMessage());
}
export function* rootSaga() {
  yield all([
    takeEvery(getType(uiActions.showModal), onShowModal),
    takeEvery(getType(uiActions.hideModal), onHideModal),
    takeEvery(getType(uiActions.showMessage), onShowMessage)
  ]);
}
