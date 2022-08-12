const { validateAuraPlayer } = require('../../src/middlewear/aurahandler')
const express = require('express')
const {
  getAllAfter,
  getAllAfterForBrightId,
  updateIsImportant,
} = require('../../src/controllers/activityLogController')
var router = express.Router()

router.post('/create', async function (req, res, next) {
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
  res.status(201).send()
})

module.exports = router
