var express = require('express');
var router = express.Router();

const usernameParam = "brightId";
const passwordParam = "brightIdPassword"
/* GET home page. */
router.post('/', function (req, res, next) {
    console.log(req.body);
    loginUser(req.body["brightId"], req.body["brightIdPassword"])

    res.json(req.body)
});


function loginUser(username, password) {
    if (username == null) {
      throw new Error("Missing username in body")
    }
    if (password == null) {
      throw new Error("Missing password in body")
    }
}

module.exports = router;
