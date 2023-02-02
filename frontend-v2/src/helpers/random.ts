import sjcl from 'sjcl';

const randomID = function() {
  return Math.abs(sjcl.random.randomWords(1))
}

export { randomID }
