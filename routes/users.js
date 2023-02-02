const { json } = require('express');
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

router.post('/user', (req, res) => {
  const inform = {
    id: req.body.user.id
  }

  sql.query('select * from users where id=?', [inform.id], (error, user) => {
    if (error) {
      console.log(error)

      res.json({
        msg: '시스템에 에러가 발생했습니다.'
      })
    }
    else {
      res.json({
        user: user[0]
      })
    }
  })
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

router.post('/validateid', (req, res) => {
  const inform = {
    id: req.body.id
  }

  sql.query('select id from users where id=?', inform.id, (error, user) => {
    if (error) {
      console.log(error)

      res.json({
        status: false,
        msg: '시스템에 에러가 발생했습니다.'
      })
    }
    else {
      if (user[0] == undefined) {
        res.json({
          status: true,
          msg: '사용 가능한 아이디입니다.'
        })
      }
      else {
        res.json({
          status: false,
          msg: '동일한 아이디가 존재합니다.'
        })
      }
    }
  })
})

router.post('/getWorkSpaces', (req, res) => {
  const id = req.body.id;

  sql.query('select * from workbench where id=?', id, (error, result) => {
    if (error) {
      console.log(error);

      return res.json({
        status: false,
        msg: '시스템에 에러가 발생했습니다.',
      });
    }
    else {
      const workspaces = [];
      for (var i = 0; i < result.length; i++) {
        workspaces.push({
          id: id,
          theme: result[i].theme,
          content: result[i].content,
          date: result[i].date,
        })
      }
      return res.json({workspaces: workspaces});
    }
  })
});

router.post('/validateWorkspaceTheme', (req, res) => {
  const functions = require('../public/javascripts/functions.js');
  const workspace = req.body.workspace;

  const isExist = functions.existsdir(`/public/workbench/${workspace.id}/${workspace.theme}`);
  return res.json({isExist: isExist})
});

router.post('/createWorkspace', (req, res) => {
  const functions = require('../public/javascripts/functions.js');
  const workspace = req.body.workspace;

  sql.query('insert into workbench(id, theme, content, date) values(?, ?, ?, ?)', [workspace.id, workspace.theme, workspace.content, workspace.date], (error) => {
    if (error) {
      console.log(error);
      
      return res.json({
        status: false,
        msg: '시스템에 에러가 발생했습니다.',
      });
    }
    else {
      functions.mkdir(`/public/workbench/${workspace.id}/${workspace.theme}/images`);
      return res.json ({
        status: true,
      });
    }
  });
});

router.post('/deleteWorkspace', (req, res) => {
  const functions = require('../public/javascripts/functions.js');
  const workspace = {
    id: req.body.workspace.id,
    theme: req.body.workspace.theme,
  }

  sql.query('delete from workbench where id=? and theme=?', [workspace.id, workspace.theme], (error) => {
    if (error) {
      console.log(error);

      return res.json({
        status: false,
        msg: '시스템에 에러가 발생했습니다.',
      });
    }
    else {
      functions.rmdir(`/public/workbench/${workspace.id}/${workspace.theme}`);
      return res.json({
        status: true,
      });
    }
  });
});

module.exports = router;
