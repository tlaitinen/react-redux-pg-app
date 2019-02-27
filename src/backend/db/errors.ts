export class AccessDenied extends Error {
  constructor(message?: string) {
    super(message || 'Access denied');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class NotFound extends Error {
  constructor(message?: string) {
    super(message || 'Not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class InvalidRequest extends Error {
  constructor(message?: string) {
    super(message || 'Invalid request');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class InternalError extends Error {
  constructor(message?: string) {
    super(message || 'Internal error');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

