const express = require('express')
const { google } = require('googleapis')
const { validateAuraPlayer } = require('../../src/middlewear/aurahandler')
const { decrypt } = require('../../src/middlewear/decryption')

var router = express.Router()

router.post('/:fromBrightId/create/', validateAuraPlayer, async function (
  req,
  res,
  next,
) {
  let decryptedPayload

  try {
    decryptedPayload = decrypt(req.body.encryptedPayload, req.body.signingKey)
  } catch (exception) {
    res
      .status(500)
      .send('Could not decrypt using publicKey: ' + req.body.signingKey)
  }

  // get feedback data
  let category
  let text
  let email
  try {
    category = decryptedPayload.category
    text = decryptedPayload.text
    email = decryptedPayload.email
  } catch {
    res.status(400).send('Invalid json request')
  }
  if (!category || !text) {
    res.status(400).send('category and text fields are required')
  }

  // load auth credentials and spreadsheet id
  credentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS)
  spreadsheetId = process.env.SHEET_ID

  // google authentication
  const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  // Create client instance for auth
  const client = await auth.getClient()

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: 'v4', auth })

  // get title of first sheet
  let sheetMetaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })
  let sheetTitle = sheetMetaData.data.sheets[0].properties.title

  // append new row to cols A:C of first sheet
  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${sheetTitle}!A:C`,
      valueInputOption: 'RAW',
      resource: {
        values: [[category, text, email]],
      },
    })
    res.status(201).send()
  } catch (e) {
    res.status(500).send('Failed to submit feedback, check input format')
  }
})

module.exports = router
