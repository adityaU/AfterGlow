export default function(maybePromise) {
 if (maybePromise != null && typeof maybePromise.then === 'function') {
    return true;
  }
  return false;
}