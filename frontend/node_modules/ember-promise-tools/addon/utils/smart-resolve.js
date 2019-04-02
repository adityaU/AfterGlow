import isPromise from './is-promise';
import isFulfilled from './is-fulfilled';
import getPromiseContent from './get-promise-content';

export default function(maybePromise) {
  if (!isPromise(maybePromise)) {
    // Not a promise, return value
    return maybePromise;
  }

  if (!isFulfilled(maybePromise)) {
    // Promise is still pending, return promise
    return maybePromise;
  }

  // Try to unwrap promise and get content;
  return getPromiseContent(maybePromise);
}