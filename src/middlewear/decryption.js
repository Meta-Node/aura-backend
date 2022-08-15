const B64 = require('base64-js')
const nacl = require('tweetnacl')

function decrypt(encryptedData, publicKey) {
  if (encryptedData === undefined || publicKey === null) {
    throw new Error('Missing data')
  }
  const utf8Encode = new TextDecoder()
  let key = B64.toByteArray(publicKey)
  let payload = Uint8Array.from(Object.values(encryptedData))
  let decoded = nacl.sign.open(payload, key)
  if (decoded === undefined || decoded === null) {
    throw new Error('Could not decode data')
  }
  return JSON.parse(utf8Encode.decode(decoded))
}

module.exports = { decrypt }
