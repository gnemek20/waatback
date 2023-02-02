var express = require('express');
var router = express.Router();

const multer = require('multer')
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, `routes/${req.body.id}/saveImages/`)
  },
  filename(req, file, callback) {
    callback(null, file.originalname)
  }
})
const upload = multer({storage: storage})

const saveStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'public/images/')
  },
  filename(req, file, callback) {
    callback(null, file.originalname)
  }
})
const saveUpload = multer({storage: saveStorage})

router.get('/image', (req, res) => {
  res.sendFile(`${process.cwd()}\\public\\images\\chicken01.png`)
})

router.post('/mkdir', (req, res) => {
  const fs = require('fs')

  fs.mkdirSync(`${__dirname}\\${req.body.id}\\saveImages`, {recursive: true})
  fs.mkdirSync(`${__dirname}\\${req.body.id}\\saveXmls`, {recursive: true})

  res.json({})
})

router.post('/saveimages', saveUpload.array('image', 5), (req, res) => {})

router.post('/inference', upload.array('image', 5), (req, res) => {
  console.log(req.files)

  const id = req.body.id
  const image_dir = `${__dirname}\\${id}\\saveImages`
  const save_dir = `${__dirname}\\${id}\\saveXmls`
  const pretrained_model = 'YOLOv5'

  const result = require('child_process').spawn('python', ['./public/pythons/InferenceWeb.py', image_dir, '', save_dir, pretrained_model])
  result.stdout.on('data', (data) => {
    console.log(data.toString())
  })
  result.stderr.on('data', (data) => {
    console.log(data.toString())
  })

  setTimeout(() => {
    console.log('zip파일 전송중 . . .')

    const zip = require('express-zip')
  
    let zip_file = [];
    for (var i = 0; i < req.files.length; i++) {
      zip_file.push({
        path: `${save_dir}\\${req.files[i].originalname.slice(0, -4)}.xml`,
        name: `${req.files[i].originalname.slice(0, -4)}.xml`
      })
    }

    res.zip(zip_file, 'waat.zip')
  }, 7000)

  setTimeout(() => {
    console.log('파일 삭제중 . . .')

    const fs = require('fs')
    fs.rm(`${__dirname}\\${id}`, {recursive: true}, (error) => {
      if (error) console.log(error)
    })
  }, 7100)
})

module.exports = router;
