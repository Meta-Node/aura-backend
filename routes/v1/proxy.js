const express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const {getRating} = require("../../src/controllers/ratingController");
const {getSpecificEnergy} = require("../../src/controllers/energyController");
const {create} = require("apisauce");
const router = express.Router();

const brightIdBaseURL = 'http://184.72.224.75'

const brightIdApi = create({
    baseURL: brightIdBaseURL,
    headers: {'Cache-Control': 'no-cache'},
})


router.post('/profile/upload/:channelId', async function (req, res, next) {
    const channelId = req.params.channelId

    const resp = await brightIdApi.post(`profile/upload/${channelId}`, req.body)
    res.sendStatus(200)
});

router.get('/profile/list/:channelId', async function (req, res, next) {

    const channelId = req.params.channelId

    const resp = await brightIdApi.get(`/profile/list/${channelId}`)
    res.json(resp.data)
});


router.get('/profile/download/:channelId/:dataId', async function (req, res, next) {
    const channelId = req.params.channelId
    const dataId = req.params.dataId

    const resp = await brightIdApi.get(`profile/download/${channelId}/${dataId}`)
    res.json(resp.data)
});

module.exports = router;