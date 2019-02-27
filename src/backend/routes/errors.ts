import {Errors} from 'io-ts';
import {
  NotFound as DBNotFound,
  AccessDenied as DBAccessDenied, 
  InvalidRequest as DBInvalidRequest
} from '../db/errors';
export const NotFound = DBNotFound;
export const AccessDenied = DBAccessDenied;
export const InvalidRequest = DBInvalidRequest;
export class ValidationError extends Error {
  constructor(message?: string) {
    super(message || 'Validation error');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export async function validationFailed<T=void>(_errors:Errors):Promise<T> { 
  throw new ValidationError();
}
export function validationFailedArg<T>() {
  return (errors:Errors) => validationFailed<T>(errors);
}
