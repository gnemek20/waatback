var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var sql = mysql.createConnection({
  host: 'localhost',
  prot: 3306,
  user: 'root',
  password: '1234',
  database: 'waat'
})

sql.connect((error) => {
  if (error) {
    console.error('mysql connection error')
    console.error(error)
  }
})

router.post('/signin', (req, res) => {
  const inform = {
    id: req.body.user.id,
    pwd: req.body.user.pwd
  }

  sql.query('select id, name from users where id=? and pwd=?', [inform.id, inform.pwd], (error, user) => {
    if (error) {
      console.log(error)

      res.json({
        status: false,
        msg: '시스템에 에러가 발생했습니다.'
      })
    }

    if (user[0] == undefined) {
      res.json({
        status: false,
        msg: '아이디 혹은 비밀번호를 확인해주세요.'
      })
    }
    else {
      res.json({
        status: true,
        msg: '로그인에 성공했습니다.',
        id: user[0].id,
        name: user[0].name
      })
    }
  })
})

router.post('/signup', (req, res) => {
  const inform = {
    id: req.body.user.id,
    pwd: req.body.user.pwd,
    name: req.body.user.name
  }

  sql.query('insert into users(id, pwd, name) values(?, ?, ?)', [inform.id, inform.pwd, inform.name], (error) => {
    if (error) {
      console.log(error)

      res.json({
        status: false,
        msg: '시스템에 에러가 발생했습니다.'
      })
    }
    else {
      res.json({
        status: true,
        msg: '회원가입이 완료되었습니다.'
      })
    }
  })
})

module.exports = router;
