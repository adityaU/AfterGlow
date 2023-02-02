import sjcl from 'sjcl';

const hash = async function(message) {
  const hash = sjcl.hash.sha256.hash(message)
  const hashHex = sjcl.codec.hex.fromBits(hash)
  return new Promise(function(resolve, reject) {
    resolve(hashHex)
  })
}

export default hash;
