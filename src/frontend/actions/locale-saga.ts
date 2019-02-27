import {call, takeEvery} from 'redux-saga/effects';
import {actions} from './locale';
import {getType, ActionType} from 'typesafe-actions';
import {Language} from './languages';
import moment from 'moment';
function setLocale(language:Language) {
  moment.locale(language);
}
function* onSetLanguage(action:ActionType<typeof actions['setLanguage']>) {
  yield call(setLocale, action.payload);
}
export function* rootSaga() {
  yield takeEvery(getType(actions.setLanguage), onSetLanguage);
}
