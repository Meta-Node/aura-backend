const express = require('express')
const { google } = require('googleapis')

var router = express.Router()

router.post('/create', async function (req, res, next) {
  // get feedback data
  let category
  let text
  try {
    category = req.body.category
    text = req.body.text
  } catch {
    res.status(400).send('Invalid json request')
  }
  if (!category || !text) {
    res.status(400).send('category and text fields are required')
  }

  // load auth credentials and spread sheet id
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

  let sheetMetaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  // get title of first sheet
  let sheetTitle = sheetMetaData.data.sheets[0].properties.title

  // append new row to cols A:B of first sheet in spread sheet
  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `${sheetTitle}!A:B`,
    valueInputOption: 'RAW',
    resource: {
      values: [[category, text]],
    },
  })

  res.status(201).send()
})

module.exports = router