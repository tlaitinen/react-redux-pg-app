import * as errors from '../../backend/routes/errors';
import * as t from 'io-ts';
export class APIValidationError extends errors.ValidationError {
  constructor(info:string, errors:t.Errors) {
  	super(`Validation error at ${info}: ${JSON.stringify(errors, null, 2)}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class NotImplementedError extends errors.ValidationError {
  constructor() {
    super('Not implemented');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RequestError extends errors.ValidationError {
  status: number;
  constructor(status:number, message?:string) {
    super(message || 'Request failed');
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


