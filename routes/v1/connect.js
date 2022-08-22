var express = require('express')
const axios = require('axios')
const AES = require('crypto-js/aes')
const Utf8 = require('crypto-js/enc-utf8')
const B64 = require('base64-js')
const {
  persistSigningKey,
} = require('../../src/controllers/brightIdController')
const nacl = require('tweetnacl')
const { decrypt } = require('../../src/middlewear/decryption')

const router = express.Router()

router.post('/', async function (req, res, next) {
  let pk = req.body.publicKey
  let brightId = req.body.brightId
  let encryptedTimestamp = req.body.encryptedTimestamp
  if (
    pk === undefined ||
    brightId === undefined ||
    encryptedTimestamp === undefined
  ) {
    res.status(500).send('Missing body params')
  }
  try {
    await validateSigningKey(brightId, encryptedTimestamp, pk)
    await persistSigningKey(brightId, pk)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.post('/explorer-code', async function (req, res, next) {
  let pk = req.body.publicKey
  let brightId = req.body.brightId
  let key = req.body.key
  let password = req.body.password
  if (
    pk === undefined ||
    brightId === undefined ||
    key === undefined ||
    password === undefined
  ) {
    res.status(500).send('Missing body params')
  }
  try {
    await pullProfilePhoto(key, brightId, password)
    await persistSigningKey(brightId, pk)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

async function pullProfilePhoto(key, brightId, password) {
  let encryptedUserPicture = await axios.get(
    `https://recovery.brightid.org/backups/${key}/${brightId}`,
  )
  return AES.decrypt(encryptedUserPicture.data, password).toString(Utf8)
}

async function validateSigningKey(brightId, encryptedData, pk) {
  let keys = await axios
    .get(`https://app.brightid.org/node/v5/users/${brightId}`)
    .then((data) => {
      return data.data.data.signingKeys
    })
    .catch(() => undefined)

  if (keys === undefined) {
    throw new Error(
      `[brightId: ${brightId}] problem fetching keys for brightId`,
    )
  }

  if (!keys.includes(pk)) {
    throw new Error(
      `[brightId: ${brightId}] public key not in list of signing keys`,
    )
  }

  try {
    let decryptedObj = decrypt(encryptedData, pk)
    let timestamp = decryptedObj['timestamp']
    let currentTime = Date.now()
    if (Math.abs(currentTime - timestamp) > 43200000) {
      console.log(`[brightId: ${brightId}] timestamp delta too large`)
      throw new Error()
    }
  } catch (e) {
    throw new Error(
      `[brightId: ${brightId}] could not decrypt data: ${encryptedData} with signingKey ${pk} with error ${e}`,
    )
  }
}

module.exports = router
