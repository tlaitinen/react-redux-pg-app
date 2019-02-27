const polyfills:((cb:() => void) => void)[]= [];
import 'array-reverse-polyfill';
const es6Promise = require('es6-promise');
const es6ObjectAssign = require('es6-object-assign');
const whatwgFetch = require('whatwg-fetch');
const arrayFind = require('array.prototype.find');
const objectValues = require('object.values');

if (typeof Promise !== 'function') {
  polyfills.push(cb => {
    es6Promise.polyfill();
    cb();
  });
}

if (typeof Object.assign !== 'function') {
  polyfills.push(cb => {
    es6ObjectAssign.polyfill();
    cb();
  });
}

if (typeof fetch !== 'function') {

  polyfills.push(cb => {
    whatwgFetch(cb);
  });
}
if (typeof [].find !== 'function') {
  polyfills.push(cb => {
    arrayFind.shim();
    cb();
  });
}
if (typeof Object.values !== 'function') {
  polyfills.push(cb => {
    objectValues.shim();
    cb();
  });
}


export default function(cb:() => void) {
  const callPolyfill = (i:number) => {
    if (!polyfills[i]) return cb();
    polyfills[i](() => callPolyfill(i+1));
  };
  callPolyfill(0);
}

