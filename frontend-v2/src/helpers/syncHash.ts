import sjcl from 'sjcl';

const hash = function(message) {
  const hash = sjcl.hash.sha256.hash(message)
  return sjcl.codec.hex.fromBits(hash)
}

export default hash;
