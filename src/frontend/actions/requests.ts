import {createStandardAction} from 'typesafe-actions';
import * as requests from '../../types/requests-api';
export type Request = requests.Request;
export const actions = {
  request: createStandardAction('REQUESTS_REQUEST')<{
    request: requests.Request;
    loadingMask: boolean;
  }>(),
  result: createStandardAction('REQUESTS_RESULT')<{
    request: requests.Request;
    response?: requests.Response;
    error?: string;
  }>()
};


