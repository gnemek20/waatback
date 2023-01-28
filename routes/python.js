var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname + '\\users.js')
})

module.exports = router;
