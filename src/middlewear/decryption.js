const B64 = require("base64-js");
const nacl = require("tweetnacl");


function decrypt(encryptedData, publicKey) {
    const utf8Encode = new TextDecoder();
    let key = B64.toByteArray(publicKey)
    return JSON.parse(utf8Encode.decode(nacl.sign.open(Uint8Array.from(Object.values(encryptedData)), key)))
}

module.exports = {decrypt}